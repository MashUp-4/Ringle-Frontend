import { Link, NavLink, useLocation } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import { ringleLogo, chatSidebar } from '../ui/iconAssets'
import './AppShell.css'

interface AppNavigationProps {
  onNotice: (message: string) => void
}

const items = [
  { icon: 'home', label: '홈', to: '/' },
  { icon: 'lesson', label: '수업', to: '/tutors' },
  { icon: 'calendar', label: '이벤트' },
  { icon: 'user', label: '마이링글' },
  { icon: 'chat', label: 'AI 스피킹' },
  { icon: 'chart', label: '성취' },
]

export function AppNavigation({ onNotice }: AppNavigationProps) {
  const isHome = useLocation().pathname === '/'
  return (
    <>
      <aside className="sidebar">
        <Link className="logo" to="/" aria-label="Ringle 홈">
          <img src={ringleLogo} alt="" width={69} height={22} />
        </Link>
        <div className="sidebar-menu">
          <nav aria-label="주 메뉴">
            {items.map((item) =>
              item.to ? (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `nav-item${isActive ? ' active' : ''}`
                  }
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                </NavLink>
              ) : (
                <button
                  type="button"
                  key={item.label}
                  className="nav-item"
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
              type="button"
              className="nav-item"
              onClick={() =>
                onNotice(
                  '도움이 필요하면 help@ringleplus.com으로 문의해 주세요.',
                )
              }
            >
              <Icon name="help" />
              <span>FAQ</span>
            </button>
            <button
              type="button"
              className="nav-item"
              onClick={() =>
                onNotice(
                  '수업 전 교재를 확인하고, 수업 후 피드백을 복습해 보세요.',
                )
              }
            >
              <Icon name="guide" />
              <span>링글 가이드</span>
            </button>
          </div>
        </div>
        <div className="sidebar-support">
          <button
            type="button"
            className="support"
            onClick={() => onNotice('문의: help@ringleplus.com')}
            aria-label="고객 지원"
          >
            <img src={chatSidebar} alt="" width={56} height={56} />
          </button>
        </div>
      </aside>
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="mobile-logo" to="/" aria-label="Ringle 홈">
            <img src={ringleLogo} alt="" width={69} height={22} />
          </Link>
          <nav className="topbar-menu" aria-label="서비스 메뉴">
            <button
              type="button"
              onClick={() =>
                onNotice(
                  isHome
                    ? '실리콘밸리 챌린지를 홈에서 확인해 보세요.'
                    : '9회말 역전 이벤트 안내는 준비 중이에요.',
                )
              }
            >
              {isHome ? '실리콘밸리' : '9회말 역전 이벤트'}
            </button>
            <button
              type="button"
              onClick={() => onNotice('홈에서 수업권 안내를 확인해 보세요.')}
            >
              구매
            </button>
            <button
              type="button"
              onClick={() => onNotice('기업 제휴 문의: help@ringleplus.com')}
            >
              기업 제휴
            </button>
          </nav>
          <i aria-hidden="true" />
          <button
            type="button"
            className="avatar"
            aria-label="내 프로필"
            onClick={() => onNotice('홈에서 프로필을 설정할 수 있어요.')}
          />
        </div>
      </header>
    </>
  )
}
