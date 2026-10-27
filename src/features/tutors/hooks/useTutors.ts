import { useEffect, useState } from 'react'
import { getTutors } from '../api/tutors'
import type { Tutor } from '../types/tutor'

const pending = new Map<string, Promise<Tutor[]>>()
function loadTutors(query: string) {
  let request = pending.get(query)
  if (!request) {
    request = getTutors(query).finally(() => pending.delete(query))
    pending.set(query, request)
  }
  return request
}

export function useTutors(query = '') {
  const [attempt, setAttempt] = useState(0)
  const key = `${attempt}:${query}`
  const [state, setState] = useState<{
    key: string
    tutors: Tutor[]
    error: string
    loading: boolean
  }>({ key: '', tutors: [], error: '', loading: true })
  useEffect(() => {
    let active = true
    // Debounce rapid search/filter updates; stale responses never replace the current list.
    const timer = setTimeout(() => {
      loadTutors(query)
        .then((tutors) => {
          if (active) setState({ key, tutors, error: '', loading: false })
        })
        .catch(() => {
          if (active)
            setState({
              key,
              tutors: [],
              error: '튜터를 불러오지 못했어요. 다시 시도해 주세요.',
              loading: false,
            })
        })
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [key, query])
  const loading = state.key !== key || state.loading
  return {
    tutors: state.key === key ? state.tutors : [],
    loading,
    error: state.key === key ? state.error : '',
    reload: () => {
      if (!loading) setAttempt((value) => value + 1)
    },
  }
}
