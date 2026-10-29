import { useEffect, useState } from 'react'
import { getApiErrorMessage, invalidateApiCache } from '../../../lib/api'
import { useSlowLoading } from '../../../hooks/useSlowLoading'
import { getUserHome, getCachedHome } from '../api/home'
import type { HomeCategory, UserHomeResponse } from '../types/homeApi'

const emptyTutors: never[] = []

export function useHome(category?: HomeCategory) {
  const [attempt, setAttempt] = useState(0)
  const key = `${attempt}:${category ?? ''}`
  const cached = getCachedHome(category)
  const [state, setState] = useState<{
    key: string
    home: UserHomeResponse | null
    error: string
  }>({ key: '', home: null, error: '' })

  useEffect(() => {
    let active = true
    getUserHome(category)
      .then((home) => {
        if (active) setState({ key, home, error: '' })
      })
      .catch((cause) => {
        if (active)
          setState({
            key,
            home: null,
            error: getApiErrorMessage(
              cause,
              '홈 정보를 불러오지 못했어요. 다시 시도해 주세요.',
            ),
          })
      })
    return () => {
      active = false
    }
  }, [category, key])

  const loading = state.key !== key && cached === undefined
  const home = state.key === key ? state.home : (cached ?? state.home)
  const slow = useSlowLoading(loading, key)
  return {
    home,
    loading,
    slow,
    error: state.key === key ? state.error : '',
    recommendedTutors:
      home?.type === 'RECOMMENDED_TUTORS'
        ? home.recommendedTutors.tutors
        : emptyTutors,
    reload: () => {
      if (!loading) {
        invalidateApiCache()
        setAttempt((value) => value + 1)
      }
    },
  }
}
