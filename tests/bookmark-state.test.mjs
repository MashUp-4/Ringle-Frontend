import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

let moduleId = 0

// Exercise the real store through its hook API without React scheduling or a server.
async function loadBookmarks(apiWrite) {
  const key = `__bookmarkTestWrite${moduleId++}`
  const source = (
    await readFile(
      new URL(
        '../src/features/tutors/hooks/useServerBookmarks.ts',
        import.meta.url,
      ),
      'utf8',
    )
  )
    .replace(
      /import \{[^}]+\} from 'react'/,
      'const useSyncExternalStore = (_, getSnapshot) => getSnapshot(); const useEffect = (effect) => effect();',
    )
    .replace(
      "import { apiWrite } from '../../../lib/api'",
      `const apiWrite = globalThis[${JSON.stringify(key)}];`,
    )
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  })
  globalThis[key] = apiWrite
  try {
    const { useServerBookmarks } = await import(
      `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
    )
    return useServerBookmarks
  } finally {
    delete globalThis[key]
  }
}

test('late home/list DTOs and absent bookmark fields preserve a successful write', async () => {
  const writes = []
  const render = await loadBookmarks(async (path, method) => {
    writes.push({ path, method })
  })
  const original = { id: 6, name: 'Noah S.', isMyTutor: false }
  assert.equal(render([original]).isSaved(original), false)
  assert.equal(await render([original]).toggleBookmark(original), true)

  const lateListDto = { ...original }
  assert.equal(render([lateListDto]).isSaved(lateListDto), true)
  const scheduledTutor = { id: 6, name: 'Noah S.' }
  assert.equal(render([scheduledTutor]).isSaved(scheduledTutor), true)
  assert.equal(
    await render([scheduledTutor]).toggleBookmark(scheduledTutor),
    true,
  )
  assert.deepEqual(writes, [
    { path: '/users/me/favorite-tutors/6', method: 'POST' },
    { path: '/users/me/favorite-tutors/6', method: 'DELETE' },
  ])
  const lateSavedDto = { ...original, isMyTutor: true }
  assert.equal(render([lateSavedDto]).isSaved(lateSavedDto), false)
})

test('concurrent clicks for the same tutor send one write and clear pending on success', async () => {
  let completeWrite
  const write = new Promise((resolve) => {
    completeWrite = resolve
  })
  const writes = []
  const render = await loadBookmarks(async (path, method) => {
    writes.push({ path, method })
    await write
  })
  const tutor = { id: 42, name: 'Rina', isMyTutor: false }
  const first = render([tutor]).toggleBookmark(tutor)
  assert.equal(render([tutor]).isPending(tutor), true)
  assert.equal(await render([tutor]).toggleBookmark(tutor), false)
  assert.equal(writes.length, 1)

  completeWrite()
  assert.equal(await first, true)
  const after = render([tutor])
  assert.equal(after.isPending(tutor), false)
  assert.equal(after.isSaved(tutor), true)
})

test('failed writes retain the saved state, expose an error and allow retry', async () => {
  let fail = false
  const methods = []
  const render = await loadBookmarks(async (_, method) => {
    methods.push(method)
    if (fail) throw new Error('Server unavailable')
  })
  const tutor = { id: 9, name: 'Grace H.', isMyTutor: false }
  assert.equal(await render([tutor]).toggleBookmark(tutor), true)
  fail = true
  assert.equal(await render([tutor]).toggleBookmark(tutor), false)
  const afterFailure = render([tutor])
  assert.equal(afterFailure.isSaved(tutor), true)
  assert.equal(afterFailure.isPending(tutor), false)
  assert.match(afterFailure.storageError, /저장하지 못했어요/)

  fail = false
  assert.equal(await afterFailure.toggleBookmark(tutor), true)
  const afterRetry = render([tutor])
  assert.equal(afterRetry.isSaved(tutor), false)
  assert.equal(afterRetry.isPending(tutor), false)
  assert.equal(afterRetry.storageError, '')
  assert.deepEqual(methods, ['POST', 'DELETE', 'DELETE'])
})
