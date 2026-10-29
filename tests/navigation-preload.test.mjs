import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = (
  await readFile(new URL('../src/lib/preload.ts', import.meta.url), 'utf8')
).replace(
  "import { apiGet } from './api'",
  'const apiGet = async () => undefined',
)
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
})
const { createPagePreloader } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)
const flush = () => new Promise((resolve) => setImmediate(resolve))

test('home data takes priority, then adjacent tutor pages warm without waiting for optional summary', async () => {
  const calls = []
  let releaseHome
  const preloader = createPagePreloader(async (path) => {
    calls.push(path)
    if (path === '/users/me/home')
      await new Promise((resolve) => {
        releaseHome = resolve
      })
    if (path === '/users/me/summary') await new Promise(() => {})
  })
  preloader.preloadInitialData('/', '')
  assert.ok(calls.includes('/users/me/home'))
  assert.ok(!calls.some((path) => path.startsWith('/tutors')))
  releaseHome()
  await flush()
  assert.ok(calls.includes('/tutors?isFeatured=true'))
  assert.ok(calls.includes('/tutors'))
})

test('failed entry request does not fan out into more background requests', async () => {
  const calls = []
  const preloader = createPagePreloader(async (path) => {
    calls.push(path)
    throw new Error('offline')
  })
  preloader.preloadInitialData('/tutors', '')
  await flush()
  assert.ok(!calls.includes('/users/me/home'))
  assert.ok(!calls.includes('/tutors'))
})

test('filtered list navigation does not fetch an unfiltered list or unrelated pages', async () => {
  const calls = []
  const { preloadPageData } = createPagePreloader(async (path) => {
    calls.push(path)
  })
  await preloadPageData('/tutors/all', '?saved=1')
  assert.deepEqual(calls, ['/users/me/class-counts'])
  calls.length = 0
  await preloadPageData('/unknown')
  assert.deepEqual(calls, [])
})
