import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = (
  await readFile(new URL('../src/lib/api.ts', import.meta.url), 'utf8')
).replace('import.meta.env.VITE_API_BASE_URL', 'undefined')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ES2022,
  },
})
const { createApiClient, getApiErrorMessage } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
)
const ok = (data) => new Response(JSON.stringify({ success: true, data }))
const instant = {
  delay: async () => {},
  timeout: () => new AbortController().signal,
}

test('parallel reads deduplicate; fresh cache survives navigation and expires at 30 seconds', async () => {
  let clock = 0,
    calls = 0
  const client = createApiClient({
    ...instant,
    now: () => clock,
    fetch: async () => {
      calls++
      return ok({ count: calls })
    },
  })
  assert.equal(client.peek('/tutors'), undefined)
  const [a, b] = await Promise.all([
    client.get('/tutors'),
    client.get('/tutors'),
  ])
  assert.deepEqual(a, b)
  assert.deepEqual(client.peek('/tutors'), a)
  assert.equal(calls, 1)
  clock = 29999
  await client.get('/tutors')
  assert.equal(calls, 1)
  clock = 30000
  assert.equal(client.peek('/tutors'), undefined)
  await client.get('/tutors')
  assert.equal(calls, 2)
  await client.get('/tutors?search=Rina')
  assert.equal(calls, 3)
  client.invalidate()
  assert.equal(client.peek('/tutors'), undefined)
  await client.get('/tutors')
  assert.equal(calls, 4)
})

test('cold-start timeout retries once within the 75-second total budget', async () => {
  let clock = 0,
    calls = 0
  const budgets = []
  const client = createApiClient({
    now: () => clock,
    timeout: (ms) => {
      budgets.push(ms)
      return new AbortController().signal
    },
    delay: async (ms) => {
      clock += ms
    },
    fetch: async () => {
      calls++
      clock += budgets.at(-1)
      throw new DOMException('slow server', 'TimeoutError')
    },
  })
  await assert.rejects(
    client.get('/slow'),
    (e) =>
      e.kind === 'timeout' &&
      getApiErrorMessage(e, 'fallback').includes('서버 응답이 오래'),
  )
  assert.equal(calls, 2)
  assert.deepEqual(budgets, [45000, 29000])
  assert.equal(clock, 75000)
})

test('transient gateway failures retry once and recover', async () => {
  let calls = 0
  const client = createApiClient({
    ...instant,
    fetch: async () =>
      ++calls === 1 ? new Response('', { status: 503 }) : ok({ ready: true }),
  })
  assert.deepEqual(await client.get('/home'), { ready: true })
  assert.equal(calls, 2)
})

test('client errors, malformed JSON and business failures do not retry or enter cache', async () => {
  for (const response of [
    () => new Response('{}', { status: 400 }),
    () => new Response('not json'),
    () =>
      new Response(
        JSON.stringify({ success: false, data: null, message: '잘못된 요청' }),
      ),
  ]) {
    let calls = 0
    const client = createApiClient({
      ...instant,
      fetch: async () => {
        calls++
        return response()
      },
    })
    await assert.rejects(client.get('/bad'))
    assert.equal(calls, 1)
    await assert.rejects(client.get('/bad'))
    assert.equal(calls, 2)
  }
})

test('network failures are distinguished and retried only once', async () => {
  let calls = 0
  const client = createApiClient({
    ...instant,
    fetch: async () => {
      calls++
      throw new TypeError('Failed to fetch')
    },
  })
  await assert.rejects(
    client.get('/offline'),
    (e) =>
      e.kind === 'network' &&
      getApiErrorMessage(e, 'fallback').includes('인터넷 연결'),
  )
  assert.equal(calls, 2)
})

test('writes never retry and invalidate reads even on an uncertain timeout', async () => {
  let reads = 0,
    writes = 0
  const client = createApiClient({
    ...instant,
    fetch: async (_, options) => {
      if (options.method) {
        writes++
        throw new DOMException('slow write', 'TimeoutError')
      }
      reads++
      return ok({ saved: false })
    },
  })
  await client.get('/tutors')
  await assert.rejects(client.write('/favorite/1', 'POST'))
  assert.equal(writes, 1)
  await client.get('/tutors')
  assert.equal(reads, 2)
})

test('a read predating a mutation cannot repopulate cache or be reused by a fresh read', async () => {
  let release,
    reads = 0
  const client = createApiClient({
    ...instant,
    fetch: async (_, options) => {
      if (options.method) return ok(null)
      reads++
      if (reads === 1)
        return new Promise((resolve) => {
          release = () => resolve(ok({ saved: false }))
        })
      return ok({ saved: true })
    },
  })
  const old = client.get('/tutors')
  await client.write('/favorite/1', 'POST')
  const fresh = await client.get('/tutors')
  release()
  await old
  assert.deepEqual(fresh, { saved: true })
  assert.deepEqual(await client.get('/tutors'), { saved: true })
  assert.equal(reads, 2)
})

test('recent data remains available during background refresh, but is bounded and invalidated by writes', async () => {
  let clock = 0
  let resolveRefresh
  let calls = 0
  const client = createApiClient({
    ...instant,
    now: () => clock,
    fetch: async (_url, options) => {
      if (options?.method) return ok(null)
      calls++
      if (calls === 2)
        return new Promise((resolve) => {
          resolveRefresh = resolve
        })
      return ok({ count: calls })
    },
  })
  await client.get('/tutors')
  clock = 30000
  assert.equal(client.peek('/tutors'), undefined)
  assert.deepEqual(client.peek('/tutors', true), { count: 1 })
  const refresh = client.get('/tutors')
  assert.equal(calls, 2)
  assert.deepEqual(client.peek('/tutors', true), { count: 1 })
  resolveRefresh(ok({ count: 2 }))
  await refresh
  assert.deepEqual(client.peek('/tutors', true), { count: 2 })
  clock += 300000
  assert.equal(client.peek('/tutors', true), undefined)
  await client.get('/tutors')
  await client.write('/users/me/favorite-tutors/1', 'POST')
  assert.equal(client.peek('/tutors', true), undefined)
})
