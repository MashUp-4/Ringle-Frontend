export type LearningGoal = 'career' | 'business' | 'daily' | 'study'
export interface HomeProfile {
  name: string
  timezone: string
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
