import { Icon } from '../../../components/ui/Icon'
const days = ['일', '월', '화', '수', '목', '금', '토']
const times = ['새벽 0:00 ~ 3:00', '오전 5:00 ~ 7:00', '오전 7:00 ~ 9:00']

function TutorTypeFilter({
  savedOnly,
  onSavedOnlyChange,
}: {
  savedOnly: boolean
  onSavedOnlyChange: (checked: boolean) => void
}) {
  return (
    <div className="favorite-filter-types">
      <label>
        <input
          type="checkbox"
          checked={savedOnly}
          onChange={(event) => onSavedOnlyChange(event.target.checked)}
        />
        <Icon name="bookmark" />
        찜한 튜터
      </label>

      {['수업한 튜터', '링글 추천 튜터', '50% 포인트백'].map((label) => (
        <label key={label}>
          <input type="checkbox" disabled />
          {label}
        </label>
      ))}
    </div>
  )
}

function AvailabilityFilter() {
  return (
    <fieldset className="favorite-availability" disabled>
      <legend>시간대</legend>
      <p>요일</p>
      <div className="favorite-days">
        {days.map((day) => (
          <button type="button" key={day}>
            {day}
          </button>
        ))}
      </div>

      <p>시간대</p>
      <div className="favorite-times">
        {times.map((time) => (
          <button type="button" key={time}>
            {time}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function TutorFilterPanel({
  savedOnly,
  onSavedOnlyChange,
}: {
  savedOnly: boolean
  onSavedOnlyChange: (checked: boolean) => void
}) {
  return (
    <aside className="favorite-filter-panel" aria-label="튜터 필터">
      <TutorTypeFilter
        savedOnly={savedOnly}
        onSavedOnlyChange={onSavedOnlyChange}
      />
      <AvailabilityFilter />
    </aside>
  )
}
