import { apiGet } from '../../../lib/api'

export interface UserSummary {
  id: number
  name: string
  timeZone: string
  credit20MinCount: number
  credit40MinCount: number
  points: number
  unusedCouponCount: number
}

export const getUserSummary = () => apiGet<UserSummary>('/users/me/summary')
export const getProfileImage = () =>
  apiGet<{ imageUrl: string | null }>('/users/me/profile-image')
