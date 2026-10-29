import { useEffect, useRef, useState } from 'react'
import { getApiErrorMessage, invalidateApiCache } from '../../../lib/api'
import { useSlowLoading } from '../../../hooks/useSlowLoading'
import { getTutors, getCachedTutors } from '../api/tutors'
import type { Tutor } from '../types/tutor'

export function useTutors(query = '') {
  const [attempt, setAttempt] = useState(0)
  const key = `${attempt}:${query}`
  const previousQuery = useRef(query)
  // The key includes manual reloads, which must not reuse the just-invalidated cache.
  const cached = getCachedTutors(query)
  const [state, setState] = useState<{
    key: string
    tutors: Tutor[]
    error: string
    loading: boolean
  }>({ key: '', tutors: [], error: '', loading: true })
  useEffect(() => {
    let active = true
    // First paint and manual retry start immediately; only changed filters debounce.
    const delay = previousQuery.current === query ? 0 : 250
    previousQuery.current = query
    const timer = setTimeout(() => {
      getTutors(query)
        .then((tutors) => {
          if (active) setState({ key, tutors, error: '', loading: false })
        })
        .catch((cause) => {
          if (active)
            setState({
              key,
              tutors: [],
              error: getApiErrorMessage(
                cause,
                '튜터를 불러오지 못했어요. 다시 시도해 주세요.',
              ),
              loading: false,
            })
        })
    }, delay)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [key, query])
  const loading = state.key !== key ? cached === undefined : state.loading
  const slow = useSlowLoading(loading, key)
  return {
    slow,
    tutors: state.key === key ? state.tutors : (cached ?? []),
    loading,
    error: state.key === key ? state.error : '',
    reload: () => {
      if (!loading) {
        invalidateApiCache()
        setAttempt((value) => value + 1)
      }
    },
  }
}
