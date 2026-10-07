import { demoTutors } from '../data/demoTutors'
import type { Tutor } from '../types/tutor'
// TODO: API 계약 확정 후 실제 요청으로 교체하고 demoTutors import와 목데이터 파일을 제거합니다.
export async function getTutors(): Promise<Tutor[]> {
  return demoTutors
}
