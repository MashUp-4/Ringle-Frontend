import type { TutorFilterValues } from '../hooks/useTutorFilters'

const mappings: Record<string, Record<string, string>> = {
  strengths: {
    '초급 영어': 'BEGINNER_ENGLISH',
    '비즈니스 영어': 'BUSINESS_ENGLISH',
    인터뷰: 'INTERVIEW',
    '공인 영어시험': 'ENGLISH_EXAM',
    'Writing/에세이/이력서': 'WRITING',
    '토론/심화 영어': 'ADVANCED_DISCUSSION',
  },
  experiences: {
    '마케팅/영업 직무': 'MARKETING_SALES',
    '기획/전략 직무': 'STRATEGY_PLANNING',
    'IT/개발 직무': 'IT_DEVELOPMENT',
    '금융/회계 직무': 'FINANCE_ACCOUNTING',
    '법률/정책 직무': 'LAW_POLICY',
    '의료/바이오 직무': 'MEDICAL_BIO',
    '예술/미디어 직무': 'ARTS_MEDIA',
    '교육 직무': 'EDUCATION',
    '서비스업 직무': 'SERVICE',
    '대학원 재학/졸업': 'GRADUATE_SCHOOL',
  },
  majors: {
    사회과학계열: 'SOCIAL_SCIENCE',
    인문계열: 'HUMANITIES',
    상경계열: 'BUSINESS',
    자연과학계열: 'NATURAL_SCIENCE',
    공학계열: 'ENGINEERING',
    의학계열: 'MEDICINE',
    법학계열: 'LAW',
    예체능계열: 'ARTS',
  },
  interests: {
    여행: 'TRAVEL',
    음악: 'MUSIC',
    스포츠: 'SPORTS',
    '문화 (영화, 책, 음식)': 'CULTURE',
    게임: 'GAME',
    '테크/IT': 'TECH_IT',
    '패션/뷰티': 'FASHION_BEAUTY',
    '소셜미디어 (SNS, 유튜브)': 'SOCIAL_MEDIA',
    '커리어/자기계발': 'CAREER_DEVELOPMENT',
    '경제/투자': 'ECONOMY_INVESTMENT',
  },
  genders: { male: 'MALE', female: 'FEMALE' },
  accents: { 미국식: 'AMERICAN', 영국식: 'BRITISH' },
  days: {
    sun: 'SUN',
    mon: 'MON',
    tue: 'TUE',
    wed: 'WED',
    thu: 'THU',
    fri: 'FRI',
    sat: 'SAT',
  },
  times: {
    '0-180': 'TIME_00_03',
    '300-420': 'TIME_05_07',
    '420-540': 'TIME_07_09',
    '540-720': 'TIME_09_12',
    '720-900': 'TIME_12_15',
    '1140-1260': 'TIME_19_21',
    '1260-1440': 'TIME_21_24',
  },
}
const parameterNames = {
  strengths: 'strengthTags',
  experiences: 'experienceTags',
  majors: 'fieldOfStudy',
  interests: 'personalInterestTags',
  genders: 'genders',
  accents: 'accents',
  days: 'weekdays',
  times: 'timeSlots',
} as const

export function buildTutorQuery(
  search: string,
  savedOnly = false,
  filters?: TutorFilterValues,
  featured = false,
) {
  const params = new URLSearchParams()
  if (search.trim()) params.set('search', search.trim())
  if (savedOnly) params.set('isMyTutor', 'true')
  if (featured || filters?.types.includes('recommended'))
    params.set('isFeatured', 'true')
  if (filters?.types.includes('taught')) params.set('isPreviousTutor', 'true')
  if (filters?.types.includes('pointback')) params.set('isPointback', 'true')
  if (filters) {
    for (const key of Object.keys(
      parameterNames,
    ) as (keyof typeof parameterNames)[]) {
      for (const value of new Set(filters[key])) {
        const code = mappings[key][value]
        if (code) params.append(parameterNames[key], code)
      }
    }
  }
  return params.toString()
}
