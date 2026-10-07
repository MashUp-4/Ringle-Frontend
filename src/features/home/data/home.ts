import type { LearningGoal } from '../types/home'
export const learningGoals: {
  id: LearningGoal
  label: string
  description: string
  tutorNames: string[]
}[] = [
  {
    id: 'career',
    label: '커리어/인터뷰',
    description: "가입 시 선택한 '커리어/인터뷰' 관심 분야에 맞는 튜터예요.",
    tutorNames: ['Anshi', 'Alexander'],
  },
  {
    id: 'business',
    label: '비즈니스 영어',
    description: '회의와 프레젠테이션에서 자신 있게 말하는 연습을 해보세요.',
    tutorNames: ['Alexander', 'Luigi'],
  },
  {
    id: 'daily',
    label: '일상/토론',
    description: '다양한 주제로 자연스러운 영어 대화를 시작해 보세요.',
    tutorNames: ['Audley', 'Tatiana'],
  },
  {
    id: 'study',
    label: '유학/시험',
    description: '유학 생활과 학업에 필요한 영어를 함께 연습해 보세요.',
    tutorNames: ['Anshi', 'Audley'],
  },
]
