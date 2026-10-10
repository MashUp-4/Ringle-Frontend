import { useSearchParams } from 'react-router-dom'
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
import type { Tutor } from '../types/tutor'

interface FilterOption {
  value: string
  label: string
}

export type TutorFilterKey =
  | 'types'
  | 'days'
  | 'times'
  | 'strengths'
  | 'experiences'
  | 'majors'
  | 'interests'
  | 'genders'
  | 'accents'

export type TutorFilterValues = Record<TutorFilterKey, string[]>

function toOptions(values: string[]): FilterOption[] {
  return values.map((value) => ({ value, label: value }))
}

const filterOptions: Record<TutorFilterKey, FilterOption[]> = {
  types: [
    { value: 'taught', label: '수업한 튜터' },
    { value: 'recommended', label: '링글 추천 튜터' },
    { value: 'pointback', label: '50% 포인트백' },
  ],
  days: dayOptions,
  times: timeOptions,
  strengths: toOptions(strengthOptions),
  experiences: toOptions(experienceOptions),
  majors: toOptions(majorOptions),
  interests: toOptions(interestOptions),
  genders: genderOptions,
  accents: accentOptions,
}

const filterKeys = Object.keys(filterOptions) as TutorFilterKey[]

function readValues(params: URLSearchParams, key: TutorFilterKey): string[] {
  const allowed = new Set(filterOptions[key].map((option) => option.value))

  return [...new Set(params.getAll(key))].filter((value) => allowed.has(value))
}

function matchesAny(selected: string[], actual: string[]): boolean {
  return (
    selected.length === 0 || selected.some((value) => actual.includes(value))
  )
}

export function useTutorFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const savedOnly = searchParams.get('saved') === '1'

  const filters: TutorFilterValues = {
    types: readValues(searchParams, 'types'),
    days: readValues(searchParams, 'days'),
    times: readValues(searchParams, 'times'),
    strengths: readValues(searchParams, 'strengths'),
    experiences: readValues(searchParams, 'experiences'),
    majors: readValues(searchParams, 'majors'),
    interests: readValues(searchParams, 'interests'),
    genders: readValues(searchParams, 'genders'),
    accents: readValues(searchParams, 'accents'),
  }

  function setQuery(value: string) {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)

        if (value) next.set('q', value)
        else next.delete('q')

        return next
      },
      { replace: true },
    )
  }

  function setSavedOnly(checked: boolean) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)

      if (checked) next.set('saved', '1')
      else next.delete('saved')

      return next
    })
  }

  function toggleFilterValue(key: TutorFilterKey, value: string) {
    if (!filterOptions[key].some((option) => option.value === value)) return

    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      const current = readValues(previous, key)
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]

      next.delete(key)

      updated.forEach((item) => next.append(key, item))

      return next
    })
  }

  function removeFilterValue(key: TutorFilterKey, value: string) {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      const updated = readValues(previous, key).filter((item) => item !== value)

      next.delete(key)

      updated.forEach((item) => next.append(key, item))

      return next
    })
  }

  function resetFilters() {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)

      next.delete('saved')
      filterKeys.forEach((key) => next.delete(key))

      return next
    })
  }

  function getVisibleTutors(tutors: Tutor[], saved: string[]): Tutor[] {
    const normalizedQuery = query.trim().toLowerCase()

    const selectedTimes = timeOptions.filter((option) =>
      filters.times.includes(option.value),
    )

    return tutors.filter((tutor) => {
      if (savedOnly && !saved.includes(tutor.name)) return false

      const searchableText =
        `${tutor.name} ${tutor.major} ${tutor.university}`.toLowerCase()

      if (!searchableText.includes(normalizedQuery)) return false

      if (filters.types.includes('taught') && !tutor.hasTaught) return false
      if (filters.types.includes('recommended') && !tutor.isRecommended) {
        return false
      }
      if (filters.types.includes('pointback') && !tutor.hasPointBack) {
        return false
      }

      if (!matchesAny(filters.strengths, tutor.strengths)) return false
      if (!matchesAny(filters.experiences, tutor.experiences)) return false
      if (!matchesAny(filters.majors, [tutor.majorCategory])) return false
      if (!matchesAny(filters.interests, tutor.interests)) return false
      if (!matchesAny(filters.genders, [tutor.gender])) return false
      if (!matchesAny(filters.accents, [tutor.accent])) return false

      const hasAvailabilityFilter =
        filters.days.length > 0 || selectedTimes.length > 0

      if (
        hasAvailabilityFilter &&
        !tutor.availability.some((availability) => {
          const matchesDay =
            filters.days.length === 0 || filters.days.includes(availability.day)

          const matchesTime =
            selectedTimes.length === 0 ||
            selectedTimes.some(
              (time) =>
                availability.startMinute < time.endMinute &&
                availability.endMinute > time.startMinute,
            )

          return matchesDay && matchesTime
        })
      ) {
        return false
      }

      return true
    })
  }

  const chips = filterKeys.flatMap((key) =>
    filters[key].map((value) => ({
      id: `${key}:${value}`,
      key,
      value,
      label:
        filterOptions[key].find((option) => option.value === value)?.label ??
        value,
    })),
  )

  const hasActiveFilters = savedOnly || chips.length > 0

  return {
    query,
    savedOnly,
    filters,
    chips,
    hasActiveFilters,
    setQuery,
    setSavedOnly,
    toggleFilterValue,
    removeFilterValue,
    resetFilters,
    getVisibleTutors,
  }
}
