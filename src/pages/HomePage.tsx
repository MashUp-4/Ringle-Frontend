import { LoadingState } from '../components/ui/LoadingState'
import { slowLoadingMessage } from '../hooks/useSlowLoading'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { Icon } from '../components/ui/Icon'
import { Modal } from '../components/ui/Modal'
import { ScheduledLessons } from '../features/home/components/ScheduledLessons'
import { HomeTutorCard } from '../features/home/components/HomeTutorCard'
import { useUserSummary } from '../features/user/hooks/useUser'
import { learningGoals } from '../features/home/data/home'
import type { LearningGoal } from '../features/home/types/home'
import { useServerBookmarks } from '../features/tutors/hooks/useServerBookmarks'
import { useTutors } from '../features/tutors/hooks/useTutors'
import { TutorImage } from '../features/tutors/components/TutorImage'
import { useHome } from '../features/home/hooks/useHome'
import {
  getLearningGoal,
  homeCategories,
  toHomeRecommendations,
  toScheduledLessons,
} from '../features/home/api/homeAdapter'
import type { Tutor } from '../features/tutors/types/tutor'
import './HomePage.css'
import {
  homeGuideDivider,
  homeProfileDivider,
  nextButtonRight,
} from '../components/ui/iconAssets'

type HomeDialog =
  | { type: 'tutor'; tutor: Tutor }
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
  const {
    summary,
    loading: userLoading,
    slow: userSlow,
    error: userError,
    reload: reloadUser,
  } = useUserSummary()
  const balance = {
    fortyMinutes: summary?.credit40MinCount ?? 0,
    twentyMinutes: summary?.credit20MinCount ?? 0,
  }
  const profile = {
    name: summary?.name ?? '',
    timezone: summary?.timeZone ?? '',
  }
  const [selectedGoalId, setGoal] = useState<LearningGoal | null>(null)
  const { home, recommendedTutors, loading, slow, error, reload } = useHome(
    selectedGoalId ? homeCategories[selectedGoalId] : undefined,
  )
  const recommendationData =
    home?.type === 'RECOMMENDED_TUTORS' ? home.recommendedTutors : null
  const signupGoal = recommendationData
    ? getLearningGoal(recommendationData.signupCategory)
    : null
  const goal =
    selectedGoalId ??
    (recommendationData
      ? getLearningGoal(recommendationData.selectedCategory)
      : 'career')
  const hasPass = recommendationData?.hasLessonPass ?? false
  const recommended = useMemo(
    () => toHomeRecommendations(recommendedTutors),
    [recommendedTutors],
  )
  const scheduledLessons = useMemo(
    () =>
      home?.type === 'UPCOMING_CLASS'
        ? toScheduledLessons(home.upcomingClasses.classes)
        : [],
    [home],
  )
  const [dialog, setDialog] = useState<HomeDialog>(null)
  const [toast, setToast] = useState('')
  const [bookmarkNotice, setBookmarkNotice] = useState<{ name: string } | null>(
    null,
  )
  const [challengeVisible, setChallengeVisible] = useState(true)
  const [curriculum, setCurriculum] = useState(false)

  const {
    tutors: listedTutors,
    loading: tutorsLoading,
    error: tutorsError,
  } = useTutors()
  const { isSaved, isPending, toggleBookmark, storageError } =
    useServerBookmarks(listedTutors)
  const dialogTutor = dialog?.type === 'tutor' ? dialog.tutor : null
  const listedTutor = listedTutors.find((tutor) => tutor.id === dialogTutor?.id)
  const canSupplementTutor = home?.type === 'UPCOMING_CLASS'
  const selectedTutor = dialogTutor
    ? {
        ...dialogTutor,
        isMyTutor: canSupplementTutor
          ? (listedTutor?.isMyTutor ?? dialogTutor.isMyTutor)
          : dialogTutor.isMyTutor,
        rating: canSupplementTutor
          ? (listedTutor?.rating ?? dialogTutor.rating)
          : dialogTutor.rating,
        reviews: canSupplementTutor
          ? (listedTutor?.reviews ?? dialogTutor.reviews)
          : dialogTutor.reviews,
        intro:
          dialogTutor.intro ||
          (canSupplementTutor ? (listedTutor?.intro ?? '') : ''),
      }
    : null

  const selectedGoal = learningGoals.find((item) => item.id === goal)!

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

  async function bookmark(tutor: Tutor) {
    const exists = isSaved(tutor)
    if (!(await toggleBookmark(tutor))) return
    setToast('')
    setBookmarkNotice(exists ? null : { name: tutor.name })
    if (exists) setToast('찜한 튜터에서 삭제했어요.')
  }

  const homeTutorGridRef = useRef<HTMLDivElement>(null)

  function showNextHomeTutor() {
    const grid = homeTutorGridRef.current
    const firstCard = grid?.firstElementChild

    if (!grid || !(firstCard instanceof HTMLElement)) return

    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0

    grid.scrollBy({
      left: firstCard.offsetWidth + gap,
      behavior: 'instant',
    })
  }

  return (
    <AppShell onNotice={setToast}>
      <main className="home-page">
        <div className="home-columns">
          <div className="home-primary">
            {loading && !home && (
              <LoadingState
                label={slow ? slowLoadingMessage : '홈 정보를 불러오고 있어요.'}
              />
            )}
            {error && (
              <div role="alert" className="py-12 text-center">
                <p>{error}</p>
                <button onClick={reload}>다시 시도</button>
              </div>
            )}

            <button className="home-offer" onClick={purchase}>
              <Icon name="home-coupon" />
              <span className="home-offer-label">
                [첫 구매 혜택] 수업권 최대 2회 추가
              </span>
              <strong>
                D-276 <Icon name="home-offer-arrow" />
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

            {home?.type === 'UPCOMING_CLASS' ? (
              <ScheduledLessons
                lessons={scheduledLessons}
                totalCount={home.upcomingClasses.totalCount}
                onDetails={(tutor) => setDialog({ type: 'tutor', tutor })}
                onInformation={information}
              />
            ) : home?.type === 'RECOMMENDED_TUTORS' ? (
              <section
                className="home-recommendations"
                aria-labelledby="home-recommendation-title"
                aria-busy={loading}
              >
                <div className="home-section-heading">
                  <h1 id="home-recommendation-title">
                    {hasPass
                      ? '이번 수업, 무엇을 연습할까요?'
                      : '예정된 수업이 없어요. 링글이 추천하는 튜터를 만나보세요!'}
                  </h1>
                  <Link to="/tutors">추천 튜터 더보기</Link>
                </div>

                <div
                  className="home-goals"
                  role="tablist"
                  aria-label="학습 목표"
                >
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
                      {item.id === signupGoal && <small>가입 시 선택</small>}
                    </button>
                  ))}
                </div>

                <div
                  role="tabpanel"
                  id="home-tutor-panel"
                  aria-labelledby={`goal-${goal}`}
                >
                  <p className="home-goal-description">
                    {recommendationData?.interestField
                      ? `${recommendationData.interestField} 관심 분야에 맞는 튜터예요.`
                      : goal === 'career' && signupGoal !== 'career'
                        ? '커리어/인터뷰 목적에 맞는 튜터예요.'
                        : selectedGoal.description}
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
                      {slow
                        ? slowLoadingMessage
                        : '추천 튜터를 불러오고 있어요.'}
                    </p>
                  )}

                  {!loading && !error && recommended.length > 0 && (
                    <div className="home-tutor-row">
                      <div className="home-tutor-grid" ref={homeTutorGridRef}>
                        {recommended.map(({ tutor, recommendation }) => (
                          <HomeTutorCard
                            key={tutor.id}
                            tutor={tutor}
                            recommendation={recommendation}
                            bookmarked={isSaved(tutor)}
                            bookmarkDisabled={isPending(tutor)}
                            onBookmark={() => void bookmark(tutor)}
                            onDetails={() =>
                              setDialog({ type: 'tutor', tutor })
                            }
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        className="home-tutor-next"
                        aria-label="다음 추천 튜터"
                        onClick={showNextHomeTutor}
                      >
                        <img src={nextButtonRight} alt="" />
                      </button>
                    </div>
                  )}

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
                      <button
                        className="home-primary-button"
                        onClick={purchase}
                      >
                        수업권 구매하고 예약하기
                      </button>
                      {summary && summary.unusedCouponCount > 0 && (
                        <p>
                          사용 가능한 쿠폰 {summary.unusedCouponCount}장이
                          있어요.
                        </p>
                      )}
                    </>
                  )}
                </div>
              </section>
            ) : null}

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
                <Icon name="home-arrow" />
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

              <span className="home-guide-divider" aria-hidden="true">
                <img src={homeGuideDivider} alt="" />
              </span>
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
                  자세히 보기 <Icon name="home-arrow" />
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
                    <Icon name="home-dismiss" />
                  </button>

                  <div className="home-challenge-message">
                    <p>
                      2026년 링글로 영어 공부하고 포인트, 무료 수업권,
                      실리콘밸리 투어까지
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
            <section className="home-profile" aria-busy={userLoading}>
              {userLoading ? (
                <LoadingState
                  compact
                  label={
                    userSlow
                      ? slowLoadingMessage
                      : '회원 정보를 불러오는 중이에요.'
                  }
                />
              ) : userError ? (
                <div role="alert">
                  <p>{userError}</p>
                  <button onClick={reloadUser}>다시 시도</button>
                </div>
              ) : (
                summary && (
                  <>
                    <div className="home-profile-heading">
                      <div>
                        <h2>안녕하세요 {profile.name}님!</h2>
                        <p className="home-timezone">{profile.timezone}</p>
                      </div>
                      <button
                        onClick={() =>
                          information(
                            '프로필 설정',
                            '프로필 수정 기능은 API 준비 후 제공됩니다.',
                          )
                        }
                      >
                        프로필 설정
                      </button>
                    </div>

                    <div className="home-profile-divider" aria-hidden="true">
                      <img src={homeProfileDivider} alt="" />
                    </div>

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
                          <span className="home-pass-balances">
                            <span>
                              40분 <b>{balance.fortyMinutes}</b>
                            </span>
                            <span>
                              20분 <b>{balance.twentyMinutes}</b>
                            </span>
                          </span>
                          <Icon name="home-profile-arrow" />
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
                        <Icon name="home-profile-arrow" />
                      </button>

                      <button
                        onClick={() =>
                          information(
                            '포인트',
                            `보유 포인트는 ${summary.points.toLocaleString()}P예요.`,
                          )
                        }
                      >
                        <strong>포인트</strong>
                        <span className="text-ink">
                          {summary.points.toLocaleString()}P{' '}
                          <Icon name="home-profile-arrow" />
                        </span>
                      </button>

                      <button
                        onClick={() =>
                          information(
                            '쿠폰',
                            `사용할 수 있는 쿠폰 ${summary.unusedCouponCount}장이 있어요.`,
                          )
                        }
                      >
                        <strong>쿠폰</strong>
                        <span>
                          {summary.unusedCouponCount}{' '}
                          <Icon name="home-profile-arrow" />
                        </span>
                      </button>
                    </div>
                  </>
                )
              )}
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

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}

      {bookmarkNotice && (
        <div className="bookmark-notice">
          <p role="status">찜한 튜터에 추가했어요.</p>
          <Link to="/tutors/all?saved=1">
            찜한 목록 바로가기 <Icon name="arrow" />
          </Link>
        </div>
      )}

      {dialog && (
        <Modal labelledBy="home-dialog-title" onClose={() => setDialog(null)}>
          {selectedTutor ? (
            <>
              <TutorImage tutor={selectedTutor} />
              <h2 id="home-dialog-title">{selectedTutor.name}</h2>
              <p className="modal-school">
                {selectedTutor.major} · {selectedTutor.university}
              </p>
              <p>{selectedTutor.intro}</p>
              <p className="modal-rating">
                ★ {selectedTutor.rating} · 수업 후기 {selectedTutor.reviews}개
              </p>
              {selectedTutor.isMyTutor === undefined && tutorsError && (
                <p role="status">{tutorsError}</p>
              )}
              {storageError && <p role="status">{storageError}</p>}
              <button
                className="primary"
                disabled={
                  isPending(selectedTutor) ||
                  selectedTutor.isMyTutor === undefined ||
                  (tutorsLoading && dialogTutor?.isMyTutor === undefined)
                }
                onClick={() => void bookmark(selectedTutor)}
              >
                {isSaved(selectedTutor) ? '북마크 해제' : '튜터 북마크하기'}
              </button>
            </>
          ) : dialog.type === 'information' ? (
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
          ) : null}
        </Modal>
      )}
    </AppShell>
  )
}
