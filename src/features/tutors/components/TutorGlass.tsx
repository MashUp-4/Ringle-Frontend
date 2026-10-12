import type { ReactNode } from 'react'

export function TutorGlass({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="tutor-glass-source">{children}</div>
      <div className="tutor-glass-surface" aria-hidden="true" />
    </>
  )
}
