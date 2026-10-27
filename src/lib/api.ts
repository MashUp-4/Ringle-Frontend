interface ApiResponse<T> {
  success: boolean
  code: string
  message: string
  data: T | null
}

export class ApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '/backend').replace(
  /\/$/,
  '',
)

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok)
    throw new ApiError('서버 요청에 실패했어요.', response.status)
  const body: ApiResponse<T> = await response.json()
  if (!body.success || body.data == null) {
    throw new ApiError(
      body.message || '응답 데이터를 확인할 수 없어요.',
      response.status,
    )
  }
  return body.data
}

export async function apiWrite(
  path: string,
  method: 'POST' | 'DELETE',
): Promise<void> {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok)
    throw new ApiError('변경 요청에 실패했어요.', response.status)
  const body: ApiResponse<null> = await response.json()
  if (!body.success)
    throw new ApiError(
      body.message || '변경을 저장하지 못했어요.',
      response.status,
    )
}
