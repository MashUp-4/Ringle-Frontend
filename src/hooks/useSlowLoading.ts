import { useEffect, useState } from 'react'

export function useSlowLoading(loading: boolean, requestKey: string) {
  const [slowKey, setSlowKey] = useState<string | null>(null)
  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setSlowKey(requestKey), 8000)
    return () => clearTimeout(timer)
  }, [loading, requestKey])
  return loading && slowKey === requestKey
}

export const slowLoadingMessage =
  '서버 연결에 시간이 걸리고 있어요. 서버 준비 중일 수 있으니 잠시만 기다려 주세요.'
