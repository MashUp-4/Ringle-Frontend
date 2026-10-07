import { Link, useLocation } from 'react-router-dom'
import { Icon } from '../ui/Icon'
interface AppNavigationProps {
  onNotice: (message: string) => void
}
export function AppNavigation({ onNotice }: AppNavigationProps) {
  const isHome = useLocation().pathname === '/'
  const items = [
    { icon: 'home', label: '홈', to: '/' },
    { icon: 'lesson', label: '수업', to: '/tutors' },
    { icon: 'calendar', label: '이벤트' },
    { icon: 'user', label: '마이링글' },
    { icon: 'chat', label: 'AI 스피킹' },
    { icon: 'chart', label: '성취' },
  ]
  return (
    <>
      <aside className="sidebar">
        <Link className="logo" to="/" aria-label="Ringle 홈">
          Ringle
        </Link>
        <nav aria-label="주 메뉴">
          {items.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className={`nav-item ${isHome ? (item.label === '홈' ? 'active' : '') : item.label === '수업' ? 'active' : ''}`}
                aria-current={
                  (isHome && item.label === '홈') ||
                  (!isHome && item.label === '수업')
                    ? 'page'
                    : undefined
                }
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ) : (
              <button
                key={item.label}
                className="nav-item w-full"
                onClick={() =>
                  onNotice(`${item.label} 서비스는 준비 중이에요.`)
                }
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </button>
            ),
          )}
        </nav>
        <div className="sidebar-bottom">
          <button
            className="nav-item w-full"
            onClick={() =>
              onNotice('도움이 필요하면 help@ringleplus.com으로 문의해 주세요.')
            }
          >
            <Icon name="help" />
            FAQ
          </button>
          <button
            className="nav-item w-full"
            onClick={() =>
              onNotice(
                '수업 전 교재를 확인하고, 수업 후 피드백을 복습해 보세요.',
              )
            }
          >
            <Icon name="lesson" />
            링글 가이드
          </button>
          <button
            className="support"
            onClick={() => onNotice('문의: help@ringleplus.com')}
            aria-label="고객 지원"
          >
            <Icon name="chat" />
          </button>
        </div>
      </aside>
      <header className="topbar">
        <button
          onClick={() => onNotice('실리콘밸리 챌린지를 홈에서 확인해 보세요.')}
        >
          실리콘밸리
        </button>
        <button onClick={() => onNotice('홈에서 수업권 안내를 확인해 보세요.')}>
          구매
        </button>
        <button onClick={() => onNotice('기업 제휴 문의: help@ringleplus.com')}>
          기업 제휴
        </button>
        <i />
        <button
          className="avatar"
          aria-label="내 프로필"
          onClick={() => onNotice('홈에서 프로필을 설정할 수 있어요.')}
        />
      </header>
    </>
  )
}
