import { useEffect, useState } from 'react'
import {
  getApiErrorMessage,
  invalidateApiCache,
  getCachedApiData,
} from '../../../lib/api'
import { useSlowLoading } from '../../../hooks/useSlowLoading'
import { getClassCounts, getProfileImage, getUserSummary } from '../api/user'
import type { UserSummary } from '../api/user'

export function useClassCount() {
  const [classCount, setClassCount] = useState<number | null>(
    () =>
      getCachedApiData<{ classCount: number }>('/users/me/class-counts', true)
        ?.classCount ?? null,
  )
  useEffect(() => {
    let active = true
    getClassCounts()
      .then((value) => {
        if (active) setClassCount(value.classCount)
      })
      .catch(() => {
        // Leave the count unknown when the navigation's optional request fails.
      })
    return () => {
      active = false
    }
  }, [])
  return classCount
}

export function useUserSummary() {
  const [summary, setSummary] = useState<UserSummary | null>(
    () => getCachedApiData<UserSummary>('/users/me/summary', true) ?? null,
  )
  const [loading, setLoading] = useState(
    () => !getCachedApiData<UserSummary>('/users/me/summary', true),
  )
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    getUserSummary()
      .then((value) => {
        if (active) setSummary(value)
      })
      .catch((cause) => {
        if (active)
          setError(
            getApiErrorMessage(
              cause,
              '회원 정보를 불러오지 못했어요. 다시 시도해 주세요.',
            ),
          )
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
    invalidateApiCache()
    setLoading(true)
    setError('')
    setAttempt((value) => value + 1)
  }
  const slow = useSlowLoading(loading, String(attempt))
  return { summary, loading, slow, error, reload }
}

export function useProfileImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(
    () =>
      getCachedApiData<{ imageUrl: string | null }>(
        '/users/me/profile-image',
        true,
      )?.imageUrl ?? null,
  )
  useEffect(() => {
    let active = true
    getProfileImage()
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
