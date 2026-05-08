import { useState, useRef } from 'react'
import { Moon, Sun, Monitor, RotateCcw, Palette, ChevronLeft, ChevronRight, Languages, Check } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { requestPermission, scheduleReminder, cancelReminder } from '../services/notificationService'
import { resetAllProgress } from '../services/storageService'
import { BG_THEMES } from '../data/backgrounds'
import type { ThemeMode, ArabicSize, ColorTheme } from '../types'
import { getT } from '../i18n'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-5 mb-2">
        {title}
      </h2>
      <div className="bg-white dark:bg-night-800 rounded-2xl overflow-hidden border border-cream-200 dark:border-white/5 shadow-soft divide-y divide-cream-100 dark:divide-white/5">
        {children}
      </div>
    </div>
  )
}

function Row({
  label, sub, children, danger,
}: {
  label: string; sub?: string; children: React.ReactNode; danger?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 gap-3">
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${danger ? 'text-red-500' : 'text-gray-900 dark:text-cream-100'}`}>
          {label}
        </p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-6.5 rounded-full relative transition-colors duration-200 ${value ? 'bg-forest-700' : 'bg-gray-200 dark:bg-night-600'}`}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.75 transition-transform duration-200 shadow-sm ${value ? 'translate-x-6' : 'translate-x-0.75'}`} />
    </button>
  )
}

export default function Settings() {
  const { settings, updateSettings } = useSettings()
  const t = getT(settings.language).settings
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetDone,    setResetDone]    = useState(false)
  const [showCustom,   setShowCustom]   = useState(false)
  const [customHero1,  setCustomHero1]  = useState('#6E5010')
  const [customHero2,  setCustomHero2]  = useState('#8B6914')
  const carouselRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (dir: 'left' | 'right') => {
    carouselRef.current?.scrollBy({ left: dir === 'left' ? -160 : 160, behavior: 'smooth' })
  }

  const handleReset = () => {
    resetAllProgress()
    setConfirmReset(false)
    setResetDone(true)
    setTimeout(() => setResetDone(false), 3000)
  }

  const [notifGranted, setNotifGranted] = useState(
    typeof Notification !== 'undefined' ? Notification.permission === 'granted' : false
  )

  const handleReminderToggle = async (period: 'morning' | 'evening', enabled: boolean) => {
    if (enabled && !notifGranted) {
      const granted = await requestPermission()
      setNotifGranted(granted)
      if (!granted) return
    }
    if (period === 'morning') {
      updateSettings('morningReminderEnabled', enabled)
      if (enabled) scheduleReminder('morning', settings.morningReminderTime)
      else         cancelReminder('morning')
    } else {
      updateSettings('eveningReminderEnabled', enabled)
      if (enabled) scheduleReminder('evening', settings.eveningReminderTime)
      else         cancelReminder('evening')
    }
  }

  const THEMES: { id: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { id: 'light',  label: t.light,  icon: <Sun size={16} /> },
    { id: 'dark',   label: t.dark,   icon: <Moon size={16} /> },
    { id: 'auto',   label: t.auto,   icon: <Monitor size={16} /> },
  ]

  const COLOR_THEMES: { id: ColorTheme; label: string; hero: string; dot: string }[] = [
    { id: 'parchemin',  label: 'Parchemin',  hero: 'linear-gradient(135deg,#6E5010,#8B6914)', dot: '#C9963A' },
    { id: 'perle',      label: 'Nacre',      hero: 'linear-gradient(135deg,#4A3F32,#66544A)', dot: '#A08060' },
    { id: 'emeraude',   label: 'Émeraude',   hero: 'linear-gradient(135deg,#0C4228,#145C38)', dot: '#1A7045' },
    { id: 'saphir',     label: 'Saphir',     hero: 'linear-gradient(135deg,#1A2D5E,#243F88)', dot: '#3B60CC' },
    { id: 'rose-sable', label: 'Rose',       hero: 'linear-gradient(135deg,#7A3658,#9E4872)', dot: '#C06090' },
    { id: 'nuit',       label: 'Nuit',       hero: 'linear-gradient(135deg,#1E2B5A,#283880)', dot: '#3B5BAD' },
    { id: 'pourpre',    label: 'Pourpre',    hero: 'linear-gradient(135deg,#5B2A6A,#7A3A90)', dot: '#7A3A90' },
    { id: 'cuivre',     label: 'Cuivre',     hero: 'linear-gradient(135deg,#8A4020,#C8622E)', dot: '#B85A2A' },
    { id: 'turquoise',  label: 'Turquoise',  hero: 'linear-gradient(135deg,#106060,#1A8888)', dot: '#1A7878' },
    { id: 'ardoise',    label: 'Ardoise',    hero: 'linear-gradient(135deg,#2E3848,#505A70)', dot: '#4A5568' },
  ]

  const SIZES: { id: ArabicSize; label: string }[] = [
    { id: 'md',   label: 'M' },
    { id: 'lg',   label: 'L' },
    { id: 'xl',   label: 'XL' },
    { id: '2xl',  label: 'XXL' },
  ]

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-28">
      {/* Header */}
      <div className="bg-white dark:bg-night-900 border-b border-cream-200 dark:border-white/10 px-5 pt-safe pt-12 pb-5">
        <h1 className="text-xl font-display font-bold text-gray-900 dark:text-cream-100">{t.title}</h1>
      </div>

      <div className="pt-5 px-4">
        {/* Palette de couleurs */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-1 mb-3">
            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {t.palette}
            </h2>
            <button
              onClick={() => setShowCustom(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                showCustom ? 'bg-gold-500 text-white' : 'bg-cream-200 dark:bg-night-700 text-gray-500 dark:text-gray-400'
              }`}
            >
              <Palette size={12} /> {t.customize}
            </button>
          </div>

          {/* Carousel */}
          <div className="relative">
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white dark:bg-night-700 rounded-full shadow flex items-center justify-center text-gray-400"
            >
              <ChevronLeft size={14} />
            </button>
            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto scrollbar-none px-8 scroll-smooth"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {COLOR_THEMES.map(t => {
                const active = (settings.colorTheme ?? 'parchemin') === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      updateSettings('colorTheme', t.id)
                      const root = document.documentElement
                      root.style.removeProperty('--t-hero')
                      root.style.removeProperty('--t-primary')
                      root.style.removeProperty('--t-primary-d')
                    }}
                    className="flex-shrink-0 flex flex-col items-center gap-2 scroll-snap-align-start"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl shadow-soft transition-all ${
                        active ? 'ring-3 ring-gold-500 ring-offset-2 scale-110' : 'opacity-60 hover:opacity-90 hover:scale-105'
                      }`}
                      style={{ background: t.hero }}
                    />
                    <span className={`text-[10px] font-bold transition-colors ${
                      active ? 'text-gold-600 dark:text-gold-400' : 'text-gray-400'
                    }`}>{t.label}</span>
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 bg-white dark:bg-night-700 rounded-full shadow flex items-center justify-center text-gray-400"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Couleur active label */}
          <p className="text-center text-xs text-gray-400 mt-2">
            {t.activeTheme} <span className="font-bold text-gray-600 dark:text-gray-300">
              {COLOR_THEMES.find(ct => ct.id === (settings.colorTheme ?? 'parchemin'))?.label}
            </span>
          </p>

          {/* Custom color picker */}
          {showCustom && (
            <div className="mt-4 bg-white dark:bg-night-800 rounded-2xl p-4 border border-cream-200 dark:border-white/5 shadow-soft">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">{t.customColors}</p>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1.5">
                  <label className="text-[10px] text-gray-400 font-semibold">{t.color1}</label>
                  <div className="relative">
                    <input
                      type="color"
                      value={customHero1}
                      onChange={e => setCustomHero1(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0.5 bg-transparent"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <label className="text-[10px] text-gray-400 font-semibold">{t.color2}</label>
                  <div className="relative">
                    <input
                      type="color"
                      value={customHero2}
                      onChange={e => setCustomHero2(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0.5 bg-transparent"
                    />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div
                    className="w-full h-12 rounded-xl shadow-soft"
                    style={{ background: `linear-gradient(135deg, ${customHero1}, ${customHero2})` }}
                  />
                  <button
                    onClick={() => {
                      document.documentElement.style.setProperty('--t-hero', `linear-gradient(150deg, ${customHero1} 0%, ${customHero2} 55%, ${customHero1}CC 100%)`)
                      document.documentElement.style.setProperty('--t-primary', customHero2)
                      document.documentElement.style.setProperty('--t-primary-d', customHero1)
                    }}
                    className="w-full py-1.5 rounded-xl text-xs font-bold bg-forest-700 text-white active:scale-95 transition-transform"
                  >
                    {t.apply}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2">{t.customNote}</p>
            </div>
          )}
        </div>

        {/* Apparence */}
        <Section title={t.appearance}>
          <Row label={t.theme} sub={t.themeSub}>
            <div className="flex gap-1.5">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => updateSettings('theme', t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    settings.theme === t.id
                      ? 'bg-forest-800 text-white'
                      : 'bg-cream-200 dark:bg-night-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </Row>

          <Row label={t.arabicSize} sub={t.arabicSizeSub}>
            <div className="flex gap-1.5">
              {SIZES.map(s => (
                <button
                  key={s.id}
                  onClick={() => updateSettings('arabicSize', s.id)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                    settings.arabicSize === s.id
                      ? 'bg-forest-800 text-white'
                      : 'bg-cream-200 dark:bg-night-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* Fond d'écran mode immersif */}
        <Section title="Fond d'écran (mode immersif)">
          <div className="px-4 py-4">
            <p className="text-xs text-gray-400 mb-3">
              Affiché pendant les sessions. "Auto" suit la période (matin / soir).
            </p>
            <div className="grid grid-cols-4 gap-2">
              {/* Option Auto */}
              <button
                onClick={() => updateSettings('sessionBg', 'auto')}
                className={`relative flex flex-col items-center gap-1 rounded-xl overflow-hidden border-2 transition-all ${
                  (settings.sessionBg ?? 'auto') === 'auto'
                    ? 'border-forest-700 ring-2 ring-forest-500/30'
                    : 'border-cream-200 dark:border-white/10'
                }`}
              >
                <div className="w-full aspect-[9/13] bg-gradient-to-b from-amber-100 to-amber-300 dark:from-night-700 dark:to-night-900 flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
                <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 pb-1 px-1 text-center leading-tight">
                  Auto
                </span>
                {(settings.sessionBg ?? 'auto') === 'auto' && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-forest-700 rounded-full flex items-center justify-center">
                    <Check size={9} className="text-white" />
                  </div>
                )}
              </button>

              {/* Backgrounds */}
              {BG_THEMES.map(bg => (
                <button
                  key={bg.id}
                  onClick={() => updateSettings('sessionBg', bg.id)}
                  className={`relative flex flex-col items-center gap-1 rounded-xl overflow-hidden border-2 transition-all ${
                    settings.sessionBg === bg.id
                      ? 'border-forest-700 ring-2 ring-forest-500/30'
                      : 'border-cream-200 dark:border-white/10'
                  }`}
                >
                  <div className="w-full aspect-[9/13] overflow-hidden">
                    <img
                      src={bg.fileMobile}
                      alt={bg.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 pb-1 px-1 text-center leading-tight">
                    {bg.label}
                  </span>
                  {settings.sessionBg === bg.id && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-forest-700 rounded-full flex items-center justify-center">
                      <Check size={9} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Affichage */}
        <Section title={t.display}>
          <Row label={t.showTranslit} sub={t.showTranslitSub}>
            <Toggle value={settings.showTranslit} onChange={v => updateSettings('showTranslit', v)} />
          </Row>
          <Row label={t.showTranslat} sub={t.showTranslatSub}>
            <Toggle value={settings.showTranslation} onChange={v => updateSettings('showTranslation', v)} />
          </Row>
          <Row label={t.showMerit} sub={t.showMeritSub}>
            <Toggle value={settings.showMerit} onChange={v => updateSettings('showMerit', v)} />
          </Row>
        </Section>

        {/* Audio & Retour haptique */}
        <Section title={t.audio}>
          <Row label={t.autoplay} sub={t.autoplaySub}>
            <Toggle value={settings.audioAutoplay} onChange={v => updateSettings('audioAutoplay', v)} />
          </Row>
          <Row label={t.vibration} sub={t.vibrationSub}>
            <Toggle value={settings.vibration} onChange={v => updateSettings('vibration', v)} />
          </Row>
        </Section>

        {/* Rappels */}
        <Section title={t.reminders}>
          <Row
            label={t.morningReminder}
            sub={settings.morningReminderEnabled ? `${t.enabledAt} ${settings.morningReminderTime}` : t.disabled}
          >
            <Toggle
              value={settings.morningReminderEnabled}
              onChange={v => handleReminderToggle('morning', v)}
            />
          </Row>
          {settings.morningReminderEnabled && (
            <Row label={t.morningTime}>
              <input
                type="time"
                value={settings.morningReminderTime}
                onChange={e => {
                  updateSettings('morningReminderTime', e.target.value)
                  scheduleReminder('morning', e.target.value)
                }}
                className="bg-cream-100 dark:bg-night-700 border border-cream-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-semibold text-gray-800 dark:text-cream-100"
              />
            </Row>
          )}
          <Row
            label={t.eveningReminder}
            sub={settings.eveningReminderEnabled ? `${t.enabledAt} ${settings.eveningReminderTime}` : t.disabled}
          >
            <Toggle
              value={settings.eveningReminderEnabled}
              onChange={v => handleReminderToggle('evening', v)}
            />
          </Row>
          {settings.eveningReminderEnabled && (
            <Row label={t.eveningTime}>
              <input
                type="time"
                value={settings.eveningReminderTime}
                onChange={e => {
                  updateSettings('eveningReminderTime', e.target.value)
                  scheduleReminder('evening', e.target.value)
                }}
                className="bg-cream-100 dark:bg-night-700 border border-cream-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm font-semibold text-gray-800 dark:text-cream-100"
              />
            </Row>
          )}

          {/* Notifications horaires de prière */}
          <Row
            label={settings.language === 'en' ? 'Prayer time notifications' : 'Notifications heures de prière'}
            sub={settings.language === 'en'
              ? 'Alert at Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ (app must be open)'
              : 'Alerte à Fajr, Dhuhr, ʿAsr, Maghrib, ʿIshāʾ (l\'app doit être ouverte)'}
          >
            <Toggle
              value={settings.prayerNotificationsEnabled}
              onChange={async v => {
                if (v) {
                  const granted = await requestPermission()
                  if (!granted) return
                }
                updateSettings('prayerNotificationsEnabled', v)
              }}
            />
          </Row>
        </Section>

        {/* Preview arabe */}
        <Section title={t.arabicPreview}>
          <div className="px-5 py-5">
            <p
              className={`font-arabic text-right dir-rtl leading-loose text-gray-900 dark:text-cream-100 ${
                { md: 'text-2xl', lg: 'text-3xl', xl: 'text-[2.1rem]', '2xl': 'text-[2.5rem]' }[settings.arabicSize]
              }`}
              dir="rtl"
            >
              بِسْمِ اللهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            {settings.showTranslit && (
              <p className="text-sm italic text-gray-400 mt-2">Bismillâhi r-Rahmâni r-Rahîm</p>
            )}
            {settings.showTranslation && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {settings.language === 'en'
                  ? 'In the name of Allah, the Most Gracious, the Most Merciful.'
                  : 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.'}
              </p>
            )}
          </div>
        </Section>

        {/* Langue */}
        <Section title={t.language}>
          <Row label={t.language} sub={t.languageSub}>
            <div className="flex gap-1.5">
              {(['fr', 'en'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => updateSettings('language', l)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    settings.language === l
                      ? 'bg-forest-800 text-white'
                      : 'bg-cream-200 dark:bg-night-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {l === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
                </button>
              ))}
            </div>
          </Row>
        </Section>

        {/* Progression */}
        <Section title={t.progress}>
          <Row label={t.resetProgress} sub={t.resetProgressSub}>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 dark:text-gray-500 bg-cream-100 dark:bg-night-700 hover:text-red-400 transition-colors"
              >
                <RotateCcw size={13} /> {t.resetBtn}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cream-100 dark:bg-night-700 text-gray-400"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-500/20"
                >
                  {t.confirm}
                </button>
              </div>
            )}
          </Row>
          {resetDone && (
            <div className="px-5 py-2 text-xs text-forest-600 dark:text-forest-400 font-semibold">
              {t.resetDone}
            </div>
          )}
        </Section>

        {/* About */}
        <div className="text-center pb-6 pt-2 text-xs text-gray-300 dark:text-gray-600">
          <p className="font-semibold">{t.about}</p>
          <p className="mt-1">{t.aboutContent}</p>
          <p className="mt-0.5">{t.aboutDev}</p>
          <p className="mt-0.5">{t.aboutWith}</p>
        </div>
      </div>
    </div>
  )
}
