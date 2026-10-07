import { useState } from 'react'
import type { HomeProfile } from '../types/home'
interface ProfileEditorProps {
  profile: HomeProfile
  onSave: (profile: HomeProfile) => void
}
export function ProfileEditor({ profile, onSave }: ProfileEditorProps) {
  const [name, setName] = useState(profile.name)
  const [timezone, setTimezone] = useState(profile.timezone)
  const [error, setError] = useState('')
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (!name.trim()) {
          setError('이름을 입력해 주세요.')
          return
        }
        onSave({ name: name.trim(), timezone })
      }}
    >
      <h2 id="home-dialog-title">프로필 설정</h2>
      <label className="home-form-label" htmlFor="profile-name">
        이름
      </label>
      <input
        id="profile-name"
        className="home-form-input"
        value={name}
        maxLength={20}
        aria-invalid={!!error}
        aria-describedby={error ? 'profile-error' : undefined}
        onChange={(event) => {
          setName(event.target.value)
          setError('')
        }}
      />
      {error && (
        <p id="profile-error" role="alert" className="mt-2 text-red-700">
          {error}
        </p>
      )}
      <label className="home-form-label" htmlFor="profile-timezone">
        시간대
      </label>
      <select
        id="profile-timezone"
        className="home-form-input"
        value={timezone}
        onChange={(event) => setTimezone(event.target.value)}
      >
        {['Asia/Seoul', 'America/New_York', 'Europe/London'].map((zone) => (
          <option key={zone}>{zone}</option>
        ))}
      </select>
      <button className="primary" type="submit">
        저장하기
      </button>
    </form>
  )
}
