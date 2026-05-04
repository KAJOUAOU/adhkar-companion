import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { SLEEP_ADHKAR } from '../data/sleepAdhkar'

export default function SleepAdhkar() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const toggle = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const arabicSizeClass =
    settings.arabicSize === 'md' ? 'text-xl' :
    settings.arabicSize === 'lg' ? 'text-2xl' :
    settings.arabicSize === 'xl' ? 'text-3xl' : 'text-4xl'

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-10">

      {/* Header */}
      <div
        className="relative border-b border-white/10 px-5 pb-6"
        style={{
          background: 'linear-gradient(150deg, #1a1035, #2d1b5e)',
          paddingTop: 'max(env(safe-area-inset-top, 0px), 48px)',
        }}
      >
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
                  <p className={`text-right leading-loose text-gray-900 dark:text-cream-100 font-arabic ${arabicSizeClass} ${!isExpanded ? 'line-clamp-4' : ''}`}>
                    {item.arabic}
                  </p>
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
