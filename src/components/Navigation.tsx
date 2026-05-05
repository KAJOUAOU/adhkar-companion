import { useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, Sparkles, Heart, Settings } from 'lucide-react'
import type { TabId } from '../types'
import { useSettings } from '../hooks/useSettings'
import { getT } from '../i18n'

interface Tab { id: TabId; icon: React.ReactNode; path: string }

const TAB_DEFS: Tab[] = [
  { id: 'home',     icon: <Home size={22} />,     path: '/' },
  { id: 'session',  icon: <BookOpen size={22} />, path: '/session/morning' },
  { id: 'browse',   icon: <Sparkles size={22} />, path: '/browse' },
  { id: 'need',     icon: <Heart size={22} />,    path: '/need' },
  { id: 'settings', icon: <Settings size={22} />, path: '/settings' },
]

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { settings } = useSettings()
  const t = getT(settings.language).nav

  const activeTab = TAB_DEFS.find(tab =>
    tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path.split('/')[1] ? `/${tab.path.split('/')[1]}` : tab.path)
  )?.id ?? 'home'

  const labels: Record<TabId, string> = {
    home: t.home, session: t.recite, browse: t.browse, need: t.need, settings: t.settings,
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-bottom">
      <div className="max-w-lg mx-auto">
        <div className="bg-white/95 dark:bg-night-900/95 backdrop-blur-lg border-t border-cream-200 dark:border-white/10 shadow-dark-soft">
          <div className="flex items-stretch">
            {TAB_DEFS.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 py-3 px-1 transition-all duration-200
                    ${isActive ? 'dark:text-forest-200' : 'text-gray-400 dark:text-gray-600'}`}
                  style={isActive ? { color: 'var(--t-primary,#8B6914)' } : undefined}
                >
                  <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                    {tab.icon}
                  </div>
                  <span className={`text-[10px] font-semibold transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                    {labels[tab.id]}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 w-6 h-0.5 rounded-full" style={{ background: 'var(--t-primary,#8B6914)' }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
