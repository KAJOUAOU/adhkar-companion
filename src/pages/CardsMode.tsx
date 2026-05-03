import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import ScrollButtons from '../components/ScrollButtons'
import { ADHKAR_DATA } from '../data/adhkar'
import type { AdhkarItem, Period } from '../types'
import { useSettings } from '../hooks/useSettings'
import { useAudio } from '../hooks/useAudio'
import { loadSession, saveSession } from '../services/storageService'
import { getAdhkarByPeriod } from '../data/adhkar'
import AdhkarCard from '../components/AdhkarCard'

type Filter = 'all' | 'morning' | 'evening' | 'both' | 'favorites'

const FILTER_LABELS: Record<Filter, string> = {
  all:       'Tous',
  morning:   'Matin',
  evening:   'Soir',
  both:      'Commun',
  favorites: '❤️ Favoris',
}

export default function CardsMode() {
  const { settings, toggleFavorite } = useSettings()
  const audio = useAudio()

  const [filter,  setFilter]  = useState<Filter>('all')
  const [search,  setSearch]  = useState('')
  const [session, setSession] = useState(() => ({
    morning: loadSession('morning'),
    evening: loadSession('evening'),
  }))

  const displayed = useMemo(() => {
    let list = ADHKAR_DATA as AdhkarItem[]
    if (filter === 'favorites') list = list.filter(a => settings.favoritesIds.includes(a.id))
    else if (filter !== 'all')  list = list.filter(a => a.period === filter || (filter === 'morning' && a.period === 'both') || (filter === 'evening' && a.period === 'both') || a.period === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.translationFr.toLowerCase().includes(q) ||
        a.arabic.includes(q)
      )
    }
    return list
  }, [filter, search, settings.favoritesIds])

  const getCounter = (id: string): number => {
    return session.morning.counters[id] ?? session.evening.counters[id] ?? 0
  }

  const isDone = (id: string): boolean => {
    return session.morning.completed.includes(id) || session.evening.completed.includes(id)
  }

  const handleTap = (item: AdhkarItem) => {
    const period = item.period === 'evening' ? 'evening' : 'morning'
    const sess   = { ...session[period] }
    const cur    = sess.counters[item.id] ?? 0
    if (cur >= item.repeat) return
    const newCnt = cur + 1
    const done   = newCnt >= item.repeat
    sess.counters = { ...sess.counters, [item.id]: newCnt }
    if (done && !sess.completed.includes(item.id)) sess.completed = [...sess.completed, item.id]
    saveSession(sess)
    setSession(s => ({ ...s, [period]: sess }))
    if (navigator.vibrate) navigator.vibrate(12)
  }

  const handleReset = (item: AdhkarItem) => {
    const period = item.period === 'evening' ? 'evening' : 'morning'
    const sess   = { ...session[period] }
    sess.counters  = { ...sess.counters,  [item.id]: 0 }
    sess.completed = sess.completed.filter(c => c !== item.id)
    saveSession(sess)
    setSession(s => ({ ...s, [period]: sess }))
  }

  const handleMarkDone = (item: AdhkarItem) => {
    const period = item.period === 'evening' ? 'evening' : 'morning'
    const sess   = { ...session[period] }
    if (!sess.completed.includes(item.id)) sess.completed = [...sess.completed, item.id]
    saveSession(sess)
    setSession(s => ({ ...s, [period]: sess }))
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-28">
      {/* Header */}
      <div className="bg-white dark:bg-night-900 border-b border-cream-200 dark:border-white/10 px-5 pt-safe pt-12 pb-4 sticky top-0 z-20">
        <h1 className="text-xl font-display font-bold text-gray-900 dark:text-cream-100 mb-4">
          Toutes les invocations
        </h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-cream-100 dark:bg-night-800 rounded-xl text-sm border border-cream-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-forest-500 dark:text-cream-100"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {(Object.keys(FILTER_LABELS) as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-forest-800 text-white'
                  : 'bg-cream-200 dark:bg-night-800 text-gray-600 dark:text-gray-400 hover:bg-cream-300'
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 py-4 space-y-4">
        {displayed.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-sm">Aucune invocation trouvée</p>
          </div>
        ) : (
          displayed.map(item => (
            <AdhkarCard
              key={item.id}
              item={item}
              isFavorite={settings.favoritesIds.includes(item.id)}
              isDone={isDone(item.id)}
              counter={getCounter(item.id)}
              showTranslit={settings.showTranslit}
              showTranslat={settings.showTranslation}
              showMerit={settings.showMerit}
              arabicSize={settings.arabicSize}
              audioState={audio.state}
              onFavorite={() => toggleFavorite(item.id)}
              onTap={() => handleTap(item)}
              onReset={() => handleReset(item)}
              onMarkDone={() => handleMarkDone(item)}
              onPlay={audio.play}
              onStopAudio={audio.stop}
            />
          ))
        )}
      </div>
      <ScrollButtons />
    </div>
  )
}
