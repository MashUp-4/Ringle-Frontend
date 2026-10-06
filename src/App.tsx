import { useEffect, useState } from 'react'
import './App.css'

const tutors = [
  {
    name: 'Anshi',
    major: 'Neuroscience',
    university: 'New York University',
    category: 'Medical / Bio',
    rating: '4.5',
    reviews: 30,
    image: 1,
    intro:
      '편안한 대화 속에서 자신 있게 영어로 생각을 표현해 보세요. 과학과 일상에 관한 이야기를 좋아해요.',
  },
  {
    name: 'Alexander',
    major: 'Psychology',
    university: 'London School of Economics',
    category: 'Service',
    rating: '4.7',
    reviews: 24,
    image: 2,
    intro:
      '여러분의 이야기를 듣고 새로운 관점을 나누고 싶어요. 자연스러운 표현과 논리적인 말하기를 함께 연습해요.',
  },
  {
    name: 'Audley',
    major: 'History',
    university: 'New York University',
    category: 'Education',
    rating: '4.2',
    reviews: 12,
    image: 3,
    intro:
      '역사, 문화, 여행에 대해 이야기해요. 작은 실수도 배움의 기회가 되는 따뜻한 수업을 만들어요.',
  },
  {
    name: 'Luigi',
    major: 'Biomedical Engineering',
    university: 'University of Florida',
    category: 'Education',
    rating: '4.1',
    reviews: 27,
    image: 4,
    intro:
      '복잡한 생각을 명확한 영어로 전달하는 연습을 도와드려요. 기술과 과학에 대한 대화도 환영해요.',
  },
  {
    name: 'Tatiana',
    major: 'Architecture',
    university: 'Smith College',
    category: 'Art / Media',
    rating: '4.8',
    reviews: 18,
    image: 5,
    intro:
      '디자인과 예술에서 일상까지, 관심 있는 주제로 이야기해요. 여러분만의 표현을 찾도록 도와드릴게요.',
  },
]
type Tutor = (typeof tutors)[number]
function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    home: 'M3 10 12 3l9 7v11h-6v-7H9v7H3Z',
    lesson: 'M3 4h18v13H3ZM8 21h8M12 17v4',
    calendar: 'M4 5h16v16H4ZM4 10h16M8 3v4M16 3v4',
    user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21a8 8 0 0 1 16 0',
    chat: 'M3 4h18v14H9l-6 4ZM7 9h10M7 13h7',
    chart: 'M4 21V12h3v9M11 21V4h3v17M18 21V8h3v13',
    search: 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM15 15l6 6',
    bookmark: 'M6 3h12v18l-6-4-6 4Z',
    arrow: 'm9 5 7 7-7 7',
    help: 'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18h.01',
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.chat} />
    </svg>
  )
}
function App() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('추천')
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('saved-tutors') || '[]')
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState('')
  const [bookmarkNotice, setBookmarkNotice] = useState<{ name: string } | null>(
    null,
  )
  const [selected, setSelected] = useState<Tutor | null>(null)
  const [recommend, setRecommend] = useState(false)
  const [interest, setInterest] = useState('')
  const [filter, setFilter] = useState('')
  useEffect(() => {
    localStorage.setItem('saved-tutors', JSON.stringify(saved))
  }, [saved])
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
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelected(null)
        setRecommend(false)
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])
  const visible = tutors.filter(
    (t) =>
      `${t.name} ${t.major} ${t.university}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (tab !== '북마크' || saved.includes(t.name)) &&
      (!filter || t.category === filter),
  )
  function bookmark(name: string) {
    const exists = saved.includes(name)
    setSaved(exists ? saved.filter((n) => n !== name) : [...saved, name])
    setToast('')
    setBookmarkNotice(exists ? null : { name })
    if (exists) setToast('찜한 튜터에서 삭제했어요.')
  }
  return (
    <>
      <aside className="sidebar">
        <a className="logo" href="/" aria-label="Ringle 홈">
          Ringle
        </a>
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
            <Icon name="lesson" />
            링글 가이드
          </div>
          <button
            className="support"
            onClick={() => setToast('문의: help@ringleplus.com')}
            aria-label="고객 지원"
          >
            <Icon name="chat" />
          </button>
        </div>
      </aside>
      <header className="topbar">
        <span>9회말 역전 이벤트</span>
        <span>구매</span>
        <span>기업 제휴</span>
        <i />
        <button
          className="avatar"
          aria-label="내 프로필"
          onClick={() =>
            setToast('튜터 추천을 살펴보고 첫 수업을 준비해 보세요.')
          }
        />
      </header>
      <main>
        <nav className="lesson-tabs">
          <span>예정된 수업 (0)</span>
          <span>지난 수업</span>
          <span className="current">튜터</span>
          <span>교재</span>
        </nav>
        <h1>튜터</h1>
        <div className="tab-row">
          <div className="tabs">
            {['추천', '전체', '북마크'].map((name) => (
              <button
                key={name}
                className={tab === name ? 'selected' : ''}
                onClick={() => {
                  setTab(name)
                  setFilter('')
                }}
              >
                {name}
                {name === '북마크' && saved.length > 0 && (
                  <small>{saved.length}</small>
                )}
              </button>
            ))}
          </div>
          <label className="search">
            <Icon name="search" />
            <input
              aria-label="튜터 검색"
              placeholder="튜터 이름 또는 전공으로 검색하세요."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button onClick={() => setQuery('')} aria-label="검색 지우기">
                ×
              </button>
            )}
          </label>
        </div>
        <button className="recommend-banner" onClick={() => setRecommend(true)}>
          <span className="sparkle">✦</span>
          <span>나에게 맞는 튜터가 궁금하다면?</span>
          <strong>
            링글 팀에게 추천받기 <span>›</span>
          </strong>
        </button>
        <section className="recommendations">
          <div className="section-heading">
            <h2>
              {tab === '북마크'
                ? '내가 저장한 튜터'
                : tab === '전체'
                  ? '전체 튜터'
                  : '링글이 추천하는'}{' '}
              <span className="hint" tabIndex={0} aria-label="추천 안내">
                ?
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
          <div className="tutor-grid">
            {visible.map((t) => (
              <article className="tutor-card" key={t.name}>
                <div className="portrait">
                  <img
                    src={`/tutor-${t.image}.png`}
                    alt={`${t.name} 튜터 캐릭터`}
                  />
                  <button
                    className={`bookmark ${saved.includes(t.name) ? 'saved' : ''}`}
                    aria-label={`${t.name} 북마크`}
                    aria-pressed={saved.includes(t.name)}
                    onClick={() => bookmark(t.name)}
                  >
                    <Icon name="bookmark" />
                  </button>
                  <div className="hover-panel">
                    <span className="hover-label">MEET YOUR TUTOR</span>
                    <p>{t.intro}</p>
                    <button onClick={() => setSelected(t)}>
                      튜터 자세히 보기 <Icon name="arrow" />
                    </button>
                  </div>
                </div>
                <div className="card-title">
                  <button onClick={() => setSelected(t)}>{t.name}</button>
                  <span>
                    <b>★</b> {t.rating} <em>({t.reviews})</em>
                  </span>
                </div>
                <p className="major">{t.major}</p>
                <p className="university" title={t.university}>
                  {t.university}
                </p>
                <span className="category">{t.category}</span>
              </article>
            ))}
          </div>
          {visible.length === 0 && (
            <div className="empty">
              <Icon name="search" />
              <h3>
                {tab === '북마크'
                  ? '저장한 튜터가 없어요'
                  : '검색 결과가 없어요'}
              </h3>
              <p>
                {tab === '북마크'
                  ? '마음에 드는 튜터의 북마크를 눌러보세요.'
                  : '다른 이름이나 전공으로 검색해 보세요.'}
              </p>
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
      <button className="trial" onClick={() => setRecommend(true)}>
        <Icon name="calendar" />
        체험 수업 예약
      </button>
      <button
        className="floating-chat"
        aria-label="문의하기"
        onClick={() => setToast('문의: help@ringleplus.com')}
      >
        <Icon name="chat" />
        <i />
      </button>
      {bookmarkNotice && (
        <div className="bookmark-notice">
          <p role="status" aria-live="polite">
            찜한 튜터에 추가했어요.
          </p>
          <button
            onClick={() => {
              setTab('북마크')
              setQuery('')
              setFilter('')
              setSelected(null)
              setRecommend(false)
              setBookmarkNotice(null)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
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
        <div
          className="modal-backdrop"
          onClick={() => {
            setSelected(null)
            setRecommend(false)
          }}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close"
              autoFocus
              aria-label="닫기"
              onClick={() => {
                setSelected(null)
                setRecommend(false)
              }}
            >
              ×
            </button>
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
          </section>
        </div>
      )}
    </>
  )
}
export default App
