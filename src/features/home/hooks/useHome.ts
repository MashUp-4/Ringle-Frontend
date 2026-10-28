import { useEffect, useState } from 'react'
import { getUserHome } from '../api/home'
import type { HomeCategory, UserHomeResponse } from '../types/homeApi'

const pending = new Map<string, Promise<UserHomeResponse>>()
const emptyTutors: never[] = []

export function useHome(category?: HomeCategory) {
  const [attempt, setAttempt] = useState(0)
  const key = `${attempt}:${category ?? ''}`
  const [state, setState] = useState<{
    key: string
    home: UserHomeResponse | null
    error: string
  }>({ key: '', home: null, error: '' })

  useEffect(() => {
    let active = true
    const requestKey = category ?? ''
    let request = pending.get(requestKey)
    if (!request) {
      request = getUserHome(category).finally(() => pending.delete(requestKey))
      pending.set(requestKey, request)
    }
    request
      .then((home) => {
        if (active) setState({ key, home, error: '' })
      })
      .catch(() => {
        if (active)
          setState({
            key,
            home: null,
            error: '홈 정보를 불러오지 못했어요. 다시 시도해 주세요.',
          })
      })
    return () => {
      active = false
    }
  }, [category, key])

  const loading = state.key !== key
  const home = state.home
  return {
    home,
    loading,
    error: loading ? '' : state.error,
    recommendedTutors:
      home?.type === 'RECOMMENDED_TUTORS'
        ? home.recommendedTutors.tutors
        : emptyTutors,
    reload: () => {
      if (!loading) setAttempt((value) => value + 1)
    },
  }
}
