import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, ChevronRight } from 'lucide-react'
import { ALL_INVOCATIONS, getInvocationsByCategory } from '../data/invocations'
import { useSettings } from '../hooks/useSettings'
import IslamicPattern from '../components/IslamicPattern'
import SeoHead from '../components/SeoHead'
import ScrollButtons from '../components/ScrollButtons'
import type { InvocationCategory, InvocationItem } from '../types'

const TABS: { id: InvocationCategory; labelFr: string; labelEn: string; emoji: string }[] = [
  { id: 'coran',     labelFr: 'Coran',       labelEn: 'Quran',     emoji: '📖' },
  { id: 'khatma',    labelFr: 'Khatma',      labelEn: 'Khatma',    emoji: '🕯️' },
  { id: 'prophetic', labelFr: 'Prophétique', labelEn: 'Prophetic', emoji: '🌿' },
]

export default function Invocations() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const lang = settings.language
  const [activeTab, setActiveTab] = useState<InvocationCategory>('prophetic')
  const [query, setQuery] = useState('')

  const items = useMemo(() => {
    const base = getInvocationsByCategory(activeTab)
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter(inv =>
      inv.title.toLowerCase().includes(q) ||
      inv.titleAr.includes(q) ||
      inv.translationFr.toLowerCase().includes(q) ||
      inv.arabic.includes(q),
    )
  }, [activeTab, query])

  const counts = useMemo(() => ({
    coran:     getInvocationsByCategory('coran').length,
    khatma:    getInvocationsByCategory('khatma').length,
    prophetic: getInvocationsByCategory('prophetic').length,
  }), [])

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-10">
      <SeoHead
        title="Invocations issues du Coran et de la Sounnah | Adhkar Companion"
        description="Recueil d'invocations authentiques : duʿās du Coran, invocations de la khatma, et invocations prophétiques (Bukhari, Muslim, Tirmidhi). Texte arabe vocalisé, translittération et traduction française."
        canonical="/invocations"
        keywords="invocations islamiques, duaa coran, duaa sunnah, sayyid al istighfar, invocation pardon, invocation anxiete, hadith authentique"
      />

      {/* Header */}
      <div className="relative overflow-hidden bg-white dark:bg-night-900 border-b border-cream-200 dark:border-white/10 px-5 pt-safe pt-12 pb-5 flex items-center gap-3">
        <IslamicPattern className="text-forest-800 dark:text-forest-400" opacity={0.06} />
        <button
          onClick={() => navigate(-1)}
          className="relative z-10 p-2 -ml-1 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-cream-100 dark:hover:bg-night-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="relative z-10">
          <h1 className="text-lg font-display font-bold text-gray-900 dark:text-cream-100 leading-tight">
            {lang === 'en' ? 'Invocations' : 'Invocations'}
          </h1>
          <p className="text-xs text-gray-400">
            {lang === 'en' ? 'From the Quran and the Sunnah' : 'Issues du Coran et de la Sounnah'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            const label = lang === 'en' ? tab.labelEn : tab.labelFr
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setQuery('') }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all
                  ${isActive
                    ? 'bg-forest-800 text-white shadow-medium'
                    : 'bg-white dark:bg-night-800 text-gray-500 dark:text-gray-400 border border-cream-200 dark:border-white/10'
                  }`}
              >
                <span>{tab.emoji}</span>
                <span>{label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full
                  ${isActive ? 'bg-white/20 text-white' : 'bg-cream-200 dark:bg-night-700 text-gray-500'}
                `}>
                  {counts[tab.id]}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search an invocation…' : 'Rechercher une invocation…'}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-night-800 border border-cream-200 dark:border-white/10 text-sm text-gray-900 dark:text-cream-100 placeholder-gray-400 focus:outline-none focus:border-forest-600"
          />
        </div>
      </div>

      {/* List */}
      <div className="px-4 pt-5">
        {items.length === 0 ? (
          <EmptyState category={activeTab} hasQuery={!!query.trim()} lang={lang} />
        ) : (
          <>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-4 px-1">
              {items.length} {items.length > 1 ? 'invocations' : 'invocation'}
            </p>
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(`/invocation/${item.id}`)}
                    className="w-full text-left bg-white dark:bg-night-800 hover:bg-cream-50 dark:hover:bg-night-700 rounded-2xl p-4 border border-cream-200 dark:border-white/10 shadow-soft transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-forest-800 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                          {item.number}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-gray-900 dark:text-cream-100 leading-tight mb-1">
                            {item.title}
                          </p>
                          <p className="font-arabic text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                            {item.titleAr}
                          </p>
                          <p className="text-[10px] font-bold text-gold-700 dark:text-gold-400 uppercase tracking-wide">
                            {item.source}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-300 flex-shrink-0 mt-1" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <ScrollButtons />
    </div>
  )
}

function EmptyState({ category, hasQuery, lang }: {
  category: InvocationCategory
  hasQuery: boolean
  lang: 'fr' | 'en'
}) {
  if (hasQuery) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-3xl mb-2">🔍</p>
        <p className="text-sm">{lang === 'en' ? 'No match found' : 'Aucun résultat'}</p>
      </div>
    )
  }
  const messages: Record<InvocationCategory, { fr: string; en: string }> = {
    coran:     { fr: 'Les invocations coraniques arrivent bientôt.',  en: 'Quranic invocations coming soon.' },
    khatma:    { fr: 'Les invocations de la khatma arrivent bientôt.', en: 'Khatma invocations coming soon.' },
    prophetic: { fr: 'Aucune invocation pour le moment.',              en: 'No invocations yet.' },
  }
  return (
    <div className="text-center py-12 px-6 text-gray-400">
      <p className="text-4xl mb-3">🌿</p>
      <p className="text-sm leading-relaxed">{messages[category][lang]}</p>
    </div>
  )
}

export type { InvocationItem }
