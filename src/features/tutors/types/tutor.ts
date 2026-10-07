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
}
export type TutorTab = '추천' | '전체'
