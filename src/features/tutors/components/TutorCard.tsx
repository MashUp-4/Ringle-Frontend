import * as figmaAssets from '../../../components/ui/iconAssets'
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
        <button
          className="tutor-photo-details"
          onClick={onDetails}
          aria-label={`${tutor.name} 튜터 자세히 보기`}
        >
          <img
            src={`/tutor-${tutor.image}.png`}
            alt={`${tutor.name} 튜터 캐릭터`}
          />
        </button>
        <button
          className={`bookmark ${bookmarked ? 'saved' : ''}`}
          aria-label={`${tutor.name} 북마크`}
          aria-pressed={bookmarked}
          onClick={onBookmark}
        >
          <img
            src={
              bookmarked
                ? figmaAssets.bookmarkSelected
                : figmaAssets.bookmarkDefault
            }
            alt=""
            width="64"
            height="64"
          />
        </button>
        <div className="tutor-photo-overlay">
          <span className="tutor-acceptance">
            수락률 {tutor.acceptanceRate}%
          </span>
          <div className="tutor-subjects">
            {tutor.subjects.map((subject) => (
              <span key={subject}>{subject}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="card-title">
        <button onClick={onDetails}>{tutor.name}</button>
        <span>
          <span className="rating-star" aria-hidden="true">
            <img
              src={figmaAssets.ratingStar}
              alt=""
              width={13.1411}
              height={12.5474}
            />
          </span>
          {tutor.rating} <em>({tutor.reviews})</em>
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
