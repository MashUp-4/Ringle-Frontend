import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import * as figmaAssets from '../components/ui/iconAssets'
import { TutorCard } from '../features/tutors/components/TutorCard'
import { TutorFilterPanel } from '../features/tutors/components/TutorFilterPanel'
import { useBookmarks } from '../features/tutors/hooks/useBookmarks'
import { useTutors } from '../features/tutors/hooks/useTutors'

export default function FavoriteTutorsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const savedOnly = searchParams.get('saved') === '1'
  const { tutors, loading, error, reload } = useTutors()
  const { saved, toggleBookmark, storageError } = useBookmarks()

  const visibleTutors = tutors.filter(
    (tutor) =>
      (!savedOnly || saved.includes(tutor.name)) &&
      `${tutor.name} ${tutor.major} ${tutor.university}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  )

  return (
    <>
      <aside className="sidebar">
        <Link className="logo" to="/tutors" aria-label="Ringle 홈">
          <img src={figmaAssets.ringleLogo} alt="" width="44" height="44" />
        </Link>

        <nav>
          {[
            ['home', '홈'],
            ['lesson', '수업'],
            ['calendar', '이벤트'],
            ['user', '마이링글'],
            ['chat', 'AI 스피킹'],
            ['chart', '성취'],
          ].map(([icon, label]) => (
            <div
              className={`nav-item ${label === '수업' ? 'active' : ''}`}
              key={label}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="nav-item">
            <Icon name="help" />
            FAQ
          </div>
          <div className="nav-item">
            <Icon name="guide" />
            링글 가이드
          </div>
        </div>
      </aside>

      <header className="topbar">
        <span>9회말 역전 이벤트</span>
        <span>구매</span>
        <span>기업 제휴</span>
        <i />
        <div className="avatar" aria-hidden="true" />
      </header>

      <main className="favorite-page">
        <nav className="lesson-tabs" aria-label="수업 메뉴">
          <span>예정된 수업 (0)</span>
          <span>지난 수업</span>
          <span className="current">튜터</span>
          <span>교재</span>
        </nav>

        <h1>튜터</h1>

        <div className="tab-row">
          <div className="tabs">
            <button type="button" onClick={() => navigate('/tutors')}>
              추천
            </button>
            <button
              type="button"
              className="selected"
              aria-current="page"
              onClick={() => setSearchParams({})}
            >
              전체
            </button>
          </div>

          <label className="search">
            <Icon name="search" />
            <input
              aria-label="튜터 검색"
              placeholder="튜터 이름 또는 전공으로 검색하세요."
              value={query}
              maxLength={100}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="검색 지우기"
                onClick={() => setQuery('')}
              >
                ×
              </button>
            )}
          </label>
        </div>

        {storageError && <p role="status">{storageError}</p>}

        <div className="favorite-layout">
          <TutorFilterPanel
            savedOnly={savedOnly}
            onSavedOnlyChange={(checked) =>
              setSearchParams(checked ? { saved: '1' } : {})
            }
          />

          <section aria-label="튜터 목록">
            {savedOnly && (
              <button
                type="button"
                className="favorite-filter-chip"
                onClick={() => setSearchParams({})}
              >
                찜한 튜터 <span aria-hidden="true">×</span>
              </button>
            )}

            {loading && <p role="status">튜터를 불러오고 있어요.</p>}

            {error && (
              <div role="alert">
                <p>{error}</p>
                <button onClick={reload}>다시 시도</button>
              </div>
            )}

            {!loading && !error && (
              <>
                <p className="favorite-tutor-count">
                  {visibleTutors.length}명의 튜터
                </p>
                {visibleTutors.length === 0 ? (
                  <div>
                    <h2>
                      {query.trim()
                        ? '검색 결과가 없어요'
                        : savedOnly
                          ? '찜한 튜터가 없어요'
                          : '등록된 튜터가 없어요'}
                    </h2>
                    {savedOnly && !query.trim() && (
                      <button type="button" onClick={() => setSearchParams({})}>
                        모든 튜터 보기
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="tutor-grid favorite-tutor-grid">
                    {visibleTutors.map((tutor) => (
                      <TutorCard
                        key={tutor.name}
                        tutor={tutor}
                        bookmarked={saved.includes(tutor.name)}
                        onBookmark={() => toggleBookmark(tutor.name)}
                        onDetails={() =>
                          navigate(`/tutors/${encodeURIComponent(tutor.name)}`)
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </>
  )
}
