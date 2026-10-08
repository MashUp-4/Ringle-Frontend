import type { TutorTab } from '../../features/tutors/types/tutor'
import { Icon } from '../ui/Icon'
import { LessonNavigation } from './LessonNavigation'

interface TutorPageHeaderProps {
  tab: TutorTab
  onTabChange: (tab: TutorTab) => void
  query: string
  onQueryChange: (query: string) => void
  onNotice: (message: string) => void
}

export function TutorPageHeader({
  tab,
  onTabChange,
  query,
  onQueryChange,
  onNotice,
}: TutorPageHeaderProps) {
  return (
    <>
      <LessonNavigation onNotice={onNotice} />
      <h1>튜터</h1>
      <div className="tab-row">
        <nav className="tabs" aria-label="튜터 메뉴">
          {(['추천', '전체'] as const).map((name) => (
            <button
              key={name}
              type="button"
              className={tab === name ? 'selected' : ''}
              aria-pressed={tab === name}
              onClick={() => onTabChange(name)}
            >
              {name}
            </button>
          ))}
        </nav>
        <label className="search">
          <Icon name="search" />
          <input
            aria-label="튜터 검색"
            placeholder="튜터 이름 또는 전공으로 검색하세요."
            value={query}
            maxLength={100}
            onChange={(event) => onQueryChange(event.target.value)}
          />
          {query && (
            <button
              type="button"
              aria-label="검색 지우기"
              onClick={() => onQueryChange('')}
            >
              ×
            </button>
          )}
        </label>
      </div>
    </>
  )
}
