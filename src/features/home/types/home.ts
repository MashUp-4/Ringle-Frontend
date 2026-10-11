export type LearningGoal = 'career' | 'business' | 'daily' | 'study'
export interface HomeProfile {
  name: string
  timezone: string
  signupGoal: LearningGoal
}
export interface LessonPassBalance {
  fortyMinutes: number
  twentyMinutes: number
}
export interface ScheduledLesson {
  id: string
  dateLabel: string
  tutorName: string
  goal: string
  durationMinutes: number
  tags: string[]
}

export interface HomeTutorRecommendation {
  reason: string
  tags: string[]
  earliestLesson: string
  rating?: string
  state?: 'selected' | 'disabled'
}
