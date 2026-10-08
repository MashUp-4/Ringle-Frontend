import type { ReactNode } from 'react'
import { AppNavigation } from './AppNavigation'
import { FloatingActions } from './FloatingActions'

interface AppShellProps {
  children: ReactNode
  onNotice: (message: string) => void
}

export function AppShell({ children, onNotice }: AppShellProps) {
  return (
    <>
      <AppNavigation onNotice={onNotice} />
      <div className="app-content">{children}</div>
      <FloatingActions onNotice={onNotice} />
    </>
  )
}
