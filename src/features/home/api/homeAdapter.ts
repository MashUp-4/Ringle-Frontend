import type { Tutor } from '../../tutors/types/tutor'
import type { HomeTutorRecommendation, ScheduledLesson } from '../types/home'
import type {
  HomeCategory,
  RecommendedTutorResponse,
  UpcomingClassResponse,
} from '../types/homeApi'
import type { LearningGoal } from '../types/home'

export const homeCategories: Record<LearningGoal, HomeCategory> = {
  career: 'CAREER_INTERVIEW',
  business: 'BUSINESS_ENGLISH',
  daily: 'DAILY_DISCUSSION',
  study: 'STUDY_ABROAD_EXAM',
}

export function getLearningGoal(category: HomeCategory): LearningGoal {
  return (
    (Object.keys(homeCategories) as LearningGoal[]).find(
      (goal) => homeCategories[goal] === category,
    ) ?? 'career'
  )
}

export function formatHomeTime(value: string | null): string {
  if (!value) return ''
  const zonedValue = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
    ? value
    : `${value}+09:00`
  const date = new Date(zonedValue)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export function toHomeRecommendations(tutors: RecommendedTutorResponse[]) {
  return tutors.slice(0, 2).map((dto) => {
    const tutor: Tutor = {
      id: dto.tutorId,
      name: dto.name,

      imageUrl: dto.imageUrl,
      major: dto.major ?? '',
      university: dto.university ?? '',
      category: '',
      rating: dto.averageRating == null ? '—' : dto.averageRating.toFixed(1),
      reviews: dto.reviewCount ?? 0,
      subjects: dto.tags ?? [],

      intro: dto.introduction ?? '',
      isMyTutor: dto.isMyTutor,
    }
    const recommendation: HomeTutorRecommendation = {
      reason: dto.introduction ?? '',
      tags: dto.tags ?? [],
      earliestLesson: formatHomeTime(dto.earliestAvailableAt),
    }
    return { tutor, recommendation }
  })
}

export function toScheduledLessons(
  classes: UpcomingClassResponse[],
): ScheduledLesson[] {
  return classes.map((lesson) => ({
    id: String(lesson.classId),
    dateLabel: formatHomeTime(lesson.startsAt),
    tutorName: lesson.tutor.name,
    goal: lesson.classType,
    durationMinutes: lesson.durationMinutes,
    tags: lesson.tags ?? [],
    tutor: {
      id: lesson.tutor.tutorId,
      name: lesson.tutor.name,

      imageUrl: lesson.tutor.imageUrl,
      major: lesson.tutor.major ?? '',
      university: lesson.tutor.university ?? '',
      category: '',
      rating: '—',
      reviews: 0,
      subjects: [],

      intro: '',
    },
  }))
}
