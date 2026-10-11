import {
  bookmarkDefault,
  bookmarkSelected,
  ratingStar,
} from '../../../components/ui/iconAssets'
import type { Tutor } from '../../tutors/types/tutor'
import homeTutorDivider from '../../../assets/icons/home-tutor-divider.svg'
import type { HomeTutorRecommendation } from '../types/home'
interface HomeTutorCardProps {
  tutor: Tutor
  recommendation?: HomeTutorRecommendation
  bookmarked: boolean
  onBookmark: () => void
  onDetails: () => void
}

export function HomeTutorCard({
  tutor,
  recommendation,
  bookmarked,
  onBookmark,
  onDetails,
}: HomeTutorCardProps) {
  return (
    <article className="home-tutor-card" data-state={recommendation?.state}>
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
            {recommendation?.rating ?? tutor.rating} <em>({tutor.reviews})</em>
          </span>
        </div>
        <p className="major">{tutor.major}</p>
        <p className="university">{tutor.university}</p>
        {recommendation ? (
          <>
            <div className="home-tutor-recommendation">
              <p className="home-tutor-reason">{recommendation.reason}</p>

              <div className="home-tutor-recommendation-tags">
                {recommendation.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="home-tutor-earliest">
              <div className="home-tutor-divider">
                <img src={homeTutorDivider} alt="" />
              </div>

              <p className="home-tutor-earliest-label">
                <span>가장 빠른 수업</span>
                <strong>{recommendation.earliestLesson}</strong>
              </p>
            </div>
          </>
        ) : (
          <span className="category">{tutor.category}</span>
        )}
      </div>
    </article>
  )
}
