import type { ScheduledLesson } from '../types/home'

// 예약 API 연동 시 실제 응답으로 교체하고 이 목데이터 파일을 제거합니다.
export const demoLessons: ScheduledLesson[] = [
  {
    id: 'demo-lesson-1',
    dateLabel: '9월 27일(일) 22:00',
    tutorName: 'Anshi',
    goal: '커리어/인터뷰',
    durationMinutes: 40,
    tags: ['미국 영어', '모의 인터뷰'],
  },
  {
    id: 'demo-lesson-2',
    dateLabel: '9월 28일(월) 19:00',
    tutorName: 'Alexander',
    goal: '비즈니스 영어',
    durationMinutes: 40,
    tags: ['영어 회화', '프레젠테이션'],
  },
  {
    id: 'demo-lesson-3',
    dateLabel: '9월 29일(화) 20:30',
    tutorName: 'Audley',
    goal: '일상/토론',
    durationMinutes: 20,
    tags: ['일상 대화', '토론'],
  },
]
