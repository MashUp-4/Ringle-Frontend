import { Icon } from '../../../components/ui/Icon'
import type { Tutor } from '../types/tutor'
interface TutorCardProps {
  tutor: Tutor
  bookmarked: boolean
  onBookmark: () => void
  onDetails: () => void
}
export function TutorCard({
  tutor,
  bookmarked,
  onBookmark,
  onDetails,
}: TutorCardProps) {
  return (
    <article className="tutor-card">
      <div className="portrait">
        <img
          src={`/tutor-${tutor.image}.png`}
          alt={`${tutor.name} 튜터 캐릭터`}
        />
        <button
          className={`bookmark ${bookmarked ? 'saved' : ''}`}
          aria-label={`${tutor.name} 북마크`}
          aria-pressed={bookmarked}
          onClick={onBookmark}
        >
          <Icon name="bookmark" />
        </button>
        <div className="hover-panel">
          <span className="hover-label">MEET YOUR TUTOR</span>
          <p>{tutor.intro}</p>
          <button onClick={onDetails}>
            튜터 자세히 보기 <Icon name="arrow" />
          </button>
        </div>
      </div>
      <div className="card-title">
        <button onClick={onDetails}>{tutor.name}</button>
        <span>
          <b>★</b> {tutor.rating} <em>({tutor.reviews})</em>
        </span>
      </div>
      <p className="major">{tutor.major}</p>
      <p className="university" title={tutor.university}>
        {tutor.university}
      </p>
      <span className="category">{tutor.category}</span>
    </article>
  )
}
