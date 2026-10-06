import { useState } from 'react'
const STORAGE_KEY = 'saved-tutors'
function readBookmarks(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(value) &&
      value.every((item) => typeof item === 'string')
      ? value
      : []
  } catch {
    return []
  }
}
export function useBookmarks() {
  const [saved, setSaved] = useState<string[]>(readBookmarks)
  const [storageError, setStorageError] = useState('')
  function toggleBookmark(name: string) {
    const next = saved.includes(name)
      ? saved.filter((item) => item !== name)
      : [...saved, name]
    setSaved(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setStorageError('')
    } catch {
      setStorageError(
        '찜한 튜터를 브라우저에 저장하지 못했어요. 이 화면에서는 계속 사용할 수 있지만 새로고침하면 사라질 수 있어요.',
      )
    }
  }
  return { saved, toggleBookmark, storageError }
}
