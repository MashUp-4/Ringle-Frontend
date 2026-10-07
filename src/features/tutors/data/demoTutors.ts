import type { Tutor } from '../types/tutor'
// API 연동 전 화면 확인용 목데이터입니다. 실제 연동 시 이 파일과 import를 제거합니다.
export const demoTutors: Tutor[] = [
  {
    name: 'Anshi',
    acceptanceRate: 87,
    subjects: ['신경과학', '뇌과학'],
    major: 'Neuroscience',
    university: 'New York University',
    category: 'Medical / Bio',
    rating: '4.5',
    reviews: 30,
    image: 1,
    intro:
      '편안한 대화 속에서 자신 있게 영어로 생각을 표현해 보세요. 과학과 일상에 관한 이야기를 좋아해요.',
  },
  {
    name: 'Alexander',
    acceptanceRate: 92,
    subjects: ['심리학'],
    major: 'Psychology',
    university: 'London School of Economics',
    category: 'Service',
    rating: '4.7',
    reviews: 24,
    image: 2,
    intro:
      '여러분의 이야기를 듣고 새로운 관점을 나누고 싶어요. 자연스러운 표현과 논리적인 말하기를 함께 연습해요.',
  },
  {
    name: 'Audley',
    acceptanceRate: 89,
    subjects: ['역사'],
    major: 'History',
    university: 'New York University',
    category: 'Education',
    rating: '4.2',
    reviews: 12,
    image: 3,
    intro:
      '역사, 문화, 여행에 대해 이야기해요. 작은 실수도 배움의 기회가 되는 따뜻한 수업을 만들어요.',
  },
  {
    name: 'Luigi',
    acceptanceRate: 90,
    subjects: ['의공학'],
    major: 'Biomedical Engineering',
    university: 'University of Florida',
    category: 'Education',
    rating: '4.1',
    reviews: 27,
    image: 4,
    intro:
      '복잡한 생각을 명확한 영어로 전달하는 연습을 도와드려요. 기술과 과학에 대한 대화도 환영해요.',
  },
  {
    name: 'Tatiana',
    acceptanceRate: 95,
    subjects: ['건축'],
    major: 'Architecture',
    university: 'Smith College',
    category: 'Art / Media',
    rating: '4.8',
    reviews: 18,
    image: 5,
    intro:
      '디자인과 예술에서 일상까지, 관심 있는 주제로 이야기해요. 여러분만의 표현을 찾도록 도와드릴게요.',
  },
]
