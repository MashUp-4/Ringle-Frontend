import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { Icon } from '../components/ui/Icon'
import { chatbot } from '../components/ui/iconAssets'
import { Modal } from '../components/ui/Modal'
import { HomeTutorCard } from '../features/home/components/HomeTutorCard'
import { ProfileEditor } from '../features/home/components/ProfileEditor'
import { learningGoals } from '../features/home/data/home'
import type {
  HomeProfile,
  LessonPassBalance,
  LearningGoal,
} from '../features/home/types/home'
import { useBookmarks } from '../features/tutors/hooks/useBookmarks'
import { useTutors } from '../features/tutors/hooks/useTutors'
import './HomePage.css'

type HomeDialog =
  | { type: 'profile' }
  | { type: 'information'; title: string; description: string }
  | null

const shortcuts = [
  { icon: 'shortcut-purchase', label: '구매' },
  { icon: 'shortcut-tutor', label: '튜터' },
  { icon: 'shortcut-material', label: '교재' },
  { icon: 'shortcut-lesson-review', label: '수업 리뷰' },
  { icon: 'shortcut-ai-analysis', label: 'AI 분석 통계' },
]

export default function HomePage() {
  const [params] = useSearchParams()

  // 실제 보유 수업권 API 계약 전, 두 디자인 상태를 확인하는 데모 데이터입니다.
  const balance: LessonPassBalance =
    params.get('passes') === 'available'
      ? { fortyMinutes: 1, twentyMinutes: 0 }
      : { fortyMinutes: 0, twentyMinutes: 0 }

  const hasPass = balance.fortyMinutes + balance.twentyMinutes > 0

  const [goal, setGoal] = useState<LearningGoal>('career')
  const [profile, setProfile] = useState<HomeProfile>({
    name: '한수지',
    timezone: 'Asia/Seoul',
  })
  const [dialog, setDialog] = useState<HomeDialog>(null)
  const [toast, setToast] = useState('')
  const [bookmarkNotice, setBookmarkNotice] = useState<{ name: string } | null>(
    null,
  )
  const [challengeVisible, setChallengeVisible] = useState(true)
  const [curriculum, setCurriculum] = useState(false)

  const { tutors, loading, error, reload } = useTutors()
  const { saved, toggleBookmark, storageError } = useBookmarks()

  const selectedGoal = learningGoals.find((item) => item.id === goal)!
  const recommended = selectedGoal.tutorNames.flatMap((name) =>
    tutors.filter((tutor) => tutor.name === name),
  )

  useEffect(() => {
    document.title = '홈 | Ringle'
  }, [])

  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => setToast(''), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!bookmarkNotice) return

    const timer = setTimeout(() => setBookmarkNotice(null), 5000)
    return () => clearTimeout(timer)
  }, [bookmarkNotice])

  function information(title: string, description: string) {
    setDialog({ type: 'information', title, description })
  }

  function purchase() {
    information(
      '수업권 알아보기',
      '40분 수업은 깊이 있는 토론과 피드백을, 20분 수업은 꾸준한 영어 말하기 연습을 위한 선택이에요. 마음에 드는 튜터를 먼저 살펴보세요.',
    )
  }

  function bookmark(name: string) {
    const exists = saved.includes(name)

    toggleBookmark(name)
    setToast('')
    setBookmarkNotice(exists ? null : { name })

    if (exists) {
      setToast('찜한 튜터에서 삭제했어요.')
    }
  }

  return (
    <AppShell onNotice={setToast}>
      <main className="home-page">
        <div className="home-columns">
          <div className="home-primary">
            <button className="home-offer" onClick={purchase}>
              <Icon name="home-coupon" />
              <span>[첫 구매 혜택] 수업권 최대 2회 추가</span>
              <strong>
                혜택 확인하기 <Icon name="arrow" />
              </strong>
            </button>

            <button
              className="home-image-banner home-package"
              onClick={purchase}
            >
              <img
                src="/home/lesson-package.png"
                alt="결과를 만드는 영어 학습, 링글 패키지 하나면 끝! 수업권 알아보기"
              />
            </button>

            <section
              className="home-recommendations"
              aria-labelledby="home-recommendation-title"
            >
              <div className="home-section-heading">
                <h1 id="home-recommendation-title">
                  {hasPass
                    ? '이번 수업, 무엇을 연습할까요?'
                    : '예정된 수업이 없어요. 링글이 추천하는 튜터를 만나보세요!'}
                </h1>
                <Link to="/tutors">추천 튜터 더보기</Link>
              </div>

              <div className="home-goals" role="tablist" aria-label="학습 목표">
                {learningGoals.map((item) => (
                  <button
                    key={item.id}
                    id={`goal-${item.id}`}
                    role="tab"
                    aria-selected={goal === item.id}
                    aria-controls="home-tutor-panel"
                    tabIndex={goal === item.id ? 0 : -1}
                    className={goal === item.id ? 'chosen' : ''}
                    onClick={() => setGoal(item.id)}
                    onKeyDown={(event) => {
                      const index = learningGoals.findIndex(
                        (option) => option.id === goal,
                      )

                      const next =
                        event.key === 'ArrowRight'
                          ? (index + 1) % learningGoals.length
                          : event.key === 'ArrowLeft'
                            ? (index + learningGoals.length - 1) %
                              learningGoals.length
                            : event.key === 'Home'
                              ? 0
                              : event.key === 'End'
                                ? learningGoals.length - 1
                                : null

                      if (next === null) return

                      event.preventDefault()
                      setGoal(learningGoals[next].id)
                      document
                        .getElementById(`goal-${learningGoals[next].id}`)
                        ?.focus()
                    }}
                  >
                    {item.label}
                    {item.id === 'career' && <small>가입 시 선택</small>}
                  </button>
                ))}
              </div>

              <div
                role="tabpanel"
                id="home-tutor-panel"
                aria-labelledby={`goal-${goal}`}
              >
                <p className="home-goal-description">
                  {selectedGoal.description}
                </p>

                {storageError && (
                  <p
                    role="status"
                    className="rounded-lg bg-amber-50 p-3 mb-4 text-amber-900"
                  >
                    {storageError}
                  </p>
                )}

                {loading && (
                  <p role="status" className="py-16 text-center text-muted">
                    추천 튜터를 불러오고 있어요.
                  </p>
                )}

                {error && (
                  <div role="alert" className="py-12 text-center">
                    <p>{error}</p>
                    <button className="mt-3 text-primary" onClick={reload}>
                      다시 시도
                    </button>
                  </div>
                )}

                <div className="home-tutor-grid">
                  {recommended.map((tutor) => (
                    <HomeTutorCard
                      key={tutor.name}
                      tutor={tutor}
                      bookmarked={saved.includes(tutor.name)}
                      onBookmark={() => bookmark(tutor.name)}
                    />
                  ))}
                </div>

                {!loading && !error && recommended.length === 0 && (
                  <p className="py-12 text-center text-muted">
                    추천할 튜터가 없어요. 다른 관심 분야를 선택해 주세요.
                  </p>
                )}
              </div>

              <div className="home-reserve">
                {hasPass ? (
                  <Link className="home-primary-button" to="/tutors">
                    바로 예약하기
                  </Link>
                ) : (
                  <>
                    <button className="home-primary-button" onClick={purchase}>
                      수업권 구매하고 예약하기
                    </button>
                    <p>보유 쿠폰 1장이 자동으로 적용돼요.</p>
                  </>
                )}
              </div>
            </section>

            <section className="home-curriculum">
              <button
                className="home-curriculum-toggle"
                aria-expanded={curriculum}
                aria-controls="curriculum-details"
                onClick={() => setCurriculum((value) => !value)}
              >
                <span>
                  <Icon name="home-curriculum" />
                  커리큘럼 선택
                </span>
                <Icon name="arrow" />
              </button>

              {curriculum && (
                <div
                  id="curriculum-details"
                  className="home-curriculum-options"
                >
                  {learningGoals.map((item) => (
                    <button
                      key={item.id}
                      className={goal === item.id ? 'chosen' : ''}
                      onClick={() => {
                        setGoal(item.id)
                        setCurriculum(false)
                        setToast(`${item.label} 커리큘럼을 선택했어요.`)
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </section>

            <div className="home-guide-row">
              <button
                onClick={() =>
                  information(
                    '링글 사용법',
                    '관심 분야에 맞는 튜터와 교재를 선택하고 수업을 예약해 보세요. 수업 전 예습과 수업 후 피드백 복습으로 학습을 이어갈 수 있어요.',
                  )
                }
              >
                <Icon name="home-ringle-guide" />
                링글 사용법
              </button>

              <button
                onClick={() =>
                  information(
                    'OT 신청',
                    '첫 수업 준비가 궁금하다면 help@ringleplus.com으로 오리엔테이션을 문의해 주세요.',
                  )
                }
              >
                <Icon name="home-ot-application" />
                OT 신청
              </button>
            </div>

            <section
              className="home-shortcuts"
              aria-labelledby="shortcuts-title"
            >
              <h2 id="shortcuts-title">바로가기</h2>

              <div>
                {shortcuts.map(({ icon, label }) =>
                  label === '튜터' ? (
                    <Link key={label} to="/tutors">
                      <span>
                        <Icon name={icon} />
                      </span>
                      {label}
                    </Link>
                  ) : (
                    <button
                      key={label}
                      onClick={() =>
                        label === '구매'
                          ? purchase()
                          : information(
                              label,
                              `${label} 서비스는 준비 중이에요. 지금은 추천 튜터를 살펴보고 학습 목표를 정해 보세요.`,
                            )
                      }
                    >
                      <span>
                        <Icon name={icon} />
                      </span>
                      {label}
                    </button>
                  ),
                )}
              </div>
            </section>

            <button
              className="home-image-banner home-points"
              onClick={() =>
                document
                  .getElementById('home-challenge')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            >
              <img
                src="/home/points-challenge.png"
                alt="링글 포인트를 받을 기회, 놓치지 마세요! 챌린지 참여하기"
              />
            </button>

            <section className="home-challenge" id="home-challenge">
              <div className="home-section-heading">
                <h2>실리콘밸리 챌린지</h2>
                <button
                  onClick={() =>
                    information(
                      '실리콘밸리 챌린지',
                      '꾸준한 영어 학습에 도전해 보세요. 수업과 복습을 이어가며 학습 목표를 달성하는 챌린지예요.',
                    )
                  }
                >
                  자세히 보기 <Icon name="arrow" />
                </button>
              </div>

              <p className="home-challenge-subtitle">
                종료까지 56일 남음 · 1,606명 참여중
              </p>

              {challengeVisible ? (
                <div className="home-challenge-invite">
                  <button
                    className="home-dismiss"
                    aria-label="챌린지 안내 닫기"
                    onClick={() => setChallengeVisible(false)}
                  >
                    ×
                  </button>

                  <p>
                    2026년 링글로 영어 공부하고 포인트, 무료 수업권, 실리콘밸리
                    투어까지
                    <br />갈 수 있는 기회를 놓치지 마세요!
                  </p>

                  <button
                    className="home-primary-button"
                    onClick={() =>
                      information(
                        '챌린지 참여 안내',
                        '챌린지 참여 신청은 준비 중이에요. 자세한 참여 조건과 일정은 정식 안내에서 확인해 주세요.',
                      )
                    }
                  >
                    1초만에 신청하기
                  </button>
                </div>
              ) : (
                <button
                  className="home-challenge-reopen"
                  onClick={() => setChallengeVisible(true)}
                >
                  챌린지 안내 다시 보기
                </button>
              )}
            </section>
          </div>

          <aside className="home-secondary" aria-label="내 정보와 추천 이벤트">
            <section className="home-profile">
              <div className="home-profile-heading">
                <h2>안녕하세요 {profile.name}님!</h2>
                <button onClick={() => setDialog({ type: 'profile' })}>
                  프로필 설정
                </button>
              </div>

              <p className="home-timezone">{profile.timezone}</p>

              <div className="home-profile-links">
                <button
                  onClick={() =>
                    information(
                      '내 수업권',
                      `40분 수업권 ${balance.fortyMinutes}회, 20분 수업권 ${balance.twentyMinutes}회를 보유하고 있어요.`,
                    )
                  }
                >
                  <strong>내 수업권</strong>
                  <span>
                    40분 <b>{balance.fortyMinutes}</b> 20분{' '}
                    <b>{balance.twentyMinutes}</b>
                    <Icon name="arrow" />
                  </span>
                </button>

                <button
                  onClick={() =>
                    information(
                      'AI 스피킹 멤버십',
                      'AI 스피킹 멤버십 서비스는 준비 중이에요.',
                    )
                  }
                >
                  <strong>AI 스피킹 멤버십</strong>
                  <Icon name="arrow" />
                </button>

                <button
                  onClick={() => information('포인트', '보유 포인트는 0P예요.')}
                >
                  <strong>포인트</strong>
                  <span className="text-ink">
                    0P <Icon name="arrow" />
                  </span>
                </button>

                <button
                  onClick={() =>
                    information(
                      '쿠폰',
                      '첫 구매에 사용할 수 있는 쿠폰 1장이 있어요.',
                    )
                  }
                >
                  <strong>쿠폰</strong>
                  <span>
                    1 <Icon name="arrow" />
                  </span>
                </button>
              </div>
            </section>

            <button
              className="home-image-banner"
              onClick={() =>
                information(
                  '링글 슈퍼매치',
                  '수업과 응원으로 팀을 우승시키는 링글 슈퍼매치를 만나보세요.',
                )
              }
            >
              <img
                src="/home/supermatch.png"
                alt="링글 슈퍼매치, 수업과 응원으로 팀을 우승시키자!"
              />
            </button>

            <button
              className="home-image-banner"
              onClick={() =>
                information(
                  '1분 영어 레벨 테스트',
                  '영어 레벨 테스트 서비스는 준비 중이에요.',
                )
              }
            >
              <img
                src="/home/level-test.png"
                alt="영어로 보는 내 직급은? 1분 영어 레벨 테스트"
              />
            </button>
          </aside>
        </div>
      </main>

      <Link className="trial home-trial" to="/tutors">
        <Icon name="trial" />
        체험 수업 예약
      </Link>

      <button
        className="floating-chat"
        aria-label="문의하기"
        onClick={() => setToast('문의: help@ringleplus.com')}
      >
        <img src={chatbot} alt="" width={72} height={72} />
      </button>

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      {bookmarkNotice && (
        <div className="bookmark-notice">
          <p role="status">찜한 튜터에 추가했어요.</p>
          <Link to="/tutors/favorites?saved=1">
            찜한 목록 바로가기 <Icon name="arrow" />
          </Link>
        </div>
      )}

      {dialog && (
        <Modal labelledBy="home-dialog-title" onClose={() => setDialog(null)}>
          {dialog.type === 'profile' ? (
            <ProfileEditor
              profile={profile}
              onSave={(value) => {
                setProfile(value)
                setDialog(null)
                setToast('프로필을 저장했어요.')
              }}
            />
          ) : (
            <>
              <h2 id="home-dialog-title">{dialog.title}</h2>
              <p>{dialog.description}</p>
              <Link
                className="home-primary-button mt-6 block text-center"
                to="/tutors"
              >
                튜터 둘러보기
              </Link>
            </>
          )}
        </Modal>
      )}
    </AppShell>
  )
}
