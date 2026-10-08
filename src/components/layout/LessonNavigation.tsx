import { Link } from 'react-router-dom'

export function LessonNavigation({
  onNotice,
}: {
  onNotice: (message: string) => void
}) {
  return (
    <nav className="lesson-tabs" aria-label="수업 메뉴">
      <button type="button" onClick={() => onNotice('예정된 수업이 없어요.')}>
        예정된 수업 (0)
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
