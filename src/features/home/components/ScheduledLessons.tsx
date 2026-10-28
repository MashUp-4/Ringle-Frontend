import { useRef, useState } from 'react'
import type { ScheduledLesson } from '../types/home'
import type { Tutor } from '../../tutors/types/tutor'
import { nextButtonRight } from '../../../components/ui/iconAssets'
import { TutorImage } from '../../tutors/components/TutorImage'

interface ScheduledLessonsProps {
  lessons: ScheduledLesson[]
  totalCount?: number
  onDetails: (tutor: Tutor) => void
  onInformation: (title: string, description: string) => void
}

export function ScheduledLessons({
  lessons,
  totalCount = lessons.length,
  onDetails,
  onInformation,
}: ScheduledLessonsProps) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const multiple = lessons.length > 1
  const lastIndex = Math.max(0, lessons.length - 1)
  const currentIndex = Math.min(Math.max(active, 0), lastIndex)

  function move(index: number) {
    const element = track.current
    if (!element || lessons.length === 0) return
    const targetIndex = Math.min(Math.max(index, 0), lastIndex)
    if (multiple) element.focus({ preventScroll: true })
    element.scrollTo({
      left: targetIndex * element.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }

  return (
    <section className="home-scheduled" aria-labelledby="scheduled-title">
      <div className="home-scheduled-heading">
        <h1 id="scheduled-title">예정된 수업 {totalCount}</h1>
      </div>
      <div className="home-lesson-row">
        <div
          className="home-lesson-track"
          ref={track}
          role={multiple ? 'region' : undefined}
          aria-label={multiple ? '예약 수업 목록' : undefined}
          aria-roledescription={multiple ? '캐러셀' : undefined}
          tabIndex={multiple ? 0 : undefined}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) return
            const next =
              event.key === 'ArrowRight'
                ? currentIndex + 1
                : event.key === 'ArrowLeft'
                  ? currentIndex - 1
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? lessons.length - 1
                      : null
            if (next !== null) {
              event.preventDefault()
              move(next)
            }
          }}
          onScroll={(event) => {
            const element = event.currentTarget
            if (element.clientWidth)
              setActive(Math.round(element.scrollLeft / element.clientWidth))
          }}
        >
          {lessons.map((lesson, index) => {
            const tutor = lesson.tutor
            return (
              <article
                className="home-lesson-slide"
                key={lesson.id}
                aria-label={`${index + 1} / ${lessons.length}: ${lesson.dateLabel}`}
                inert={multiple && currentIndex !== index}
              >
                <h2>{lesson.dateLabel}</h2>
                <div className="home-lesson-summary">
                  {tutor && (
                    <button
                      className="home-lesson-photo"
                      aria-label={`${tutor.name} 튜터 자세히 보기`}
                      onClick={() => onDetails(tutor)}
                    >
                      <TutorImage tutor={tutor} />
                    </button>
                  )}
                  <div className="home-lesson-info">
                    {tutor ? (
                      <button
                        className="home-lesson-name"
                        onClick={() => onDetails(tutor)}
                      >
                        {tutor.name}
                      </button>
                    ) : (
                      <strong>{lesson.tutorName}</strong>
                    )}
                    {tutor && (
                      <p className="home-lesson-school">
                        {tutor.major} · <span>{tutor.university}</span>
                      </p>
                    )}
                    <p>
                      {lesson.goal} · {lesson.durationMinutes}분
                    </p>
                    <div className="home-lesson-tags">
                      {lesson.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="home-lesson-actions">
                  <button
                    className="home-lesson-change"
                    onClick={() =>
                      onInformation(
                        '일정 변경',
                        `${lesson.dateLabel} 수업의 일정 변경은 예약 API 연동 후 제공될 예정이에요.`,
                      )
                    }
                  >
                    일정 변경
                  </button>
                  <button
                    className="home-primary-button"
                    onClick={() =>
                      onInformation(
                        '예습하기',
                        `${lesson.goal} 수업을 준비해 보세요. 수업별 교재는 API 연동 후 확인할 수 있어요.`,
                      )
                    }
                  >
                    예습하기
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        {currentIndex > 0 && (
          <button
            type="button"
            className="home-lesson-previous"
            aria-label="이전 수업"
            onClick={() => move(currentIndex - 1)}
          >
            <img src={nextButtonRight} alt="" />
          </button>
        )}
        {(lessons.length === 1 || currentIndex < lastIndex) && (
          <button
            type="button"
            className="home-lesson-next"
            aria-label="다음 수업"
            onClick={() => move(currentIndex + 1)}
          >
            <img src={nextButtonRight} alt="" />
          </button>
        )}
      </div>
    </section>
  )
}
