import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, X, RotateCcw, Play, Square, GraduationCap } from 'lucide-react'
import { useAdhkar, useEssentialAdhkar } from '../hooks/useAdhkar'
import { useAudio } from '../hooks/useAudio'
import { useSettings } from '../hooks/useSettings'
import { useStreak } from '../hooks/useStreak'
import { applyTajweedHTML } from '../utils/tajweedUtils'
import AudioPlayer from '../components/AudioPlayer'
import Counter from '../components/Counter'
import { BG_THEMES, DEFAULT_SESSION_BG } from '../data/backgrounds'
import { getT } from '../i18n'

const ARABIC_SIZES: Record<string, string> = {
  md:   'text-xl',
  lg:   'text-2xl',
  xl:   'text-[1.9rem]',
  '2xl':'text-[2.2rem]',
}

// ── Color tokens ─────────────────────────────────────────────
const LIGHT = {
  text:         '#2C1806',
  textSec:      'rgba(44,24,6,0.68)',
  textMuted:    'rgba(44,24,6,0.42)',
  arabic:       '#1A0C02',
  gold:         '#8B5E0A',
  goldBright:   '#C9963A',
  surface:      'rgba(255,248,225,0.82)',
  surfaceAlt:   'rgba(255,243,205,0.92)',
  surfaceMerit: 'rgba(255,240,185,0.86)',
  border:       'rgba(160,110,35,0.22)',
  borderGold:   'rgba(180,130,50,0.38)',
  btn:          'rgba(44,24,6,0.09)',
  btnGold:      'rgba(180,130,50,0.20)',
  btnGoldText:  '#7A5010',
  dot:          'rgba(44,24,6,0.15)',
  dotDone:      '#8B5E0A',
  dotCurrent:   '#C9963A',
  progress:     '#C9963A',
  badge:        'rgba(255,240,185,0.92)',
  badgeText:    '#7A5010',
  badgeAlt:     'rgba(160,110,35,0.16)',
  badgeAltText: 'rgba(44,24,6,0.60)',
  stopBg:       'rgba(20,92,56,0.14)',
  stopText:     '#145C38',
  dangerText:   'rgba(44,24,6,0.35)',
  successBg:    'rgba(255,240,185,0.92)',
  successText:  '#7A5010',
  meritText:    '#2C1806',
  sourceText:   '#8B5E0A',
  audioClass:   '[&>button]:bg-stone-900/10 [&>button]:text-stone-800 [&>button:hover]:bg-stone-900/18',
}

const DARK = {
  text:         '#FFF5E0',
  textSec:      'rgba(255,245,224,0.68)',
  textMuted:    'rgba(255,245,224,0.40)',
  arabic:       '#FFFFFF',
  gold:         '#C9963A',
  goldBright:   '#E0B050',
  surface:      'rgba(255,255,255,0.09)',
  surfaceAlt:   'rgba(255,255,255,0.15)',
  surfaceMerit: 'rgba(50,28,4,0.75)',
  border:       'rgba(201,150,58,0.18)',
  borderGold:   'rgba(201,150,58,0.32)',
  btn:          'rgba(255,255,255,0.10)',
  btnGold:      'rgba(201,150,58,0.30)',
  btnGoldText:  '#E0B050',
  dot:          'rgba(255,255,255,0.18)',
  dotDone:      '#4A8060',
  dotCurrent:   '#C9963A',
  progress:     '#C9963A',
  badge:        'rgba(201,150,58,0.22)',
  badgeText:    '#E0B050',
  badgeAlt:     'rgba(100,70,180,0.22)',
  badgeAltText: '#A080D0',
  stopBg:       'rgba(74,128,96,0.28)',
  stopText:     '#7DD3A8',
  dangerText:   'rgba(255,245,224,0.35)',
  successBg:    'rgba(201,150,58,0.18)',
  successText:  '#E0B050',
  meritText:    '#E8D4A0',
  sourceText:   '#C9963A',
  audioClass:   '[&>button]:bg-white/15 [&>button]:text-white [&>button:hover]:bg-white/25',
}

type Tokens = typeof LIGHT
type Tab    = 'translit' | 'translat' | 'merit'

