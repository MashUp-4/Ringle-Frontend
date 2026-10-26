import { useEffect, useState } from 'react'
import { getProfileImage, getUserSummary } from '../api/user'
import type { UserSummary } from '../api/user'

// Share concurrent requests across StrictMode and the common navigation.
let summaryRequest: Promise<UserSummary> | null = null
let imageRequest: ReturnType<typeof getProfileImage> | null = null

export function useUserSummary() {
  const [summary, setSummary] = useState<UserSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    summaryRequest ??= getUserSummary().finally(() => {
      summaryRequest = null
    })
    summaryRequest
      .then((value) => {
        if (active) setSummary(value)
      })
      .catch(() => {
        if (active)
          setError('회원 정보를 불러오지 못했어요. 다시 시도해 주세요.')
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
  return { summary, loading, error, reload }
}

export function useProfileImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    imageRequest ??= getProfileImage().finally(() => {
      imageRequest = null
    })
    imageRequest
      .then((value) => {
        if (active) setImageUrl(value.imageUrl)
      })
      .catch(() => {
        /* Keep the default avatar if the optional image is unavailable. */
      })
    return () => {
      active = false
    }
  }, [])
  return imageUrl
}
