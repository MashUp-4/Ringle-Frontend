import type { TutorDay } from '../types/tutor'

export const dayOptions: { value: TutorDay; label: string }[] = [
  { value: 'sun', label: '일' },
  { value: 'mon', label: '월' },
  { value: 'tue', label: '화' },
  { value: 'wed', label: '수' },
  { value: 'thu', label: '목' },
  { value: 'fri', label: '금' },
  { value: 'sat', label: '토' },
]

export const timeOptions = [
  {
    value: '0-180',
    label: '새벽 0:00 - 3:00',
    startMinute: 0,
    endMinute: 180,
  },
  {
    value: '300-420',
    label: '오전 5:00 - 7:00',
    startMinute: 300,
    endMinute: 420,
  },
  {
    value: '420-540',
    label: '오전 7:00 - 9:00',
    startMinute: 420,
    endMinute: 540,
  },
  {
    value: '540-720',
    label: '오전 9:00 - 12:00',
    startMinute: 540,
    endMinute: 720,
  },
  {
    value: '720-900',
    label: '오후 12:00 - 15:00',
    startMinute: 720,
    endMinute: 900,
  },
  {
    value: '900-1020',
    label: '오후 15:00 - 17:00',
    startMinute: 900,
    endMinute: 1020,
  },
  {
    value: '1140-1260',
    label: '저녁 19:00 - 21:00',
    startMinute: 1140,
    endMinute: 1260,
  },
  {
    value: '1260-1440',
    label: '저녁 21:00 - 0:00',
    startMinute: 1260,
    endMinute: 1440,
  },
]

export const strengthOptions = [
  '초급 영어',
  '비즈니스 영어',
  '인터뷰',
  '공인 영어시험',
  'Writing/에세이/이력서',
  '토론/심화 영어',
]

export const experienceOptions = [
  '마케팅/영업 직무',
  '기획/전략 직무',
  'IT/개발 직무',
  '금융/회계 직무',
  '법률/정책 직무',
  '의료/바이오 직무',
  '예술/미디어 직무',
  '교육 직무',
  '서비스업 직무',
  '대학원 재학/졸업',
]

export const majorOptions = [
  '사회과학계열',
  '인문계열',
  '상경계열',
  '자연과학계열',
  '공학계열',
  '의학계열',
  '법학계열',
  '예체능계열',
]

export const interestOptions = [
  '여행',
  '음악',
  '스포츠',
  '문화 (영화, 책, 음식)',
  '게임',
  '테크/IT',
  '패션/뷰티',
  '소셜미디어 (SNS, 유튜브)',
  '커리어/자기계발',
  '경제/투자',
]

export const genderOptions = [
  { value: 'male', label: '남자' },
  { value: 'female', label: '여자' },
]

export const accentOptions = [
  { value: '미국식', label: '미국식' },
  { value: '영국식', label: '영국식' },
]
