import { useState } from 'react'
import { Bell, Moon, Sun, Monitor, Type, Eye, EyeOff, Vibrate, Volume2, RotateCcw } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { requestPermission, scheduleReminder, cancelReminder } from '../services/notificationService'
import { resetAllProgress } from '../services/storageService'
import type { ThemeMode, ArabicSize, ColorTheme } from '../types'

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
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetDone,    setResetDone]    = useState(false)

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
    { id: 'light',  label: 'Clair',   icon: <Sun size={16} /> },
    { id: 'dark',   label: 'Sombre',  icon: <Moon size={16} /> },
    { id: 'auto',   label: 'Auto',    icon: <Monitor size={16} /> },
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
        <h1 className="text-xl font-display font-bold text-gray-900 dark:text-cream-100">Réglages</h1>
      </div>

      <div className="pt-5 px-4">
        {/* Palette de couleurs */}
        <div className="mb-6">
          <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-5 mb-3">
            Palette de couleurs
          </h2>
          <div className="flex gap-3 px-1 flex-wrap">
            {COLOR_THEMES.map(t => {
              const active = (settings.colorTheme ?? 'parchemin') === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => updateSettings('colorTheme', t.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                    active ? 'ring-2 ring-offset-2 ring-gold-500 scale-105' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl shadow-soft"
                    style={{ background: t.hero }}
                  />
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Apparence */}
        <Section title="Apparence">
          <Row label="Thème" sub="Choisir le mode d'affichage">
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

          <Row label="Taille du texte arabe" sub="Ajuster selon votre préférence">
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

        {/* Affichage */}
        <Section title="Affichage">
          <Row label="Afficher la translittération" sub="Texte phonétique latin">
            <Toggle value={settings.showTranslit} onChange={v => updateSettings('showTranslit', v)} />
          </Row>
          <Row label="Afficher la traduction" sub="Traduction française">
            <Toggle value={settings.showTranslation} onChange={v => updateSettings('showTranslation', v)} />
          </Row>
          <Row label="Afficher les mérites" sub="Bénéfices de chaque invocation">
            <Toggle value={settings.showMerit} onChange={v => updateSettings('showMerit', v)} />
          </Row>
        </Section>

        {/* Audio & Retour haptique */}
        <Section title="Audio & Retour haptique">
          <Row label="Lecture automatique" sub="Jouer l'audio au changement d'invocation">
            <Toggle value={settings.audioAutoplay} onChange={v => updateSettings('audioAutoplay', v)} />
          </Row>
          <Row label="Vibrations" sub="Retour haptique lors du compteur">
            <Toggle value={settings.vibration} onChange={v => updateSettings('vibration', v)} />
          </Row>
        </Section>

        {/* Rappels */}
        <Section title="Rappels">
          <Row
            label="Rappel du matin ☀️"
            sub={settings.morningReminderEnabled ? `Activé à ${settings.morningReminderTime}` : 'Désactivé'}
          >
            <Toggle
              value={settings.morningReminderEnabled}
              onChange={v => handleReminderToggle('morning', v)}
            />
          </Row>
          {settings.morningReminderEnabled && (
            <Row label="Heure du rappel matin">
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
            label="Rappel du soir 🌙"
            sub={settings.eveningReminderEnabled ? `Activé à ${settings.eveningReminderTime}` : 'Désactivé'}
          >
            <Toggle
              value={settings.eveningReminderEnabled}
              onChange={v => handleReminderToggle('evening', v)}
            />
          </Row>
          {settings.eveningReminderEnabled && (
            <Row label="Heure du rappel soir">
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
        </Section>

        {/* Preview arabe */}
        <Section title="Aperçu du texte arabe">
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
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.</p>
            )}
          </div>
        </Section>

        {/* Progression */}
        <Section title="Progression">
          <Row label="Réinitialiser l'avancement" sub="Remet les sessions matin et soir à zéro">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-400 dark:text-gray-500 bg-cream-100 dark:bg-night-700 hover:text-red-400 transition-colors"
              >
                <RotateCcw size={13} /> Reset
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cream-100 dark:bg-night-700 text-gray-400"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-500/20"
                >
                  Confirmer
                </button>
              </div>
            )}
          </Row>
          {resetDone && (
            <div className="px-5 py-2 text-xs text-forest-600 dark:text-forest-400 font-semibold">
              ✓ Avancement remis à zéro
            </div>
          )}
        </Section>

        {/* About */}
        <div className="text-center pb-6 pt-2 text-xs text-gray-300 dark:text-gray-600">
          <p className="font-semibold">Adhkar Companion v1.0</p>
          <p className="mt-1">Contenu : Mes Adhkar du Matin et du Soir — QURAN TIME</p>
          <p className="mt-0.5">Développé avec ❤️ pour la Oumma</p>
          <p className="mt-0.5">Avec DuoPédago®</p>
        </div>
      </div>
    </div>
  )
}
