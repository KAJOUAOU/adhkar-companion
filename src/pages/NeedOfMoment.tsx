import { useState } from 'react'
import { NEED_TAGS, getAdhkarByTag } from '../data/adhkar'
import ScrollButtons from '../components/ScrollButtons'
import { useSettings } from '../hooks/useSettings'
import { useAudio } from '../hooks/useAudio'
import { loadSession, saveSession } from '../services/storageService'
import AdhkarCard from '../components/AdhkarCard'
import { getT } from '../i18n'

export default function NeedOfMoment() {
  const [selected, setSelected] = useState<string | null>(null)
  const { settings, toggleFavorite } = useSettings()
  const audio = useAudio()
  const t = getT(settings.language).need
  const tTags = getT(settings.language).needTags

  const [sessions, setSessions] = useState({
    morning: loadSession('morning'),
    evening: loadSession('evening'),
  })

  const results = selected ? getAdhkarByTag(selected) : []

  const handleTap = (item: ReturnType<typeof getAdhkarByTag>[0]) => {
    const period = item.period === 'evening' ? 'evening' : 'morning'
    const sess   = { ...sessions[period] }
    const cur    = sess.counters[item.id] ?? 0
    if (cur >= item.repeat) return
    const newCnt = cur + 1
    const done   = newCnt >= item.repeat
    sess.counters = { ...sess.counters, [item.id]: newCnt }
    if (done && !sess.completed.includes(item.id)) sess.completed = [...sess.completed, item.id]
    saveSession(sess)
    setSessions(s => ({ ...s, [period]: sess }))
    if (settings.vibration && navigator.vibrate) navigator.vibrate(12)
  }

  const handleReset = (item: ReturnType<typeof getAdhkarByTag>[0]) => {
    const period = item.period === 'evening' ? 'evening' : 'morning'
    const sess   = { ...sessions[period] }
    sess.counters  = { ...sess.counters,  [item.id]: 0 }
    sess.completed = sess.completed.filter(c => c !== item.id)
    saveSession(sess)
    setSessions(s => ({ ...s, [period]: sess }))
  }

  const getCounter = (id: string) =>
    sessions.morning.counters[id] ?? sessions.evening.counters[id] ?? 0

  const isDone = (id: string) =>
    sessions.morning.completed.includes(id) || sessions.evening.completed.includes(id)

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-28">
      {/* Header */}
      <div className="bg-white dark:bg-night-900 border-b border-cream-200 dark:border-white/10 px-5 pt-safe pt-12 pb-6">
        <h1 className="text-xl font-display font-bold text-gray-900 dark:text-cream-100 mb-1">
          {t.title}
        </h1>
        <p className="text-sm text-gray-400">{t.subtitle}</p>
      </div>

      {/* Need tags */}
      <div className="px-5 pt-5 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {NEED_TAGS.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelected(s => s === tag.id ? null : tag.id)}
              className={`rounded-2xl p-4 text-left transition-all duration-200 border
                ${selected === tag.id
                  ? 'bg-forest-800 border-forest-700 text-white shadow-medium'
                  : 'bg-white dark:bg-night-800 border-cream-200 dark:border-white/10 text-gray-800 dark:text-cream-200 shadow-soft'
                }`}
            >
              <div className="text-2xl mb-2">{tag.emoji}</div>
              <div className={`font-bold text-sm mb-0.5 ${selected === tag.id ? 'text-white' : ''}`}>
                {tTags[tag.id]?.label ?? tag.label}
              </div>
              <div className={`text-xs leading-snug ${selected === tag.id ? 'text-white/70' : 'text-gray-400'}`}>
                {tTags[tag.id]?.description ?? tag.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {selected && (
        <div className="px-4 pb-6">
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🤲</p>
              <p className="text-sm">{t.notFound}</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-4 px-1">
                {results.length} invocation{results.length > 1 ? 's' : ''} — {' '}
                {tTags[selected!]?.label ?? NEED_TAGS.find(nt => nt.id === selected)?.label}
              </p>
              <div className="space-y-4">
                {results.map(item => (
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
                    onMarkDone={() => {}}
                    onPlay={audio.play}
                    onStopAudio={audio.stop}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!selected && (
        <div className="text-center py-12 px-8 text-gray-400">
          <p className="text-4xl mb-3">🌿</p>
          <p className="text-sm leading-relaxed">
            {t.selectPrompt}
          </p>
        </div>
      )}
      <ScrollButtons />
    </div>
  )
}
