import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

async function moduleUrl(path, replacements = []) {
  let source = await readFile(new URL(path, import.meta.url), 'utf8')
  for (const [from, to] of replacements) source = source.replace(from, to)
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  })
  return `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
}

const {
  toHomeRecommendations,
  toScheduledLessons,
  homeCategories,
  formatHomeTime,
} = await import(await moduleUrl('../src/features/home/api/homeAdapter.ts'))

const tutor = (id) => ({
  tutorId: id,
  name: `Tutor ${id}`,
  imageUrl: `https://example.com/${id}.jpg`,
  major: 'Engineering',
  university: 'University',
  averageRating: 4.75,
  reviewCount: 12,
  introduction: 'Interview practice',
  tags: ['인터뷰'],
  isMyTutor: id === 7,
  earliestAvailableAt: '2026-10-29T00:30:00Z',
})

test('home shows exactly the first two server recommendations and preserves bookmark identities', () => {
  const result = toHomeRecommendations([tutor(7), tutor(9), tutor(15)])
  assert.deepEqual(
    result.map(({ tutor }) => tutor.id),
    [7, 9],
  )
  assert.equal(result[0].tutor.isMyTutor, true)
  assert.equal(result[0].tutor.imageUrl, 'https://example.com/7.jpg')
  assert.equal(result[0].tutor.rating, '4.8')
  assert.equal(result[0].recommendation.reason, 'Interview practice')
  assert.deepEqual(result[0].recommendation.tags, ['인터뷰'])
})

test('missing home metadata stays empty instead of using demo recommendation content', () => {
  const [{ tutor: result, recommendation }] = toHomeRecommendations([
    {
      ...tutor(7),
      averageRating: null,
      introduction: null,
      tags: null,
      earliestAvailableAt: null,
      imageUrl: null,
    },
  ])
  assert.equal(result.rating, '—')
  assert.equal(result.imageUrl, null)
  assert.equal(recommendation.reason, '')
  assert.deepEqual(recommendation.tags, [])
  assert.equal(recommendation.earliestLesson, '')
  assert.equal(formatHomeTime('invalid-date'), '')
})

test('upcoming classes use server tutor IDs and dates in Asia/Seoul', () => {
  const [lesson] = toScheduledLessons([
    {
      classId: 22,
      startsAt: '2026-10-29T00:30:00Z',
      durationMinutes: 40,
      classType: '인터뷰',
      tags: ['예정'],
      tutor: tutor(9),
    },
  ])
  assert.equal(lesson.id, '22')
  assert.equal(lesson.tutor.id, 9)
  assert.equal(lesson.durationMinutes, 40)
  assert.match(lesson.dateLabel, /09:30/)
  assert.match(lesson.dateLabel, /29/)
})

test('offsetless backend timestamps are KST regardless of the browser timezone', () => {
  assert.equal(
    formatHomeTime('2026-10-29T09:30:00'),
    formatHomeTime('2026-10-29T00:30:00Z'),
  )
  assert.equal(
    formatHomeTime('2026-10-29T09:30:00+09:00'),
    formatHomeTime('2026-10-29T00:30:00Z'),
  )
})

const apiUrl = await moduleUrl('../src/lib/api.ts', [
  ['import.meta.env.VITE_API_BASE_URL', 'undefined'],
])
const { invalidateApiCache } = await import(apiUrl)
const { getUserHome } = await import(
  await moduleUrl('../src/features/home/api/home.ts', [
    ["'../../../lib/api'", JSON.stringify(apiUrl)],
  ])
)

test('home default request lets the server choose signup category; each tab uses its category enum', async () => {
  const originalFetch = globalThis.fetch
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    return new Response(
      JSON.stringify({
        success: true,
        data: { type: 'RECOMMENDED_TUTORS', recommendedTutors: { tutors: [] } },
      }),
    )
  }
  try {
    await getUserHome()
    for (const category of Object.values(homeCategories))
      await getUserHome(category)
    assert.equal(calls[0].url, '/backend/users/me/home')
    assert.deepEqual(
      calls
        .slice(1)
        .map(({ url }) =>
          new URL(url, 'https://example.com').searchParams.get('category'),
        ),
      [
        'CAREER_INTERVIEW',
        'BUSINESS_ENGLISH',
        'DAILY_DISCUSSION',
        'STUDY_ABROAD_EXAM',
      ],
    )
    assert.ok(calls.every(({ options }) => options.body === undefined))
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('home rejects unknown types and missing branch arrays instead of displaying a false empty state', async () => {
  const originalFetch = globalThis.fetch
  try {
    for (const data of [
      {},
      { type: 'OTHER' },
      { type: 'UPCOMING_CLASS' },
      { type: 'UPCOMING_CLASS', upcomingClasses: { classes: null } },
      { type: 'RECOMMENDED_TUTORS' },
      { type: 'RECOMMENDED_TUTORS', recommendedTutors: { tutors: {} } },
    ]) {
      invalidateApiCache()
      globalThis.fetch = async () =>
        new Response(JSON.stringify({ success: true, data }))
      await assert.rejects(getUserHome(), /홈 응답 데이터/)
    }
  } finally {
    globalThis.fetch = originalFetch
  }
})
