export type HomeCategory =
  | 'CAREER_INTERVIEW'
  | 'BUSINESS_ENGLISH'
  | 'DAILY_DISCUSSION'
  | 'STUDY_ABROAD_EXAM'

export interface HomeTutorResponse {
  tutorId: number
  name: string
  imageUrl: string | null
  major: string | null
  university: string | null
}

export interface RecommendedTutorResponse extends HomeTutorResponse {
  averageRating: number | null
  reviewCount: number
  introduction: string | null
  tags: string[] | null
  isMyTutor: boolean
  earliestAvailableAt: string | null
}

export interface RecommendedTutorsResponse {
  selectedCategory: HomeCategory
  signupCategory: HomeCategory
  interestField: string | null
  hasLessonPass: boolean
  tutors: RecommendedTutorResponse[]
}

export interface UpcomingClassResponse {
  classId: number
  startsAt: string
  durationMinutes: number
  classType: string
  tags: string[] | null
  tutor: HomeTutorResponse
}

export type UserHomeResponse =
  | {
      type: 'UPCOMING_CLASS'
      upcomingClasses: {
        totalCount: number
        classes: UpcomingClassResponse[]
      }
    }
  | {
      type: 'RECOMMENDED_TUTORS'
      recommendedTutors: RecommendedTutorsResponse
    }
