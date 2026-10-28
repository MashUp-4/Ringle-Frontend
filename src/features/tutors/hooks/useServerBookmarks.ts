import { useSyncExternalStore } from 'react'
import { apiWrite } from '../../../lib/api'
import type { Tutor } from '../types/tutor'

let state = {
  values: new Map<number, boolean>(),
  pending: new Set<number>(),
  error: '',
}
const listeners = new Set<() => void>()
function emit() {
  for (const listener of listeners) listener()
}
function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useServerBookmarks(_tutors: Tutor[]) {
  void _tutors
  // Only successful writes create overrides. A late list/home response must not
  // replace a newer write, and DTOs without a bookmark field must not clear it.
  const snapshot = useSyncExternalStore(subscribe, () => state)
  function isSaved(tutor: Tutor) {
    return tutor.id !== undefined
      ? (snapshot.values.get(tutor.id) ?? tutor.isMyTutor ?? false)
      : false
  }
  async function toggleBookmark(tutor: Tutor): Promise<boolean> {
    const id = tutor.id
    if (id === undefined || state.pending.has(id)) return false
    const previous = state.values.get(id) ?? tutor.isMyTutor ?? false
    state = { ...state, pending: new Set(state.pending).add(id), error: '' }
    emit()
    try {
      await apiWrite(
        `/users/me/favorite-tutors/${id}`,
        previous ? 'DELETE' : 'POST',
      )
      state = { ...state, values: new Map(state.values).set(id, !previous) }
      return true
    } catch {
      state = {
        ...state,
        error: '찜하기를 저장하지 못했어요. 다시 시도해 주세요.',
      }
      return false
    } finally {
      const pending = new Set(state.pending)
      pending.delete(id)
      state = { ...state, pending }
      emit()
    }
  }
  return {
    isSaved,
    toggleBookmark,
    storageError: snapshot.error,
    isPending: (tutor: Tutor) =>
      tutor.id !== undefined && snapshot.pending.has(tutor.id),
  }
}
