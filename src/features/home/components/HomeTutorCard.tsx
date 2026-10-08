import {
  bookmarkDefault,
  bookmarkSelected,
  ratingStar,
} from '../../../components/ui/iconAssets'
import type { Tutor } from '../../tutors/types/tutor'
interface HomeTutorCardProps {
  tutor: Tutor
  bookmarked: boolean
  onBookmark: () => void
  onDetails: () => void
}
export function HomeTutorCard({
  tutor,
  bookmarked,
  onBookmark,
  onDetails,
}: HomeTutorCardProps) {
  return (
    <article className="home-tutor-card">
      <div className="home-tutor-portrait">
        <button
          className="home-tutor-photo-details"
          onClick={onDetails}
          aria-label={`${tutor.name} 튜터 자세히 보기`}
        >
          <img
            src={`/tutor-${tutor.image}.png`}
            alt={`${tutor.name} 튜터 캐릭터`}
          />
        </button>
        {tutor.acceptanceRate !== undefined && (
          <span className="home-tutor-acceptance">
            수락률 {tutor.acceptanceRate}%
          </span>
        )}
        <div className="home-tutor-topics">
          {tutor.subjects.map((subject) => (
            <span key={subject}>{subject}</span>
          ))}
        </div>
        <button
          className={`bookmark ${bookmarked ? 'saved' : ''}`}
          aria-label={`${tutor.name} 찜하기`}
          aria-pressed={bookmarked}
          onClick={onBookmark}
        >
          <img
            src={bookmarked ? bookmarkSelected : bookmarkDefault}
            alt=""
            width={64}
            height={64}
          />
        </button>
      </div>
      <div className="home-tutor-info">
        <div className="card-title">
          <button onClick={onDetails} className="font-bold">
            {tutor.name}
          </button>
          <span>
            <span className="rating-star" aria-hidden="true">
              <img src={ratingStar} alt="" width={13.1411} height={12.5474} />
            </span>
            {tutor.rating} <em>({tutor.reviews})</em>
          </span>
        </div>
        <p className="major">{tutor.major}</p>
        <p className="university">{tutor.university}</p>
        <span className="category">{tutor.category}</span>
      </div>
    </article>
  )
}
