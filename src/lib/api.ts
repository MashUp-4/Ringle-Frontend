interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T | null
}

type ApiErrorKind = 'http' | 'timeout' | 'network' | 'response'
export class ApiError extends Error {
  readonly status: number
  readonly kind: ApiErrorKind
  constructor(message: string, status: number, kind: ApiErrorKind = 'http') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.kind = kind
  }
}

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '/backend').replace(
  /\/$/,
  '',
)

// GETs may wait for a sleeping server, but have a bounded total budget.
const READ_BUDGET_MS = 75000
const READ_ATTEMPT_MS = 45000
const CACHE_MS = 30000
const MAX_CACHE_ENTRIES = 100

export function createApiClient(
  options: {
    fetch?: typeof fetch
    now?: () => number
    delay?: (ms: number) => Promise<void>
    timeout?: (ms: number) => AbortSignal
  } = {},
) {
  const request =
    options.fetch ?? ((...args: Parameters<typeof fetch>) => fetch(...args))
  const now = options.now ?? Date.now
  const delay =
    options.delay ??
    ((ms) => new Promise<void>((resolve) => setTimeout(resolve, ms)))
  const timeout = options.timeout ?? ((ms) => AbortSignal.timeout(ms))
  const cache = new Map<string, { data: unknown; expires: number }>()
  const pending = new Map<string, Promise<unknown>>()
  let generation = 0

  function invalidate() {
    generation += 1
    cache.clear()
  }

  function classify(error: unknown): ApiError {
    if (error instanceof ApiError) return error
    if (
      error instanceof Error &&
      ['TimeoutError', 'AbortError'].includes(error.name)
    ) {
      return new ApiError('서버 응답 대기 시간이 초과됐어요.', 0, 'timeout')
    }
    if (error instanceof TypeError)
      return new ApiError('서버에 연결하지 못했어요.', 0, 'network')
    return new ApiError('서버 응답 형식을 확인할 수 없어요.', 0, 'response')
  }

  async function read<T>(path: string): Promise<T> {
    const deadline = now() + READ_BUDGET_MS
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const remaining = deadline - now()
        if (remaining <= 0)
          throw new ApiError('서버 응답 대기 시간이 초과됐어요.', 0, 'timeout')
        const response = await request(`${baseUrl}${path}`, {
          headers: { Accept: 'application/json' },
          signal: timeout(Math.min(READ_ATTEMPT_MS, remaining)),
        })
        if (!response.ok)
          throw new ApiError('서버 요청에 실패했어요.', response.status)
        const body: ApiResponse<T> = await response.json()
        if (!body.success || body.data == null) {
          throw new ApiError(
            body.message || '응답 데이터를 확인할 수 없어요.',
            response.status,
            'response',
          )
        }
        return body.data
      } catch (error) {
        const failure = classify(error)
        const retryable =
          failure.kind === 'timeout' ||
          failure.kind === 'network' ||
          [502, 503, 504].includes(failure.status)
        if (attempt === 1 || !retryable || deadline - now() <= 1000)
          throw failure
        await delay(1000)
      }
    }
    throw new ApiError('서버에 연결하지 못했어요.', 0, 'network')
  }

  function get<T>(path: string): Promise<T> {
    const cached = cache.get(path)
    if (cached && cached.expires > now())
      return Promise.resolve(cached.data as T)
    cache.delete(path)
    const epoch = generation
    const key = `${epoch}:${path}`
    const existing = pending.get(key)
    if (existing) return existing as Promise<T>
    const promise = read<T>(path)
      .then((data) => {
        // A read started before a mutation must never repopulate the cache.
        if (generation === epoch) {
          cache.set(path, { data, expires: now() + CACHE_MS })
          if (cache.size > MAX_CACHE_ENTRIES)
            cache.delete(cache.keys().next().value!)
        }
        return data
      })
      .finally(() => pending.delete(key))
    pending.set(key, promise)
    return promise
  }

  async function write(path: string, method: 'POST' | 'DELETE'): Promise<void> {
    try {
      const response = await request(`${baseUrl}${path}`, {
        method,
        headers: { Accept: 'application/json' },
        signal: timeout(30000),
      })
      if (!response.ok)
        throw new ApiError('변경 요청에 실패했어요.', response.status)
      const body: ApiResponse<null> = await response.json()
      if (!body.success)
        throw new ApiError(
          body.message || '변경을 저장하지 못했어요.',
          response.status,
          'response',
        )
    } catch (error) {
      throw classify(error)
    } finally {
      // An uncertain write may also have reached the server. Always re-read afterward.
      invalidate()
    }
  }
  function peek<T>(path: string): T | undefined {
    const entry = cache.get(path)
    return entry && entry.expires > now() ? (entry.data as T) : undefined
  }
  return { get, write, invalidate, peek }
}

const client = createApiClient()
export const getCachedApiData = client.peek
export const apiGet = client.get
export const apiWrite = client.write
export const invalidateApiCache = client.invalidate

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback
  if (error.kind === 'timeout')
    return '서버 응답이 오래 걸려 조회를 마치지 못했어요. 잠시 후 다시 시도해 주세요.'
  if (error.kind === 'network')
    return '서버에 연결하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.'
  if (error.status >= 500)
    return '서버에서 오류가 발생했어요. 잠시 후 다시 시도해 주세요.'
  return fallback
}