export default function ImmersiveMode() {
  const { period = 'morning' } = useParams<{ period: string }>()
  const navigate = useNavigate()
  const isQuick  = period === 'quick'

  const actualPeriod       = isQuick ? 'morning' : (period as 'morning' | 'evening')
  const { settings }       = useSettings()
  const ts = getT(settings.language).session
  const lang = settings.language
  const { recordProgress } = useStreak()
  const audio              = useAudio()

  const essentials = useEssentialAdhkar(actualPeriod)
  const fullAdhkar = useAdhkar(actualPeriod)
  const adhkar     = isQuick
    ? { ...fullAdhkar, adhkarList: essentials, totalItems: essentials.length }
    : fullAdhkar

  const {
    adhkarList, currentAdhkar, currentIndex, totalItems,
    completedCount, isItemDone, getCounter, tap, goTo, next, prev,
    markDone, resetCounter, reset, isAllDone, progress,
  } = adhkar

  // ── Background theme ──────────────────────────────────────
  const bgId    = DEFAULT_SESSION_BG[period] ?? 'evening-lanterns'
  const bgTheme = BG_THEMES.find(t => t.id === bgId) ?? BG_THEMES[1]
  const isLight = bgTheme.style === 'light'
  const c: Tokens = isLight ? LIGHT : DARK

  const [slideDir, setSlideDir] = useState<'left' | 'right'>('left')

  const [isPortrait, setIsPortrait] = useState(() => window.innerHeight > window.innerWidth)
  useEffect(() => {
    const handler = () => setIsPortrait(window.innerHeight > window.innerWidth)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  const bgFile = isPortrait ? bgTheme.fileMobile : bgTheme.file

  const defaultTab: Tab | null = settings.showTranslit
    ? 'translit'
    : settings.showTranslation ? 'translat' : null

  const [activeTab,    setActiveTab]   = useState<Tab | null>(defaultTab)
  const [audioMode,    setAudioMode]   = useState<'manual' | 'auto'>('manual')
  const [autoRunning,  setAutoRunning] = useState(false)
  const [learningMode, setLearningMode] = useState(false)

  // Vitesse de lecture 0.75× en mode apprentissage
  useEffect(() => {
    audio.setPlaybackRate(learningMode ? 0.75 : 1)
  }, [learningMode])

  // Forcer la translittération quand le mode s'active
  useEffect(() => {
    if (learningMode) setActiveTab('translit')
  }, [learningMode])

  const touchStartX  = useRef(0)
  const touchStartY  = useRef(0)
  const autoChainRef = useRef(false)
  const tapRef      = useRef(tap)
  const nextRef     = useRef(next)
  const markDoneRef = useRef(markDone)
  tapRef.current      = tap
  nextRef.current     = next
  markDoneRef.current = markDone

  useEffect(() => {
    if (isAllDone) recordProgress(actualPeriod, completedCount, totalItems)
  }, [isAllDone])

  // En mode manuel, fin de lecture → incrément compteur ou passage auto au suivant
  useEffect(() => {
    if (audioMode === 'manual') {
      if ((currentAdhkar?.repeat ?? 1) > 1) {
        // repeat > 1 : chaque écoute compte
        audio.setManualEndCallback(() => {
          const done = tapRef.current()
          if (settings.vibration && navigator.vibrate) navigator.vibrate(12)
          if (done) setTimeout(() => nextRef.current(), 600)
        })
      } else {
        // repeat === 1 : marquer lu et passer au suivant automatiquement
        audio.setManualEndCallback(() => {
          markDoneRef.current(currentAdhkar!.id)
          if (settings.vibration && navigator.vibrate) navigator.vibrate([15, 30, 15])
          setTimeout(() => nextRef.current(), 500)
        })
      }
    } else {
      audio.setManualEndCallback(null)
    }
    return () => audio.setManualEndCallback(null)
  }, [audioMode, currentIndex])

  useEffect(() => {
    audio.stopRepeat()
    setAutoRunning(false)

    // Mode apprentissage : l'audio est géré séparément (loop), on ne touche pas à la chaîne auto
    if (learningMode) return

    if (autoChainRef.current && !isAllDone) {
      const repeat   = currentAdhkar?.repeat ?? 1
      const hasAudio = !!currentAdhkar?.audioArabicUrl

      if (hasAudio && repeat > 1) {
        // Répétitions multiples avec audio : playRepeat N fois puis avancer
        const timer = setTimeout(() => {
          setAutoRunning(true)
          audio.playRepeat(
            currentAdhkar!.id,
            currentAdhkar!.audioArabicUrl!,
            repeat,
            () => { tap(); if (settings.vibration && navigator.vibrate) navigator.vibrate(12) },
            () => {
              setAutoRunning(false)
              if (settings.vibration && navigator.vibrate) navigator.vibrate([15, 30, 15])
              setTimeout(() => next(), 800)
            },
          )
        }, 600)
        return () => clearTimeout(timer)
      } else if (hasAudio && repeat === 1) {
        // Une seule répétition avec audio : jouer une fois, marquer lu, avancer
        const timer = setTimeout(() => {
          setAutoRunning(true)
          audio.playRepeat(
            currentAdhkar!.id,
            currentAdhkar!.audioArabicUrl!,
            1,
            () => markDoneRef.current(currentAdhkar!.id),
            () => {
              setAutoRunning(false)
              if (settings.vibration && navigator.vibrate) navigator.vibrate([15, 30, 15])
              setTimeout(() => nextRef.current(), 600)
            },
          )
        }, 600)
        return () => clearTimeout(timer)
      } else {
        // Pas d'audio : marquer lu et avancer automatiquement
        const timer = setTimeout(() => {
          markDoneRef.current(currentAdhkar!.id)
          setTimeout(() => nextRef.current(), 500)
        }, 800)
        return () => clearTimeout(timer)
      }
    }
  }, [currentIndex])

  // Mode apprentissage : boucler l'audio à 0.75× sur l'adhkar courant
  useEffect(() => {
    if (!learningMode) {
      audio.stopLoop()
      return
    }
    if (currentAdhkar?.audioArabicUrl) {
      audio.playLoop(currentAdhkar.id, currentAdhkar.audioArabicUrl)
    }
    return () => audio.stopLoop()
  }, [currentIndex, learningMode])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { setSlideDir('left');  next() }
      if (e.key === 'ArrowLeft')  { setSlideDir('right'); prev() }
      if (e.key === 'Escape') navigate(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, navigate])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) { setSlideDir('left');  next() }
      else        { setSlideDir('right'); prev() }
    }
  }

  const handleAutoStart = () => {
    if (!currentAdhkar?.audioArabicUrl) return
    autoChainRef.current = true
    setAutoRunning(true)
    audio.playRepeat(
      currentAdhkar.id,
      currentAdhkar.audioArabicUrl,
      currentAdhkar.repeat,
      () => { tap(); if (navigator.vibrate) navigator.vibrate(12) },
      () => {
        setAutoRunning(false)
        if (navigator.vibrate) navigator.vibrate([15, 30, 15])
        setTimeout(() => next(), 800)
      },
    )
  }

  const handleAutoStop = () => {
    autoChainRef.current = false
    setAutoRunning(false)
    audio.stopRepeat()
  }

  if (!currentAdhkar) return null

  const tajweedHtml = applyTajweedHTML(currentAdhkar.arabic)
  const counterVal  = getCounter(currentAdhkar.id)
  const itemDone    = isItemDone(currentAdhkar.id)
  const toggleTab   = (tab: Tab) => setActiveTab(prev => prev === tab ? null : tab)

  return (
    <div
      className="h-dvh flex flex-col overflow-hidden"
      style={{
        backgroundImage:    `url(${encodeURI(bgFile)})`,
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        backgroundRepeat:   'no-repeat',
        backgroundColor:    isLight ? '#F0E4C4' : '#1C0A02',
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Contenu centré — respecte le cadre du fond ────────── */}
      <div className="flex flex-col h-full w-full max-w-[850px] mx-auto">

        {/* ── Top bar ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-3 pt-safe pt-3 pb-1 flex-shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ color: c.textMuted }}
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center">
            {isQuick && (
              <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: c.gold }}>
                {ts.mode2min}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLearningMode(v => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all text-[11px] font-bold min-h-[36px]"
              style={{
                background: learningMode ? 'rgba(59,130,246,0.22)' : c.btn,
                color:      learningMode ? '#3B82F6' : c.textMuted,
                border:     `1px solid ${learningMode ? 'rgba(59,130,246,0.38)' : 'transparent'}`,
              }}
            >
              <GraduationCap size={14} />
              {ts.learning}
            </button>
            <button
              onClick={() => { audio.stop(); reset() }}
              className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center transition-opacity hover:opacity-70"
              style={{ color: c.textMuted }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* ── Badge mode apprentissage ─────────────────────────── */}
        {learningMode && (
          <div
            className="flex-shrink-0 mx-3 mb-1 px-3 py-1.5 rounded-xl flex items-center justify-center gap-2"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.30)' }}
          >
            <GraduationCap size={13} style={{ color: '#3B82F6' }} />
            <span className="text-[11px] font-bold" style={{ color: '#3B82F6' }}>
              {ts.learningBadge}
            </span>
          </div>
        )}

        {/* ── Progress bar fine ────────────────────────────────── */}
        <div className="h-0.5 mx-4 rounded-full flex-shrink-0" style={{ background: c.btn }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, background: c.progress }}
          />
        </div>

        {/* ── Segmented progress + label ───────────────────────── */}
        <div className="flex-shrink-0 px-3 pt-1.5 pb-0.5">
          {/* Segments cliquables */}
          <div className="flex gap-0.5">
            {adhkarList.slice(0, Math.min(totalItems, 30)).map((item, i) => (
              <button
                key={item.id}
                onClick={() => goTo(i)}
                className="flex-1 rounded-full transition-all duration-200"
                style={{
                  height:     i === currentIndex ? '5px' : '3px',
                  background: i === currentIndex
                    ? c.dotCurrent
                    : isItemDone(item.id) ? c.dotDone : c.dot,
                }}
              />
            ))}
          </div>
          {/* Nom de l'invocation en cours + numéro */}
          <div className="flex items-center justify-between mt-1 px-0.5">
            <span className="text-[10px] font-semibold truncate max-w-[70%]" style={{ color: c.textMuted }}>
              {currentAdhkar.title}
            </span>
            <span className="text-[10px] font-bold tabular-nums" style={{ color: c.gold }}>
              {currentIndex + 1} / {totalItems}
            </span>
          </div>
        </div>

        {/* ── Main content ─────────────────────────────────────── */}
        <div
          key={currentIndex}
          className={`flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col px-3 gap-1.5 pb-2 ${isAllDone ? 'animate-fade-in' : slideDir === 'left' ? 'animate-slide-left' : 'animate-slide-right'}`}
        >

          {isAllDone ? (
            /* ── Completion screen ───────────────────────────── */
            <div className="flex flex-col items-center justify-center flex-1 text-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center animate-breathe"
                style={{ background: c.btnGold }}
              >
                <span className="text-3xl">✨</span>
              </div>
              <div>
                <p className="font-arabic text-xl mb-1" style={{ color: c.gold }}>بَارَكَ اللهُ فِيكَ</p>
                <h2 className="text-lg font-display font-bold mb-1" style={{ color: c.text }}>{ts.completionTitle}</h2>
                <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: c.textSec }}>
                  {ts.completionText.split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-2xl text-sm font-semibold border"
                  style={{ background: c.surface, color: c.text, borderColor: c.border }}
                >
                  {ts.restart}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-2xl text-sm font-bold text-white"
                  style={{ background: c.gold }}
                >
                  {ts.back}
                </button>
              </div>
            </div>

          ) : (
            <>
              {/* ── Title badge ───────────────────────────────── */}
              <div className="text-center flex-shrink-0">
                <span
                  className="inline-block text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{
                    background: period === 'evening' ? c.badgeAlt    : c.badge,
                    color:      period === 'evening' ? c.badgeAltText : c.badgeText,
                  }}
                >
                  {currentAdhkar.titleAr} — {currentAdhkar.title}
                </span>
                {currentAdhkar.repeat > 1 && (
                  <p className="text-[10px] mt-0.5" style={{ color: c.textMuted }}>
                    × {currentAdhkar.repeat}
                  </p>
                )}
              </div>

              {/* ── Arabic text ───────────────────────────────── */}
              <div className="flex-shrink-0 max-h-[26vh] overflow-y-auto scrollbar-none">
                <p
                  className={`font-arabic leading-[1.9] text-right ${ARABIC_SIZES[settings.arabicSize] || 'text-[1.9rem]'}`}
                  style={{ color: c.arabic }}
                  dir="rtl"
                  dangerouslySetInnerHTML={{ __html: tajweedHtml }}
                />
              </div>

              {/* ── Tajweed legend ────────────────────────────── */}
              <div className="flex-shrink-0 flex flex-wrap gap-x-3 gap-y-0.5 text-[9px]" style={{ color: c.textMuted }}>
                <span><span style={{ color: '#CC0000' }}>■</span> Madd</span>
                <span><span style={{ color: '#16A34A' }}>■</span> Ghunna</span>
                <span><span style={{ color: '#38BDF8' }}>■</span> Qalqalah</span>
                <span><span style={{ color: '#1E40AF' }}>■</span> Tafkheem</span>
              </div>

              {/* ── Tab pills — taille au contenu ─────────────── */}
              <div className="flex gap-1.5 flex-shrink-0 flex-wrap justify-center">
                {(['translit', 'translat', 'merit'] as Tab[]).map(tab => (
                  <button
                    key={tab}
                    onClick={() => toggleTab(tab)}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap"
                    style={{
                      background: activeTab === tab
                        ? (tab === 'merit' ? c.btnGold    : c.surfaceAlt)
                        : c.btn,
                      color: activeTab === tab
                        ? (tab === 'merit' ? c.btnGoldText : c.text)
                        : c.textMuted,
                      border: `1px solid ${activeTab === tab ? c.border : 'transparent'}`,
                    }}
                  >
                    {tab === 'translit' ? ts.translit : tab === 'translat' ? ts.translat : ts.merit}
                  </button>
                ))}
              </div>

              {/* ── Tab content ───────────────────────────────── */}
              {activeTab && (
                <div
                  className="flex-shrink-0 max-h-[18vh] overflow-y-auto scrollbar-none rounded-2xl p-3 text-sm leading-relaxed"
                  style={{
                    background: activeTab === 'merit' ? c.surfaceMerit : c.surface,
                    border:     `1px solid ${activeTab === 'merit' ? c.borderGold : c.border}`,
                  }}
                >
                  {activeTab === 'translit' && (
                    <p className="italic select-text cursor-text" style={{ color: c.textSec }}>
                      {currentAdhkar.transliteration}
                    </p>
                  )}
                  {activeTab === 'translat' && (
                    <p className="select-text cursor-text" style={{ color: c.text }}>
                      {(lang === 'en' && currentAdhkar.translationEn) ? currentAdhkar.translationEn : currentAdhkar.translationFr}
                    </p>
                  )}
                  {activeTab === 'merit' && (currentAdhkar.merit || currentAdhkar.meritEn) && (
                    <>
                      {currentAdhkar.source && (
                        <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: c.sourceText }}>
                          {currentAdhkar.source}
                        </p>
                      )}
                      <p className="select-text cursor-text" style={{ color: c.meritText }}>
                        {(lang === 'en' && currentAdhkar.meritEn) ? currentAdhkar.meritEn : currentAdhkar.merit}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* ── Mode toggle ───────────────────────────────── */}
              {!learningMode && currentAdhkar.audioArabicUrl && currentAdhkar.repeat > 1 && (
                <div className="flex items-center justify-center gap-2 flex-shrink-0">
                  <span className="text-[10px]" style={{ color: c.textMuted }}>{ts.modeLabel}</span>
                  <button
                    onClick={() => { setAudioMode('manual'); handleAutoStop() }}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all"
                    style={{
                      background: audioMode === 'manual' ? c.surfaceAlt : c.btn,
                      color:      audioMode === 'manual' ? c.text        : c.textMuted,
                      border:     `1px solid ${audioMode === 'manual' ? c.border : 'transparent'}`,
                    }}
                  >
                    {ts.manual}
                  </button>
                  <button
                    onClick={() => { setAudioMode('auto'); audio.stop() }}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all"
                    style={{
                      background: audioMode === 'auto' ? c.btnGold    : c.btn,
                      color:      audioMode === 'auto' ? c.btnGoldText : c.textMuted,
                      border:     `1px solid ${audioMode === 'auto' ? c.borderGold : 'transparent'}`,
                    }}
                  >
                    {ts.auto}
                  </button>
                </div>
              )}

              {/* ── Counter — mode manuel ─────────────────────── */}
              {!learningMode && currentAdhkar.repeat > 1 && audioMode === 'manual' && (
                <div className="flex justify-center flex-shrink-0">
                  <Counter
                    current={counterVal}
                    target={currentAdhkar.repeat}
                    variant={isLight ? 'light' : 'dark'}
                    onTap={() => {
                      const done = tap()
                      if (settings.vibration && navigator.vibrate) navigator.vibrate(12)
                      if (done) setTimeout(() => next(), 600)
                    }}
                    onReset={() => resetCounter(currentAdhkar.id)}
                    size={90}
                  />
                </div>
              )}

              {/* ── Auto-récitation ───────────────────────────── */}
              {!learningMode && currentAdhkar.audioArabicUrl && currentAdhkar.repeat > 1 && audioMode === 'auto' && (
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  {!autoRunning ? (
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={handleAutoStart}
                        className="px-5 py-2.5 font-bold rounded-2xl transition-colors flex items-center gap-2 text-sm"
                        style={{ background: c.stopBg, color: c.stopText }}
                      >
                        <Play size={14} /> {ts.startAuto}
                      </button>
                      {counterVal > 0 && (
                        <button
                          onClick={() => resetCounter(currentAdhkar.id)}
                          className="text-[11px] underline underline-offset-2"
                          style={{ color: c.dangerText }}
                        >
                          {ts.reset} ({counterVal}/{currentAdhkar.repeat})
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.goldBright }} />
                        <span className="font-black text-xl tabular-nums" style={{ color: c.text }}>{counterVal}</span>
                        <span className="text-xs" style={{ color: c.textSec }}>/ {currentAdhkar.repeat}</span>
                      </div>
                      <button
                        onClick={handleAutoStop}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold"
                        style={{ background: c.btn, color: c.dangerText }}
                      >
                        <Square size={10} /> {ts.stop}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Bouton apprentissage — repeat > 1 ────────── */}
              {learningMode && currentAdhkar.repeat > 1 && !itemDone && (
                <button
                  onClick={() => {
                    markDone(currentAdhkar.id)
                    if (settings.vibration && navigator.vibrate) navigator.vibrate([15, 30, 15])
                    setTimeout(() => { setSlideDir('left'); next() }, 400)
                  }}
                  className="w-full py-3 font-bold rounded-2xl flex-shrink-0 text-sm"
                  style={{ background: 'rgba(59,130,246,0.18)', color: '#3B82F6', border: '1px solid rgba(59,130,246,0.30)' }}
                >
                  {ts.learnedNext}
                </button>
              )}

              {/* ── Mark done — ×1 items ──────────────────────── */}
              {currentAdhkar.repeat === 1 && !itemDone && (
                <button
                  onClick={() => {
                    markDone(currentAdhkar.id)
                    if (settings.vibration && navigator.vibrate) navigator.vibrate([15, 30, 15])
                    setTimeout(() => next(), 400)
                  }}
                  className="w-full py-3 font-bold rounded-2xl transition-colors flex-shrink-0 text-sm"
                  style={{ background: c.stopBg, color: c.stopText }}
                >
                  {ts.readNext}
                </button>
              )}

              </>
          )}
        </div>

        {/* ── Bottom bar — AudioPlayer + Navigation ────────────── */}
        {!isAllDone && (
          <div
            className="flex-shrink-0 px-3 pt-1 flex flex-col gap-2"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 14px)' }}
          >
            {/* Audio player — mode manuel */}
            {!learningMode && audioMode === 'manual' && currentAdhkar?.audioArabicUrl && (
              <div className="flex justify-center">
                <AudioPlayer
                  adhkarId={currentAdhkar.id}
                  audioUrl={currentAdhkar.audioArabicUrl}
                  audioState={audio.state}
                  onPlay={audio.play}
                  onStop={audio.stop}
                  className={c.audioClass}
                />
              </div>
            )}
            {/* Précédent / Continuer */}
            <div className="flex gap-2">
              <button
                onClick={() => { setSlideDir('right'); prev() }}
                disabled={currentIndex === 0}
                className="flex-1 py-3.5 rounded-2xl font-bold disabled:opacity-30 flex items-center justify-center gap-2 text-sm transition-opacity"
                style={{ background: c.surface, color: c.text, border: `1px solid ${c.border}` }}
              >
                <ArrowLeft size={16} /> {ts.prev}
              </button>
              <button
                onClick={() => { setSlideDir('left'); next() }}
                disabled={currentIndex === totalItems - 1 && !isAllDone}
                className="flex-1 py-3.5 rounded-2xl font-bold disabled:opacity-30 flex items-center justify-center gap-2 text-sm transition-opacity"
                style={{ background: c.surfaceAlt, color: c.text, border: `1px solid ${c.border}` }}
              >
                {ts.next} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
