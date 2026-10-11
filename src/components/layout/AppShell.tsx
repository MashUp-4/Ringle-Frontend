import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { AppNavigation } from './AppNavigation'
import { FloatingActions } from './FloatingActions'

interface AppShellProps {
  children: ReactNode
  onNotice: (message: string) => void
}

export function AppShell({ children, onNotice }: AppShellProps) {
  const { pathname } = useLocation()
  const screen =
    pathname === '/'
      ? 'home'
      : pathname === '/tutors/all'
        ? 'favorites'
        : 'tutors'
  return (
    <div className="app-shell" data-screen={screen}>
      <AppNavigation onNotice={onNotice} />
      <div className="app-content">{children}</div>
      <FloatingActions onNotice={onNotice} />
    </div>
  )
}
