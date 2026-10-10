export type TutorDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type TutorGender = 'male' | 'female'

export interface TutorAvailability {
  day: TutorDay
  startMinute: number
  endMinute: number
}

export interface Tutor {
  name: string
  major: string
  university: string
  category: string
  rating: string
  reviews: number
  image: number
  acceptanceRate: number
  subjects: string[]
  intro: string

  availability: TutorAvailability[]
  strengths: string[]
  experiences: string[]
  majorCategory: string
  interests: string[]
  gender: TutorGender
  accent: string
  hasTaught: boolean
  isRecommended: boolean
  hasPointBack: boolean
}

export type TutorTab = '추천' | '전체'
