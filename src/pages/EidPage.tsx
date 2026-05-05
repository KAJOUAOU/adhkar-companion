import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Square } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { getT } from '../i18n'

const ARABIC =
  'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ،\n' +
  'لَا إِلَهَ إِلَّا اللهُ،\n' +
  'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ،\n' +
  'وَلِلَّهِ الحَمْدُ.\n' +
  'اللهُ أَكْبَرُ كَبِيرًا،\n' +
  'وَالحَمْدُ لِلَّهِ كَثِيرًا،\n' +
  'وَسُبْحَانَ اللهِ بُكْرَةً وَأَصِيلًا،\n' +
  'لَا إِلَهَ إِلَّا اللهُ.'

const TRANSLIT =
  'Allāhu Akbar, Allāhu Akbar, Allāhu Akbar,\n' +
  'lā ilāha illā-llāh,\n' +
  'Allāhu Akbar, Allāhu Akbar,\n' +
  'wa li-llāhi l-ḥamd.\n' +
  'Allāhu Akbaru kabīrā,\n' +
  'wa l-ḥamdu li-llāhi kathīrā,\n' +
  'wa subḥāna-llāhi bukratan wa aṣīlā,\n' +
  'lā ilāha illā-llāh.'

const SPEEDS = [
  { label: '0.75×', value: 0.75 },
  { label: '1×',    value: 1.00 },
  { label: '1.25×', value: 1.25 },
  { label: '1.5×',  value: 1.50 },
]

const ARABIC_FONT_SIZE: Record<string, string> = {
  md: '1.3rem', lg: '1.55rem', xl: '1.8rem', '2xl': '2.1rem',
}

export default function EidPage() {
  const navigate    = useNavigate()
  const { settings } = useSettings()
  const lang        = settings.language
  const t           = getT(lang).eid

  const [showTranslit,    setShowTranslit]    = useState(settings.showTranslit)
  const [showTranslation, setShowTranslation] = useState(settings.showTranslation)
  const [isPlaying,       setIsPlaying]       = useState(false)
  const [speed,           setSpeed]           = useState(1.0)

  const loopRef  = useRef(false)
  const speedRef = useRef(1.0)

  // keep speedRef in sync so the loop always uses the latest value
  useEffect(() => { speedRef.current = speed }, [speed])

  const speakOnce = (onEnd: () => void) => {
    window.speechSynthesis.cancel()
    const utter    = new SpeechSynthesisUtterance(ARABIC.replace(/\n/g, ' '))
    utter.lang     = 'ar-SA'
    utter.rate     = speedRef.current
    utter.onend    = onEnd
    utter.onerror  = onEnd
    window.speechSynthesis.speak(utter)
  }

  const loopSpeak = () => {
    if (!loopRef.current) return
    speakOnce(() => {
      if (loopRef.current) setTimeout(loopSpeak, 600)
    })
  }

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return
    loopRef.current = true
    setIsPlaying(true)
    loopSpeak()
  }

  const handleStop = () => {
    loopRef.current = false
    setIsPlaying(false)
    window.speechSynthesis.cancel()
  }

  useEffect(() => () => {
    loopRef.current = false
    window.speechSynthesis.cancel()
  }, [])

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-10">

      {/* Header — palette or/ambre du Dashboard */}
      <div
        className="relative border-b border-white/10 px-5 pb-6"
        style={{
          background: 'var(--t-hero, linear-gradient(150deg,#6E5010,#8B6914))',
          paddingTop: 'max(env(safe-area-inset-top, 0px), 48px)',
        }}
      >
        <button
          onClick={() => { handleStop(); navigate(-1) }}
          className="p-2 -ml-1 rounded-xl text-white/60 hover:bg-white/10 transition-colors mb-3"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            ☪️
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white leading-tight">
              {t.title}
            </h1>
            <p className="text-xs text-white/50 mt-0.5">
              {t.fitr} · {t.adha}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* Texte arabe */}
        <div className="bg-white dark:bg-night-800 rounded-2xl p-5 shadow-soft border border-cream-200 dark:border-white/10">
          <p
            className="font-arabic text-right text-gray-900 dark:text-cream-100"
            style={{ fontSize: ARABIC_FONT_SIZE[settings.arabicSize] ?? '1.55rem', lineHeight: 2.2 }}
            dir="rtl"
          >
            {ARABIC}
          </p>
        </div>

        {/* Translittération */}
        {showTranslit && (
          <div className="bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/10">
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">
              {t.translitLabel}
            </p>
            <p className="text-sm text-gray-600 dark:text-cream-300 leading-relaxed italic whitespace-pre-line">
              {TRANSLIT}
            </p>
          </div>
        )}

        {/* Traduction */}
        {showTranslation && (
          <div className="bg-amber-50 dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-amber-100 dark:border-white/10">
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">
              {t.translationLabel}
            </p>
            <p className="text-sm text-gray-700 dark:text-cream-300 leading-relaxed">
              {t.translation}
            </p>
          </div>
        )}

        {/* Toggles */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: t.translitLabel,    active: showTranslit,    set: setShowTranslit },
            { label: t.translationLabel, active: showTranslation, set: setShowTranslation },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={() => btn.set(v => !v)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                btn.active
                  ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/40'
                  : 'bg-white dark:bg-night-800 text-gray-500 dark:text-gray-400 border-cream-200 dark:border-white/10'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Contrôle de vitesse */}
        <div className="bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/10">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            {t.speed}
          </p>
          <div className="flex gap-2">
            {SPEEDS.map(s => (
              <button
                key={s.value}
                onClick={() => setSpeed(s.value)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                  speed === s.value
                    ? 'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/40'
                    : 'bg-cream-100 dark:bg-night-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton Play / Stop */}
        {isPlaying ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 py-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {t.playing}
              </span>
            </div>
            <button
              onClick={handleStop}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base border transition-all active:scale-98 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30"
            >
              <Square size={18} fill="currentColor" />
              {t.stop}
            </button>
          </div>
        ) : (
          <button
            onClick={handlePlay}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base text-white transition-all active:scale-98"
            style={{ background: 'var(--t-primary-d, #5C4010)' }}
          >
            <Play size={18} fill="currentColor" />
            {t.playLoop}
          </button>
        )}

      </div>
    </div>
  )
}
