export interface TutorResponse {
  id: number
  name: string
  imageUrl: string | null
  school: string | null
  major: string | null
  primaryKeyword: string | null
  averageRating: number | null
  reviewCount: number
  acceptRate: number | null
  interests: string[] | null
  isMyTutor: boolean
}
