import { apiGet, getCachedApiData } from '../../../lib/api'
import type { HomeCategory, UserHomeResponse } from '../types/homeApi'

export async function getUserHome(category?: HomeCategory) {
  const query = category ? `?${new URLSearchParams({ category })}` : ''
  const home = await apiGet<UserHomeResponse>(`/users/me/home${query}`)
  if (
    (home?.type === 'UPCOMING_CLASS' &&
      Array.isArray(home.upcomingClasses?.classes)) ||
    (home?.type === 'RECOMMENDED_TUTORS' &&
      Array.isArray(home.recommendedTutors?.tutors))
  ) {
    return home
  }
  throw new Error('홈 응답 데이터를 확인할 수 없어요.')
}

export function getCachedHome(
  category?: HomeCategory,
): UserHomeResponse | undefined {
  const query = category ? `?${new URLSearchParams({ category })}` : ''
  const home = getCachedApiData<UserHomeResponse>(`/users/me/home${query}`)
  return (home?.type === 'UPCOMING_CLASS' &&
    Array.isArray(home.upcomingClasses?.classes)) ||
    (home?.type === 'RECOMMENDED_TUTORS' &&
      Array.isArray(home.recommendedTutors?.tutors))
    ? home
    : undefined
}
