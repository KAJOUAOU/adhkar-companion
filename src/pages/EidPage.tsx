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

// Couleurs or/ambre hardcodées — indépendantes du thème actif
const GOLD_DARK   = '#7A5010'
const GOLD_MED    = '#C9963A'
const GOLD_LIGHT  = '#F5E6C0'
const HEADER_BG   = 'linear-gradient(150deg, #8B6914 0%, #5C3A0A 100%)'
const PLAY_BG     = 'linear-gradient(135deg, #C9963A 0%, #8B6414 100%)'

const SPEEDS = [
  { label: '0.75×', value: 0.75 },
  { label: '1×',    value: 1.00 },
  { label: '1.25×', value: 1.25 },
  { label: '1.5×',  value: 1.50 },
]

const ARABIC_FS: Record<string, string> = {
  md: '1.25rem', lg: '1.45rem', xl: '1.65rem', '2xl': '1.9rem',
}

export default function EidPage() {
  const navigate     = useNavigate()
  const { settings } = useSettings()
  const t            = getT(settings.language).eid

  const [showTranslit,    setShowTranslit]    = useState(settings.showTranslit)
  const [showTranslation, setShowTranslation] = useState(settings.showTranslation)
  const [isPlaying,       setIsPlaying]       = useState(false)
  const [speed,           setSpeed]           = useState(1.0)

  const loopRef  = useRef(false)
  const speedRef = useRef(1.0)
  useEffect(() => { speedRef.current = speed }, [speed])

  const loopSpeak = () => {
    if (!loopRef.current) return
    window.speechSynthesis.cancel()
    const u   = new SpeechSynthesisUtterance(ARABIC.replace(/\n/g, ' '))
    u.lang    = 'ar-SA'
    u.rate    = speedRef.current
    u.onend   = () => { if (loopRef.current) setTimeout(loopSpeak, 600) }
    u.onerror = () => { if (loopRef.current) setTimeout(loopSpeak, 800) }
    window.speechSynthesis.speak(u)
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

  const isDark = settings.theme === 'dark' ||
    (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const surfaceBg  = isDark ? '#1C1410' : '#FFFDF8'
  const cardBg     = isDark ? '#2A1E12' : '#FFFFFF'
  const cardBorder = isDark ? 'rgba(201,150,58,0.15)' : 'rgba(201,150,58,0.20)'
  const textMain   = isDark ? '#FFF5E0' : '#1A0C02'
  const textMuted  = isDark ? 'rgba(255,245,224,0.55)' : 'rgba(26,12,2,0.50)'

  return (
    <div
      className="h-dvh flex flex-col overflow-hidden"
      style={{ background: surfaceBg }}
    >
      {/* ── Header ── */}
      <div
        className="flex-shrink-0"
        style={{
          background: HEADER_BG,
          paddingTop: 'max(env(safe-area-inset-top, 0px), 44px)',
          paddingBottom: '20px',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        <button
          onClick={() => { handleStop(); navigate(-1) }}
          className="flex items-center gap-1.5 mb-4 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">{t.back}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Icône */}
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            ☪️
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-white leading-tight">
              {t.title}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.50)' }}>
              {t.fitr} · {t.adha}
            </p>
          </div>

          {/* Badge lecture */}
          {isPlaying && (
            <div
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: GOLD_LIGHT }}
              />
              <span className="text-xs font-semibold text-white/80">{t.playing}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Contenu scrollable ── */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-4 py-5 space-y-3">

        {/* Texte arabe */}
        <div
          className="rounded-2xl p-5"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
        >
          <p
            className="font-arabic text-right whitespace-pre-line"
            style={{
              fontSize: ARABIC_FS[settings.arabicSize] ?? '1.45rem',
              lineHeight: 2.2,
              color: textMain,
              direction: 'rtl',
            }}
          >
            {ARABIC}
          </p>
        </div>

        {/* Phonétique */}
        {showTranslit && (
          <div
            className="rounded-2xl p-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: GOLD_MED }}
            >
              {t.translitLabel}
            </p>
            <p
              className="text-sm leading-relaxed italic whitespace-pre-line"
              style={{ color: textMuted }}
            >
              {TRANSLIT}
            </p>
          </div>
        )}

        {/* Traduction */}
        {showTranslation && (
          <div
            className="rounded-2xl p-4"
            style={{
              background: isDark ? 'rgba(201,150,58,0.10)' : '#FDF6E3',
              border: `1px solid ${isDark ? 'rgba(201,150,58,0.20)' : '#F0DFA0'}`,
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: GOLD_DARK }}
            >
              {t.translationLabel}
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{ color: isDark ? '#E8D4A0' : '#3D2800' }}
            >
              {t.translation}
            </p>
          </div>
        )}
      </div>

      {/* ── Barre de contrôles épinglée en bas ── */}
      <div
        className="flex-shrink-0 px-4 pt-3 space-y-3"
        style={{
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 20px)',
          background: cardBg,
          borderTop: `1px solid ${cardBorder}`,
        }}
      >
        {/* Toggles + Vitesse sur une ligne */}
        <div className="flex items-center gap-2">
          {/* Toggles */}
          {[
            { label: t.translitLabel,    active: showTranslit,    toggle: () => setShowTranslit(v => !v) },
            { label: t.translationLabel, active: showTranslation, toggle: () => setShowTranslation(v => !v) },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.toggle}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: btn.active ? GOLD_LIGHT : (isDark ? 'rgba(255,255,255,0.07)' : '#F0E8D8'),
                color:      btn.active ? GOLD_DARK  : textMuted,
                border:     `1px solid ${btn.active ? '#E8CC80' : 'transparent'}`,
              }}
            >
              {btn.label}
            </button>
          ))}

          {/* Séparateur */}
          <div className="flex-1" />

          {/* Vitesse */}
          <div className="flex gap-1">
            {SPEEDS.map(s => (
              <button
                key={s.value}
                onClick={() => setSpeed(s.value)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: speed === s.value ? GOLD_LIGHT : (isDark ? 'rgba(255,255,255,0.07)' : '#F0E8D8'),
                  color:      speed === s.value ? GOLD_DARK  : textMuted,
                  border:     `1px solid ${speed === s.value ? '#E8CC80' : 'transparent'}`,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bouton principal */}
        {isPlaying ? (
          <button
            onClick={handleStop}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-98"
            style={{
              background: isDark ? 'rgba(220,38,38,0.20)' : '#FEE2E2',
              color:      isDark ? '#FCA5A5' : '#B91C1C',
              border:     `1px solid ${isDark ? 'rgba(220,38,38,0.30)' : '#FECACA'}`,
            }}
          >
            <Square size={16} fill="currentColor" />
            {t.stop}
          </button>
        ) : (
          <button
            onClick={handlePlay}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm text-white transition-all active:scale-98"
            style={{ background: PLAY_BG, boxShadow: '0 4px 16px rgba(139,100,20,0.35)' }}
          >
            <Play size={16} fill="currentColor" />
            {t.playLoop}
          </button>
        )}
      </div>
    </div>
  )
}
