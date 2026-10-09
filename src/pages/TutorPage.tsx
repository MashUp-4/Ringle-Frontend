import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { Icon } from '../components/ui/Icon'
import { AppShell } from '../components/layout/AppShell'
import { TutorPageHeader } from '../components/layout/TutorPageHeader'
import { Modal } from '../components/ui/Modal'
import { TutorCard } from '../features/tutors/components/TutorCard'
import { useBookmarks } from '../features/tutors/hooks/useBookmarks'
import { useTutors } from '../features/tutors/hooks/useTutors'
import type { Tutor, TutorTab } from '../features/tutors/types/tutor'

function TutorPage() {
  const [query, setQuery] = useState('')
  useEffect(() => {
    document.title = '튜터 추천 | Ringle'
  }, [])
  const navigate = useNavigate()
  const { tutorId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const tab: TutorTab = requestedTab === '전체' ? '전체' : '추천'
  function setTab(value: string) {
    if (value === '전체') {
      navigate('/tutors/all')
      return
    }

    setSearchParams({})
  }
  const { saved, toggleBookmark, storageError } = useBookmarks()
  const { tutors, loading, error, reload } = useTutors()
  const selected = tutors.find((t) => t.name === tutorId) ?? null
  function setSelected(tutor: Tutor | null) {
    navigate({
      pathname: tutor ? `/tutors/${encodeURIComponent(tutor.name)}` : '/tutors',
      search: searchParams.toString(),
    })
  }
  const [toast, setToast] = useState('')
  const [bookmarkNotice, setBookmarkNotice] = useState<{ name: string } | null>(
    null,
  )
  const [recommend, setRecommend] = useState(false)
  const [interest, setInterest] = useState('')
  const [filter, setFilter] = useState('')
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(timer)
  }, [toast])
  useEffect(() => {
    if (!bookmarkNotice) return
    const timer = setTimeout(() => setBookmarkNotice(null), 5000)
    return () => clearTimeout(timer)
  }, [bookmarkNotice])
  const visible = tutors.filter(
    (t) =>
      `${t.name} ${t.major} ${t.university}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!filter || t.category === filter),
  )
  function bookmark(name: string) {
    const exists = saved.includes(name)
    toggleBookmark(name)
    setToast('')
    setBookmarkNotice(exists ? null : { name })
    if (exists) setToast('찜한 튜터에서 삭제했어요.')
  }
  if (requestedTab === '전체') {
    return <Navigate to="/tutors/all" replace />
  }
  return (
    <AppShell onNotice={setToast}>
      <main className="tutor-page">
        <TutorPageHeader
          tab={tab}
          onTabChange={(value) => {
            setTab(value)
            setFilter('')
          }}
          query={query}
          onQueryChange={setQuery}
          onNotice={setToast}
        />
        <button className="recommend-banner" onClick={() => setRecommend(true)}>
          <Icon name="twinkle" />
          <span>나에게 맞는 튜터가 궁금하다면?</span>
          <strong>링글 팀에게 추천받기</strong>
        </button>
        <section className="recommendations">
          <div className="section-heading">
            <h2>
              {tab === '전체' ? '전체 튜터' : '링글이 추천하는'}{' '}
              <span className="hint" tabIndex={0} aria-label="추천 안내">
                <Icon name="question" />
                <span className="tooltip">
                  다양한 전공과 관심사를 가진 튜터를 만나보세요.
                </span>
              </span>
            </h2>
            <button
              className="view-all"
              onClick={() => {
                setTab(tab === '전체' ? '추천' : '전체')
                setFilter('')
              }}
            >
              {tab === '전체' ? '추천보기' : '전체보기'} <Icon name="arrow" />
            </button>
          </div>
          {filter && (
            <button className="filter-chip" onClick={() => setFilter('')}>
              {filter} ×
            </button>
          )}
          {storageError && (
            <p
              role="status"
              className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900 mb-4"
            >
              {storageError}
            </p>
          )}
          {loading && (
            <p role="status" className="py-12 text-center text-muted">
              튜터를 불러오고 있어요.
            </p>
          )}
          {error && (
            <div role="alert" className="rounded-lg bg-red-50 p-5 text-center">
              <p>{error}</p>
              <button className="mt-3 text-primary" onClick={reload}>
                다시 시도
              </button>
            </div>
          )}
          {!loading && !error && tutorId && !selected && (
            <p role="alert" className="p-4 text-center">
              해당 튜터를 찾을 수 없어요.{' '}
              <Link to="/tutors" className="text-primary">
                목록으로 돌아가기
              </Link>
            </p>
          )}
          <div className="tutor-grid">
            {visible.map((t) => (
              <TutorCard
                key={t.name}
                tutor={t}
                bookmarked={saved.includes(t.name)}
                onBookmark={() => bookmark(t.name)}
                onDetails={() => setSelected(t)}
              />
            ))}
          </div>
          {!loading && !error && visible.length === 0 && (
            <div className="empty">
              <Icon name="search" />
              <h3>검색 결과가 없어요</h3>
              <p>다른 이름이나 전공으로 검색해 보세요.</p>
              <button
                onClick={() => {
                  setQuery('')
                  setTab('전체')
                  setFilter('')
                }}
              >
                전체 튜터 보기
              </button>
            </div>
          )}
        </section>
      </main>
      {bookmarkNotice && (
        <div className="bookmark-notice">
          <p role="status" aria-live="polite">
            찜한 튜터에 추가했어요.
          </p>
          <button onClick={() => navigate('/tutors/all?saved=1')}>
            찜한 목록 바로가기 <Icon name="arrow" />
          </button>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          ✓ {toast}
        </div>
      )}
      {(selected || recommend) && (
        <Modal
          onClose={() => {
            if (selected) setSelected(null)
            setRecommend(false)
          }}
          labelledBy="dialog-title"
        >
          {selected ? (
            <>
              <img src={`/tutor-${selected.image}.png`} alt="" />
              <h2 id="dialog-title">{selected.name}</h2>
              <p className="modal-school">
                {selected.major} · {selected.university}
              </p>
              <p>{selected.intro}</p>
              <p className="modal-rating">
                ★ {selected.rating} · 수업 후기 {selected.reviews}개
              </p>
              <button
                className="primary"
                onClick={() => bookmark(selected.name)}
              >
                {saved.includes(selected.name)
                  ? '북마크 해제'
                  : '튜터 북마크하기'}
              </button>
            </>
          ) : (
            <>
              <span className="modal-sparkle">✦</span>
              <h2 id="dialog-title">나에게 맞는 튜터 찾기</h2>
              <p>관심 있는 분야를 선택하면 어울리는 튜터를 보여드려요.</p>
              <div className="interest-options">
                {['Medical / Bio', 'Service', 'Education', 'Art / Media'].map(
                  (item) => (
                    <button
                      className={interest === item ? 'chosen' : ''}
                      aria-pressed={interest === item}
                      key={item}
                      onClick={() => setInterest(item)}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
              <button
                className="primary"
                disabled={!interest}
                onClick={() => {
                  setFilter(interest)
                  setTab('추천')
                  setQuery('')
                  setRecommend(false)
                }}
              >
                추천 튜터 보기
              </button>
            </>
          )}
        </Modal>
      )}
    </AppShell>
  )
}
export default TutorPage
