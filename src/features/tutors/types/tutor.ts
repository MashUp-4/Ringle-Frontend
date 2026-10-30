export type TutorDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export interface Tutor {
  id?: number
  imageUrl?: string | null
  isMyTutor?: boolean
  name: string
  major: string
  university: string
  category: string
  rating: string
  reviews: number
  acceptanceRate?: number
  subjects: string[]
  intro: string
}

export type TutorTab = '추천' | '전체'
