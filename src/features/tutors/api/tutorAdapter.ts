import type { Tutor } from '../types/tutor'
import type { TutorResponse } from '../types/tutorApi'

const keywordLabels: Record<string, string> = {
  MARKETING_SALES: 'Marketing / Sales',
  STRATEGY_PLANNING: 'Strategy / Planning',
  IT_DEVELOPMENT: 'IT / Development',
  FINANCE_ACCOUNTING: 'Finance / Accounting',
  LAW_POLICY: 'Law / Policy',
  MEDICAL_BIO: 'Medical / Bio',
  ARTS_MEDIA: 'Art / Media',
  EDUCATION: 'Education',
  SERVICE: 'Service',
  GRADUATE_SCHOOL: 'Graduate School',
}
export function toTutor(dto: TutorResponse): Tutor {
  return {
    id: dto.id,
    name: dto.name,
    imageUrl: dto.imageUrl,
    image: 0,
    major: dto.major ?? '',
    university: dto.school ?? '',
    category: dto.primaryKeyword
      ? (keywordLabels[dto.primaryKeyword] ?? dto.primaryKeyword)
      : '',
    rating: dto.averageRating == null ? '—' : dto.averageRating.toFixed(1),
    reviews: dto.reviewCount,
    acceptanceRate: dto.acceptRate ?? undefined,
    subjects: dto.interests ?? [],
    interests: dto.interests ?? [],
    isMyTutor: dto.isMyTutor,
    intro: '튜터 상세 소개는 상세 조회 API 연동 후 제공됩니다.',
  }
}
