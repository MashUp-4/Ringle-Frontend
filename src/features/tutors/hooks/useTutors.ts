import { useEffect, useState } from 'react'
import { getTutors } from '../api/tutors'
import type { Tutor } from '../types/tutor'
let pendingRequest: Promise<Tutor[]> | null = null
function loadTutors() {
  if (!pendingRequest)
    pendingRequest = getTutors().finally(() => {
      pendingRequest = null
    })
  return pendingRequest
}
export function useTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    loadTutors()
      .then((data) => {
        if (active) setTutors(data)
      })
      .catch(() => {
        if (active) setError('튜터를 불러오지 못했어요. 다시 시도해 주세요.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [attempt])
  function reload() {
    if (loading) return
    setLoading(true)
    setError('')
    setAttempt((value) => value + 1)
  }
  return { tutors, loading, error, reload }
}
