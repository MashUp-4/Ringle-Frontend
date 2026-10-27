import * as figmaAssets from '../../../components/ui/iconAssets'
import type { Tutor } from '../types/tutor'
import { TutorImage } from './TutorImage'
import { TutorGlass } from './TutorGlass'
interface TutorCardProps {
  tutor: Tutor
  bookmarked: boolean
  bookmarkDisabled?: boolean
  onBookmark: () => void
  onDetails: () => void
}
export function TutorCard({
  tutor,
  bookmarked,
  bookmarkDisabled,
  onBookmark,
  onDetails,
}: TutorCardProps) {
  return (
    <article className="tutor-card">
      <div className="portrait">
        <TutorGlass>
          <button
            className="tutor-photo-details"
            onClick={onDetails}
            aria-label={`${tutor.name} 튜터 자세히 보기`}
          >
            <TutorImage tutor={tutor} alt={`${tutor.name} 튜터 사진`} />
          </button>
          <button
            className={`bookmark ${bookmarked ? 'saved' : ''}`}
            aria-label={`${tutor.name} 북마크`}
            aria-pressed={bookmarked}
            disabled={bookmarkDisabled}
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
        </TutorGlass>
        <div className="tutor-photo-overlay">
          {tutor.acceptanceRate !== undefined && (
            <span className="tutor-acceptance">
              수락률 {tutor.acceptanceRate}%
            </span>
          )}

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
