import * as figmaAssets from '../../../components/ui/iconAssets'
import {
  accentOptions,
  dayOptions,
  experienceOptions,
  genderOptions,
  interestOptions,
  majorOptions,
  strengthOptions,
  timeOptions,
} from '../data/tutorFilterOptions'
import type {
  TutorFilterKey,
  TutorFilterValues,
} from '../hooks/useTutorFilters'
import './TutorFilterPanel.css'

interface TutorFilterPanelProps {
  savedOnly: boolean
  filters: TutorFilterValues
  onSavedOnlyChange: (checked: boolean) => void
  onToggleFilter: (key: TutorFilterKey, value: string) => void
}

interface FilterOption {
  value: string
  label: string
}

interface CheckboxGroupProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
}

function CheckboxGroup({
  title,
  options,
  selected,
  onToggle,
}: CheckboxGroupProps) {
  return (
    <details className="tutor-filter-section">
      <summary>{title}</summary>

      <div className="tutor-filter-options">
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </details>
  )
}

function toOptions(values: string[]): FilterOption[] {
  return values.map((value) => ({ value, label: value }))
}

const typeOptions = [
  {
    value: 'taught',
    label: '수업한 튜터',
    icon: figmaAssets.tutorFilterTaught,
    className: '',
  },
  {
    value: 'recommended',
    label: '링글 추천 튜터',
    icon: figmaAssets.tutorFilterRecommended,
    className: 'tutor-filter-recommended',
  },
  {
    value: 'pointback',
    label: '50% 포인트백',
    icon: figmaAssets.tutorFilterPointback,
    className: 'tutor-filter-pointback',
  },
]

const groups: {
  key: TutorFilterKey
  title: string
  options: FilterOption[]
}[] = [
  {
    key: 'strengths',
    title: '수업 강점',
    options: toOptions(strengthOptions),
  },
  {
    key: 'experiences',
    title: '경험',
    options: toOptions(experienceOptions),
  },
  {
    key: 'majors',
    title: '전공',
    options: toOptions(majorOptions),
  },
  {
    key: 'interests',
    title: '관심사',
    options: toOptions(interestOptions),
  },
  {
    key: 'genders',
    title: '성별',
    options: genderOptions,
  },
  {
    key: 'accents',
    title: '발음',
    options: accentOptions,
  },
]

export function TutorFilterPanel({
  savedOnly,
  filters,
  onSavedOnlyChange,
  onToggleFilter,
}: TutorFilterPanelProps) {
  return (
    <aside
      className="favorite-filter-panel tutor-filter-panel"
      aria-label="튜터 필터"
    >
      <div className="tutor-filter-types">
        <label className="tutor-filter-type">
          <input
            type="checkbox"
            checked={savedOnly}
            onChange={(event) => onSavedOnlyChange(event.target.checked)}
          />

          <span className="tutor-filter-type-content">
            <span className="filter-icon-slot" aria-hidden="true">
              <img
                src={figmaAssets.tutorFilterBookmark}
                alt=""
                width="28"
                height="28"
              />
            </span>
            <span>찜한 튜터</span>
          </span>
        </label>

        {typeOptions.map((option) => (
          <label
            key={option.value}
            className={`tutor-filter-type ${option.className}`}
          >
            <input
              type="checkbox"
              checked={filters.types.includes(option.value)}
              onChange={() => onToggleFilter('types', option.value)}
            />

            <span className="tutor-filter-type-content">
              <span className="filter-icon-slot" aria-hidden="true">
                <img src={option.icon} alt="" width="28" height="28" />
              </span>
              <span>{option.label}</span>
            </span>
          </label>
        ))}
      </div>

      <details className="tutor-filter-section">
        <summary>시간대</summary>

        <div className="tutor-filter-availability">
          <p className="tutor-filter-caption">요일</p>

          <div className="tutor-filter-days">
            {dayOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filters.days.includes(option.value)}
                onClick={() => onToggleFilter('days', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="tutor-filter-caption">시간대</p>

          <div className="tutor-filter-times">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filters.times.includes(option.value)}
                onClick={() => onToggleFilter('times', option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </details>

      {groups.map((group) => (
        <CheckboxGroup
          key={group.key}
          title={group.title}
          options={group.options}
          selected={filters[group.key]}
          onToggle={(value) => onToggleFilter(group.key, value)}
        />
      ))}
    </aside>
  )
}
