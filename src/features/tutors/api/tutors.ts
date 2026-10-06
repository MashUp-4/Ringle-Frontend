import { demoTutors } from '../data/demoTutors'
import type { Tutor } from '../types/tutor'
// 실제 응답과 인증 계약이 확정되면 이 데이터 경계를 교체합니다.
export async function getTutors(): Promise<Tutor[]> {
  return demoTutors
}
