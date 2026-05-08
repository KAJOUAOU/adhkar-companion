import type { AppSettings, SessionState, StreakData, DayProgress } from '../types'
import { formatDate } from '../utils/timeUtils'
import { DEFAULT_CITY, DEFAULT_METHOD } from './prayerTimesService'

const KEYS = {
  SETTINGS:      'dhikr_settings',
  STREAK:        'dhikr_streak',
  SESSION_M:     'dhikr_session_morning',
  SESSION_E:     'dhikr_session_evening',
  FAVORITES:     'dhikr_favorites',
} as const

// ─── Settings ─────────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: AppSettings = {
  language:                'fr',
  theme:                   'light',
  colorTheme:              'parchemin',
  arabicSize:              'xl',
  showTranslit:            true,
  showTranslation:         true,
  showMerit:               false,
  readingMode:             'immersive',
  vibration:               true,
  audioAutoplay:           false,
  morningReminderEnabled:  false,
  morningReminderTime:     '07:00',
  eveningReminderEnabled:  false,
  eveningReminderTime:     '20:00',
  favoritesIds:            [],
  sessionBg:               'auto',
  prayerCity:              DEFAULT_CITY,
  prayerMethod:            DEFAULT_METHOD,
  prayerNotificationsEnabled: false,
  prayerAdjustments:       { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(s: AppSettings): void {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s))
}

// ─── Session ──────────────────────────────────────────────────────────────────

export const DEFAULT_SESSION: SessionState = {
  period:       'morning',
  currentIndex: 0,
  counters:     {},
  completed:    [],
  startedAt:    null,
}

export function loadSession(period: 'morning' | 'evening'): SessionState {
  try {
    const key = period === 'morning' ? KEYS.SESSION_M : KEYS.SESSION_E
    const raw = localStorage.getItem(key)
    if (!raw) return { ...DEFAULT_SESSION, period }
    return JSON.parse(raw) as SessionState
  } catch {
    return { ...DEFAULT_SESSION, period }
  }
}

export function saveSession(s: SessionState): void {
  const key = s.period === 'morning' ? KEYS.SESSION_M : KEYS.SESSION_E
  localStorage.setItem(key, JSON.stringify(s))
}

export function resetSession(period: 'morning' | 'evening'): void {
  const key = period === 'morning' ? KEYS.SESSION_M : KEYS.SESSION_E
  localStorage.removeItem(key)
}

export function resetAllProgress(): void {
  localStorage.removeItem(KEYS.SESSION_M)
  localStorage.removeItem(KEYS.SESSION_E)
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export const DEFAULT_STREAK: StreakData = {
  currentStreak:     0,
  longestStreak:     0,
  lastCompletedDate: null,
  history:           [],
}

export function loadStreak(): StreakData {
  try {
    const raw = localStorage.getItem(KEYS.STREAK)
    if (!raw) return DEFAULT_STREAK
    return JSON.parse(raw) as StreakData
  } catch {
    return DEFAULT_STREAK
  }
}

export function saveStreak(s: StreakData): void {
  localStorage.setItem(KEYS.STREAK, JSON.stringify(s))
}

export function markDayProgress(
  streak: StreakData,
  period: 'morning' | 'evening',
  count: number,
  total: number
): StreakData {
  const today = formatDate(new Date())
  const existing = streak.history.find(d => d.date === today)

  const updated: DayProgress = existing
    ? { ...existing }
    : { date: today, morningDone: false, eveningDone: false, morningCount: 0, eveningCount: 0 }

  if (period === 'morning') {
    updated.morningDone  = count >= total
    updated.morningCount = count
  } else {
    updated.eveningDone  = count >= total
    updated.eveningCount = count
  }

  const history = [
    ...streak.history.filter(d => d.date !== today),
    updated,
  ].sort((a, b) => a.date.localeCompare(b.date))

  // Compute new streak
  let newStreak = 0
  const sortedDesc = [...history].reverse()
  for (const day of sortedDesc) {
    if (day.morningDone || day.eveningDone) newStreak++
    else break
  }

  return {
    ...streak,
    history,
    currentStreak:     newStreak,
    longestStreak:     Math.max(streak.longestStreak, newStreak),
    lastCompletedDate: updated.morningDone || updated.eveningDone ? today : streak.lastCompletedDate,
  }
}

// ─── Favorites ────────────────────────────────────────────────────────────────

export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.FAVORITES)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveFavorites(ids: string[]): void {
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(ids))
}

export function toggleFavorite(ids: string[], id: string): string[] {
  const next = ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]
  saveFavorites(next)
  return next
}
