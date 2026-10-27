import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

// Load the pure TypeScript boundary modules without adding a test framework.
async function loadModule(path) {
  const source = (
    await readFile(new URL(path, import.meta.url), 'utf8')
  ).replace('import.meta.env.VITE_API_BASE_URL', 'undefined')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
    },
  })
  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
  )
}
const { buildTutorQuery } = await loadModule(
  '../src/features/tutors/api/tutorQuery.ts',
)
const { toTutor } = await loadModule(
  '../src/features/tutors/api/tutorAdapter.ts',
)
const empty = () => ({
  types: [],
  days: [],
  times: [],
  strengths: [],
  experiences: [],
  majors: [],
  interests: [],
  genders: [],
  accents: [],
})

test('empty conditions produce no body or empty query parameters', () => {
  assert.equal(buildTutorQuery('   ', false, empty()), '')
})
test('documented compound filters repeat keys and encode search safely', () => {
  const filters = {
    ...empty(),
    days: ['mon', 'tue'],
    times: ['540-720'],
    strengths: ['인터뷰', 'Writing/에세이/이력서'],
    interests: ['여행'],
    genders: ['female'],
  }
  const params = new URLSearchParams(
    buildTutorQuery(' Computer Science %_ ', true, filters),
  )
  assert.deepEqual(params.getAll('weekdays'), ['MON', 'TUE'])
  assert.deepEqual(params.getAll('strengthTags'), ['INTERVIEW', 'WRITING'])
  assert.equal(params.get('search'), 'Computer Science %_')
  assert.equal(params.get('isMyTutor'), 'true')
  assert.equal(params.get('timeSlots'), 'TIME_09_12')
  assert.equal(params.get('personalInterestTags'), 'TRAVEL')
  assert.equal(params.get('genders'), 'FEMALE')
  assert.equal(params.has('page'), false)
})
test('type flags, enum conversions and selection removal match backend contract', () => {
  const filters = {
    ...empty(),
    types: ['taught', 'recommended', 'pointback'],
    experiences: ['IT/개발 직무'],
    majors: ['공학계열'],
    accents: ['영국식'],
  }
  const params = new URLSearchParams(buildTutorQuery('', false, filters))
  assert.equal(params.get('isPreviousTutor'), 'true')
  assert.equal(params.get('isFeatured'), 'true')
  assert.equal(params.get('isPointback'), 'true')
  assert.equal(params.get('experienceTags'), 'IT_DEVELOPMENT')
  assert.equal(params.get('fieldOfStudy'), 'ENGINEERING')
  assert.equal(params.get('accents'), 'BRITISH')
  assert.equal(params.has('isMyTutor'), false)
  assert.equal(buildTutorQuery('', false, empty(), true), 'isFeatured=true')
})
test('unsupported time range and unknown values never reach the API', () => {
  const params = new URLSearchParams(
    buildTutorQuery('', false, {
      ...empty(),
      times: ['900-1020'],
      days: ['invalid'],
    }),
  )
  assert.equal(params.toString(), '')
})
test('server ID, image, bookmark and null fields are mapped without demo identities', () => {
  const tutor = toTutor({
    id: 42,
    name: 'Rina',
    imageUrl: null,
    school: null,
    major: 'Computer Science',
    primaryKeyword: 'IT_DEVELOPMENT',
    averageRating: null,
    reviewCount: 0,
    acceptRate: null,
    interests: ['여행'],
    isMyTutor: true,
  })
  assert.equal(tutor.id, 42)
  assert.equal(tutor.name, 'Rina')
  assert.equal(tutor.rating, '—')
  assert.equal(tutor.acceptanceRate, undefined)
  assert.equal(tutor.imageUrl, null)
  assert.equal(tutor.isMyTutor, true)
  assert.deepEqual(tutor.subjects, ['여행'])
  assert.equal(tutor.category, 'IT / Development')
})

const { apiWrite } = await loadModule('../src/lib/api.ts')
test('bookmark write accepts the documented null data and sends no request body', async () => {
  const originalFetch = globalThis.fetch
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url, ...options })
    return new Response(JSON.stringify({ success: true, data: null }), {
      status: 201,
    })
  }
  try {
    await apiWrite('/users/me/favorite-tutors/42', 'POST')
    await apiWrite('/users/me/favorite-tutors/42', 'DELETE')
    assert.deepEqual(
      calls.map(({ url, method, body }) => ({ url, method, body })),
      [
        {
          url: '/backend/users/me/favorite-tutors/42',
          method: 'POST',
          body: undefined,
        },
        {
          url: '/backend/users/me/favorite-tutors/42',
          method: 'DELETE',
          body: undefined,
        },
      ],
    )
    globalThis.fetch = async () =>
      new Response(
        JSON.stringify({ success: false, message: '저장 실패', data: null }),
      )
    await assert.rejects(
      apiWrite('/users/me/favorite-tutors/42', 'POST'),
      /저장 실패/,
    )
    globalThis.fetch = async () => new Response('{}', { status: 500 })
    await assert.rejects(
      apiWrite('/users/me/favorite-tutors/42', 'POST'),
      /변경 요청에 실패/,
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})
