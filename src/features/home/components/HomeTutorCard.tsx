import { Link } from 'react-router-dom'
import { Icon } from '../../../components/ui/Icon'
import type { Tutor } from '../../tutors/types/tutor'
import { tutorHighlights } from '../data/home'
interface HomeTutorCardProps {
  tutor: Tutor
  bookmarked: boolean
  onBookmark: () => void
}
export function HomeTutorCard({
  tutor,
  bookmarked,
  onBookmark,
}: HomeTutorCardProps) {
  const highlight = tutorHighlights[tutor.name]
  return (
    <article className="home-tutor-card">
      <div className="home-tutor-portrait">
        <Link
          to={`/tutors/${encodeURIComponent(tutor.name)}`}
          aria-label={`${tutor.name} 튜터 자세히 보기`}
        >
          <img
            src={`/tutor-${tutor.image}.png`}
            alt={`${tutor.name} 튜터 캐릭터`}
          />
        </Link>
        <button
          className={`bookmark ${bookmarked ? 'saved' : ''}`}
          aria-label={`${tutor.name} 찜하기`}
          aria-pressed={bookmarked}
          onClick={onBookmark}
        >
          <Icon name="bookmark" />
        </button>
      </div>
      <div className="home-tutor-info">
        <div className="card-title">
          <Link
            to={`/tutors/${encodeURIComponent(tutor.name)}`}
            className="font-bold"
          >
            {tutor.name}
          </Link>
          <span>
            <b>★</b> {tutor.rating} <em>({tutor.reviews})</em>
          </span>
        </div>
        <p className="major">{tutor.major}</p>
        <p className="university">{tutor.university}</p>
        <p className="home-highlight">{highlight.description}</p>
        <div className="flex flex-wrap gap-2">
          {highlight.tags.map((tag) => (
            <span className="category" key={tag}>
              {tag}
            </span>
          ))}
        </div>
        <p className="home-availability">
          가장 빠른 수업 <strong>{highlight.availability}</strong>
        </p>
      </div>
    </article>
  )
}
