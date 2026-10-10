import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { TutorPageHeader } from '../components/layout/TutorPageHeader'
import { TutorCard } from '../features/tutors/components/TutorCard'
import { TutorFilterPanel } from '../features/tutors/components/TutorFilterPanel'
import { useBookmarks } from '../features/tutors/hooks/useBookmarks'
import { useTutorFilters } from '../features/tutors/hooks/useTutorFilters'
import { useTutors } from '../features/tutors/hooks/useTutors'

export default function AllTutorsPage() {
  const [toast, setToast] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const { tutors, loading, error, reload } = useTutors()
  const { saved, toggleBookmark, storageError } = useBookmarks()

  const {
    query,
    savedOnly,
    filters,
    chips,
    hasActiveFilters,
    setQuery,
    setSavedOnly,
    toggleFilterValue,
    removeFilterValue,
    resetFilters,
    getVisibleTutors,
  } = useTutorFilters()

  const visibleTutors = getVisibleTutors(tutors, saved)

  useEffect(() => {
    document.title = '전체 튜터 | Ringle'
  }, [])

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <AppShell onNotice={setToast}>
      <main className="favorite-page">
        <TutorPageHeader
          tab="전체"
          onTabChange={(tab) => {
            if (tab === '추천') navigate('/tutors')
            else setSavedOnly(false)
          }}
          query={query}
          onQueryChange={setQuery}
          onNotice={setToast}
        />

        {storageError && <p role="status">{storageError}</p>}

        <div className="favorite-layout">
          <TutorFilterPanel
            savedOnly={savedOnly}
            filters={filters}
            onSavedOnlyChange={setSavedOnly}
            onToggleFilter={toggleFilterValue}
          />

          <section aria-label="튜터 목록">
            {hasActiveFilters && (
              <div role="group" aria-label="선택한 필터">
                {savedOnly && (
                  <button
                    type="button"
                    className="favorite-filter-chip"
                    aria-label="찜한 튜터 필터 해제"
                    onClick={() => setSavedOnly(false)}
                  >
                    찜한 튜터 <span aria-hidden="true">×</span>
                  </button>
                )}

                {chips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    className="favorite-filter-chip"
                    aria-label={`${chip.label} 필터 해제`}
                    onClick={() => removeFilterValue(chip.key, chip.value)}
                  >
                    {chip.label} <span aria-hidden="true">×</span>
                  </button>
                ))}

                <button type="button" onClick={resetFilters}>
                  필터 초기화
                </button>
              </div>
            )}

            {loading && <p role="status">튜터를 불러오고 있어요.</p>}

            {error && (
              <div role="alert">
                <p>{error}</p>
                <button type="button" onClick={reload}>
                  다시 시도
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                <p className="favorite-tutor-count" role="status">
                  {visibleTutors.length}명의 튜터
                </p>

                {visibleTutors.length === 0 ? (
                  <div>
                    <h2>
                      {hasActiveFilters
                        ? '조건을 만족하는 튜터가 없어요.'
                        : query.trim()
                          ? '검색 결과가 없어요.'
                          : '등록된 튜터가 없어요.'}
                    </h2>

                    {hasActiveFilters && (
                      <>
                        <p>필터를 다시 설정해보세요.</p>
                        <button type="button" onClick={resetFilters}>
                          필터 초기화
                        </button>
                      </>
                    )}

                    {query.trim() && (
                      <button type="button" onClick={() => setQuery('')}>
                        검색어 지우기
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
                          navigate(
                            `/tutors/${encodeURIComponent(tutor.name)}`,
                            {
                              state: {
                                returnTo: `${location.pathname}${location.search}`,
                              },
                            },
                          )
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

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </AppShell>
  )
}
