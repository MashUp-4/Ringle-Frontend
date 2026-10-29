import { apiGet, getCachedApiData } from '../../../lib/api'
import type { Tutor } from '../types/tutor'
import type { TutorResponse } from '../types/tutorApi'
import { toTutor } from './tutorAdapter'

interface TutorListResponse {
  count: number
  tutors: TutorResponse[]
}
export async function getTutors(query = ''): Promise<Tutor[]> {
  const response = await apiGet<TutorListResponse>(
    `/tutors${query ? `?${query}` : ''}`,
  )
  return response.tutors.map(toTutor)
}

export function getCachedTutors(query = ''): Tutor[] | undefined {
  const response = getCachedApiData<TutorListResponse>(
    `/tutors${query ? `?${query}` : ''}`,
  )
  return response?.tutors.map(toTutor)
}
