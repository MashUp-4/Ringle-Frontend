import { useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { AppNavigation } from './AppNavigation'
import { FloatingActions } from './FloatingActions'

interface AppShellProps {
  children: ReactNode
  onNotice: (message: string) => void
}

// Final Figma desktop frames use a 1920 × 1080 viewport.
// Preserve their proportions when the browser's CSS viewport is smaller.
function getShellScale() {
  return Math.min(
    1,
    document.documentElement.clientWidth / 1920,
    window.innerHeight / 1080,
  )
}

function subscribeToViewport(onChange: () => void) {
  window.addEventListener('resize', onChange)
  const observer = new ResizeObserver(onChange)
  observer.observe(document.documentElement)
  return () => {
    window.removeEventListener('resize', onChange)
    observer.disconnect()
  }
}

export function AppShell({ children, onNotice }: AppShellProps) {
  const { pathname } = useLocation()
  const screen =
    pathname === '/'
      ? 'home'
      : pathname === '/tutors/all'
        ? 'favorites'
        : 'tutors'
  const scale = useSyncExternalStore(
    subscribeToViewport,
    getShellScale,
    () => 1,
  )
  const style = { '--shell-scale': scale } as CSSProperties
  return (
    <div className="app-shell" data-screen={screen} style={style}>
      <AppNavigation onNotice={onNotice} />
      <div className="app-content">{children}</div>
      <FloatingActions onNotice={onNotice} />
    </div>
  )
}
