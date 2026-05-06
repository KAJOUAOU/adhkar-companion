import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp, Play, Square, Loader } from 'lucide-react'
import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { useAudio } from '../hooks/useAudio'
import { SLEEP_ADHKAR } from '../data/sleepAdhkar'
import { applyTajweedHTML } from '../utils/tajweedUtils'
import IslamicPattern from '../components/IslamicPattern'
import SeoHead from '../components/SeoHead'

export default function SleepAdhkar() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const audio = useAudio()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const arabicSizeClass =
    settings.arabicSize === 'md' ? 'text-xl' :
    settings.arabicSize === 'lg' ? 'text-2xl' :
    settings.arabicSize === 'xl' ? 'text-3xl' : 'text-4xl'

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-10">
      <SeoHead
        title="Sunnah de la nuit — Invocations avant le sommeil | Adhkar Companion"
        description="Les adhkar et invocations islamiques à réciter avant de dormir selon la Sunnah : Ayat Al-Kursi, Al-Ikhlas, Al-Falaq, An-Nas, salawat. Sunnah de la nuit."
        canonical="/sleep"
        keywords="adhkar avant de dormir, invocation sommeil islam, sunnah de la nuit, ayat al-kursi avant sommeil, sourate avant dormir, dhikr nuit"
      />

      {/* Header */}
      <div
        className="relative overflow-hidden border-b border-white/10 px-5 pb-6"
        style={{
          background: 'linear-gradient(150deg, #1a1035, #2d1b5e)',
          paddingTop: 'max(env(safe-area-inset-top, 0px), 48px)',
        }}
      >
        <IslamicPattern className="text-white" opacity={0.10} />
        <div className="relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-1 rounded-xl text-white/60 hover:bg-white/10 transition-colors mb-3"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            🌙
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white leading-tight">
              Sunnah de la nuit
            </h1>
            <p className="text-xs text-white/50 mt-0.5">
              Avant de dormir — {SLEEP_ADHKAR.length} invocations
            </p>
          </div>
        </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {SLEEP_ADHKAR.map((item, index) => {
          const isLong = item.arabic.length > 400
          const isExpanded = expanded[item.id] ?? !isLong

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-night-800 rounded-2xl overflow-hidden shadow-soft border border-cream-200 dark:border-white/5"
            >
              {/* Card header */}
              <div className="px-4 pt-4 pb-3 border-b border-cream-100 dark:border-white/5 flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-sm text-gray-900 dark:text-cream-100">{item.title}</h2>
                  <p className="text-xs text-gray-400 font-arabic">{item.titleAr}</p>
                </div>
                {item.source && (
                  <span className="text-[10px] text-gray-400 shrink-0">{item.source}</span>
                )}
              </div>

              <div className="px-4 pt-4 pb-4 space-y-3">

                {/* Arabic */}
                <div>
                  <p
                    className={`text-right leading-loose text-gray-900 dark:text-cream-100 font-arabic ${arabicSizeClass} ${!isExpanded ? 'line-clamp-4' : ''}`}
                    dangerouslySetInnerHTML={{ __html: applyTajweedHTML(item.arabic) }}
                  />
                  {isLong && (
                    <button
                      onClick={() => toggle(item.id)}
                      className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-2"
                    >
                      {isExpanded
                        ? <><ChevronUp size={13} /> Réduire</>
                        : <><ChevronDown size={13} /> Afficher tout</>}
                    </button>
                  )}
                </div>

                {/* Transliteration */}
                {settings.showTranslit && (
                  <p className={`text-xs text-gray-400 italic leading-relaxed ${!isExpanded && isLong ? 'line-clamp-2' : ''}`}>
                    {item.transliteration}
                  </p>
                )}

                {/* Translation */}
                {settings.showTranslation && (
                  <p className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed ${!isExpanded && isLong ? 'line-clamp-3' : ''}`}>
                    {item.translationFr}
                  </p>
                )}

                {/* Audio */}
                {item.audioArabicUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    {audio.state.currentId === item.id && audio.state.isLoading ? (
                      <div className="flex items-center gap-2 text-indigo-500">
                        <Loader size={14} className="animate-spin" />
                        <span className="text-xs">Chargement…</span>
                      </div>
                    ) : audio.state.currentId === item.id && audio.state.isPlaying ? (
                      <button
                        onClick={() => audio.stop()}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
                      >
                        <Square size={12} /> Arrêter
                      </button>
                    ) : (
                      <button
                        onClick={() => audio.play(item.id, item.audioArabicUrl!)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold active:scale-95 transition-transform"
                      >
                        <Play size={12} /> Écouter
                      </button>
                    )}
                    {audio.state.error && audio.state.currentId === item.id && (
                      <span className="text-xs text-red-400">{audio.state.error}</span>
                    )}
                  </div>
                )}

                {/* Merit */}
                {settings.showMerit && item.merit && (
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-900/15 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                    <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                      ✨ {item.merit}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
