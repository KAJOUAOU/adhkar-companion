import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Square } from 'lucide-react'
import { getAdhkarById } from '../data/adhkar'
import { useSettings } from '../hooks/useSettings'
import { useAudio } from '../hooks/useAudio'
import { loadSession, saveSession } from '../services/storageService'
import { useState } from 'react'
import AdhkarCard from '../components/AdhkarCard'
import IslamicPattern from '../components/IslamicPattern'
import SeoHead from '../components/SeoHead'

export default function DhikrDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const item = getAdhkarById(id ?? '')
  const { settings, toggleFavorite } = useSettings()
  const audio = useAudio()

  const [sessions, setSessions] = useState({
    morning: loadSession('morning'),
    evening: loadSession('evening'),
  })
  const [looping, setLooping] = useState(false)

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Invocation introuvable.</p>
      </div>
    )
  }

  const period = item.period === 'evening' ? 'evening' : 'morning'
  const counter = sessions.morning.counters[item.id] ?? sessions.evening.counters[item.id] ?? 0
  const isDone  = sessions.morning.completed.includes(item.id) || sessions.evening.completed.includes(item.id)

  const handleTap = () => {
    const sess = { ...sessions[period] }
    const cur  = sess.counters[item.id] ?? 0
    if (cur >= item.repeat) return
    const newCnt = cur + 1
    sess.counters = { ...sess.counters, [item.id]: newCnt }
    if (newCnt >= item.repeat && !sess.completed.includes(item.id))
      sess.completed = [...sess.completed, item.id]
    saveSession(sess)
    setSessions(s => ({ ...s, [period]: sess }))
    if (settings.vibration && navigator.vibrate) navigator.vibrate(12)
  }

  const handleReset = () => {
    const sess = { ...sessions[period] }
    sess.counters  = { ...sess.counters,  [item.id]: 0 }
    sess.completed = sess.completed.filter(c => c !== item.id)
    saveSession(sess)
    setSessions(s => ({ ...s, [period]: sess }))
  }

  const handleMarkDone = () => {
    const sess = { ...sessions[period] }
    if (!sess.completed.includes(item.id)) sess.completed = [...sess.completed, item.id]
    saveSession(sess)
    setSessions(s => ({ ...s, [period]: sess }))
  }

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-10">
      <SeoHead
        title={`${item.title} — ${item.titleAr} | Adhkar Companion`}
        description={`Récitez "${item.title}" (${item.titleAr}) ${item.repeat} fois selon la Sunnah. Texte arabe avec tajweed, translittération et traduction en français.`}
        canonical={`/dhikr/${item.id}`}
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
            {item.title}
          </h1>
          <p className="text-xs text-gray-400 font-arabic">{item.titleAr}</p>
        </div>
      </div>

      {/* Mode boucle — uniquement si audio disponible */}
      {item.audioArabicUrl && (
        <div className="mx-4 mt-5 bg-white dark:bg-night-800 rounded-2xl p-4 border border-cream-200 dark:border-white/5 shadow-soft">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Mode boucle</p>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            🕌 Recommandé de l'Asr du jeudi jusqu'à l'Asr du vendredi
          </p>
          {!looping ? (
            <button
              onClick={() => { setLooping(true); audio.playLoop(item.id, item.audioArabicUrl!) }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-forest-800 text-white active:scale-98 transition-transform"
            >
              <Play size={16} /> Lancer en boucle
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
                <span className="text-sm font-semibold text-forest-700 dark:text-forest-400">En cours de récitation…</span>
              </div>
              <button
                onClick={() => { setLooping(false); audio.stopLoop() }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-cream-100 dark:bg-night-700 text-gray-500"
              >
                <Square size={13} /> Arrêter
              </button>
            </div>
          )}
        </div>
      )}

      <div className="px-4 pt-5">
        <AdhkarCard
          item={item}
          isFavorite={settings.favoritesIds.includes(item.id)}
          isDone={isDone}
          counter={counter}
          showTranslit={settings.showTranslit}
          showTranslat={settings.showTranslation}
          showMerit={settings.showMerit}
          arabicSize={settings.arabicSize}
          audioState={audio.state}
          onFavorite={() => toggleFavorite(item.id)}
          onTap={handleTap}
          onReset={handleReset}
          onMarkDone={handleMarkDone}
          onPlay={audio.play}
          onStopAudio={audio.stop}
        />
      </div>
    </div>
  )
}
