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
export const tutorHighlights: Record<
  string,
  { description: string; tags: string[]; availability: string }
> = {
  Anshi: {
    description: '실제 면접처럼 꼬리 질문',
    tags: ['미국 영어', '모의 인터뷰'],
    availability: '오늘 22:00',
  },
  Alexander: {
    description: '이력서 첨삭부터 답변까지',
    tags: ['캐나다 영어', '영문 이력서 첨삭'],
    availability: '내일 07:30',
  },
  Audley: {
    description: '생각을 넓히는 깊이 있는 대화',
    tags: ['일상 대화', '토론'],
    availability: '내일 09:00',
  },
  Luigi: {
    description: '명확하고 논리적인 영어 표현',
    tags: ['비즈니스 영어', '프레젠테이션'],
    availability: '내일 10:00',
  },
  Tatiana: {
    description: '관심사로 시작하는 자연스러운 대화',
    tags: ['일상 대화', '문화와 예술'],
    availability: '내일 18:00',
  },
}
