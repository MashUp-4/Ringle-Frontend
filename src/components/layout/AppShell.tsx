import { useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { AppNavigation } from './AppNavigation'
import { FloatingActions } from './FloatingActions'

interface AppShellProps {
  children: ReactNode
  onNotice: (message: string) => void
}

function getTutorFrameScale() {
  return Math.min(
    1,
    document.documentElement.clientWidth / 1920,
    window.innerHeight / 1080,
  )
}

function subscribeToViewport(onChange: () => void) {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

function TutorFrame({ children }: { children: ReactNode }) {
  const scale = useSyncExternalStore(
    subscribeToViewport,
    getTutorFrameScale,
    () => 1,
  )
  const style = { '--tutor-frame-scale': scale } as CSSProperties

  return (
    <div className="tutor-frame-viewport" style={style}>
      {children}
    </div>
  )
}

export function AppShell({ children, onNotice }: AppShellProps) {
  const { pathname } = useLocation()
  const screen =
    pathname === '/'
      ? 'home'
      : pathname === '/tutors/all'
        ? 'favorites'
        : 'tutors'
  const shell = (
    <div className="app-shell" data-screen={screen}>
      <AppNavigation onNotice={onNotice} />
      <div className="app-content">{children}</div>
      <FloatingActions onNotice={onNotice} />
    </div>
  )

  return screen === 'tutors' ? <TutorFrame>{shell}</TutorFrame> : shell
}
