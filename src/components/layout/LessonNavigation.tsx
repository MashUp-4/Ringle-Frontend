import { Link } from 'react-router-dom'
import { useClassCount } from '../../features/user/hooks/useUser'

export function LessonNavigation({
  onNotice,
}: {
  onNotice: (message: string) => void
}) {
  const classCount = useClassCount()
  return (
    <nav className="lesson-tabs" aria-label="수업 메뉴">
      <button
        type="button"
        onClick={() =>
          onNotice(
            classCount == null
              ? '예정된 수업 정보를 확인할 수 없어요. 잠시 후 다시 확인해 주세요.'
              : classCount > 0
                ? `예정된 수업 ${classCount}개가 있어요.`
                : '예정된 수업이 없어요.',
          )
        }
      >
        예정된 수업 ({classCount ?? '—'})
      </button>
      <button type="button" onClick={() => onNotice('지난 수업이 없어요.')}>
        지난 수업
      </button>
      <Link className="current" to="/tutors" aria-current="page">
        튜터
      </Link>
      <button
        type="button"
        onClick={() => onNotice('교재 서비스는 준비 중이에요.')}
      >
        교재
      </button>
    </nav>
  )
}
