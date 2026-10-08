import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { TutorPageHeader } from '../components/layout/TutorPageHeader'
import { TutorCard } from '../features/tutors/components/TutorCard'
import { TutorFilterPanel } from '../features/tutors/components/TutorFilterPanel'
import { useBookmarks } from '../features/tutors/hooks/useBookmarks'
import { useTutors } from '../features/tutors/hooks/useTutors'

export default function FavoriteTutorsPage() {
  const [toast, setToast] = useState('')
  useEffect(() => {
    document.title = '전체 튜터 | Ringle'
  }, [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(timer)
  }, [toast])
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
    <AppShell onNotice={setToast}>
      <main className="favorite-page">
        <TutorPageHeader
          tab="전체"
          onTabChange={(tab) => {
            if (tab === '추천') navigate('/tutors')
            else setSearchParams({})
          }}
          query={query}
          onQueryChange={setQuery}
          onNotice={setToast}
        />

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
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </AppShell>
  )
}
