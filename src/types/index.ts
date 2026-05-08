// ─── Core Data Types ──────────────────────────────────────────────────────────

export type Period = 'morning' | 'evening' | 'both'

export type AdhkarCategory =
  | 'protection'
  | 'praise'
  | 'forgiveness'
  | 'gratitude'
  | 'tawakkul'
  | 'morning'
  | 'evening'
  | 'faith'
  | 'supplication'

export type NeedTag =
  | 'protection'
  | 'apaisement'
  | 'pardon'
  | 'gratitude'
  | 'tawakkul'
  | 'baraka'
  | 'anxiete'
  | 'foi'

export interface AdhkarItem {
  id: string
  number: number
  title: string
  titleAr: string
  period: Period
  category: AdhkarCategory
  repeat: number
  arabic: string
  transliteration: string
  translationFr: string
  translationEn?: string
  merit?: string
  meritEn?: string
  source?: string
  tags: NeedTag[]
  audioArabicUrl?: string
  audioFrenchUrl?: string
  isEssential?: boolean      // used in "2 min mode"
  isQuran?: boolean          // true = Quranic text → apply tajweed colors
  subItems?: AdhkarSubItem[] // for tasbih multi-formula
}

export interface AdhkarSubItem {
  arabic: string
  transliteration: string
  translationFr: string
  repeat: number
}

// ─── User Progress ────────────────────────────────────────────────────────────

export interface DayProgress {
  date: string            // ISO date "2024-01-15"
  morningDone: boolean
  eveningDone: boolean
  morningCount: number    // nb adhkar completed (morning)
  eveningCount: number    // nb adhkar completed (evening)
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastCompletedDate: string | null
  history: DayProgress[]
}

// ─── Session State ────────────────────────────────────────────────────────────

export interface SessionState {
  period: Period
  currentIndex: number
  counters: Record<string, number>   // adhkarId -> current count
  completed: string[]                // completed adhkar ids
  startedAt: string | null
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export type ThemeMode   = 'light' | 'dark' | 'auto'
export type ArabicSize  = 'md' | 'lg' | 'xl' | '2xl'
export type ReadingMode = 'immersive' | 'cards'
export type ColorTheme  = 'parchemin' | 'perle' | 'emeraude' | 'saphir' | 'rose-sable' | 'nuit' | 'pourpre' | 'cuivre' | 'turquoise' | 'ardoise'
export type Language    = 'fr' | 'en'

export interface AppSettings {
  language: Language
  theme: ThemeMode
  colorTheme: ColorTheme
  arabicSize: ArabicSize
  showTranslit: boolean
  showTranslation: boolean
  showMerit: boolean
  readingMode: ReadingMode
  vibration: boolean
  audioAutoplay: boolean
  morningReminderEnabled: boolean
  morningReminderTime: string      // "07:00"
  eveningReminderEnabled: boolean
  eveningReminderTime: string      // "20:00"
  favoritesIds: string[]
  sessionBg: string                // bg id ou 'auto'
  prayerCity: PrayerCity           // ville pour le calcul des horaires de prière (Aladhan)
}

// ─── Audio ────────────────────────────────────────────────────────────────────

export interface AudioState {
  isPlaying: boolean
  currentId: string | null
  duration: number
  currentTime: number
  isLoading: boolean
  error: string | null
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export type TabId = 'home' | 'session' | 'browse' | 'need' | 'settings'

// ─── Prayer Times (Aladhan API) ───────────────────────────────────────────────

export interface PrayerCity {
  name:      string
  country:   string
  latitude:  number
  longitude: number
  /** Aladhan calculation method ID. 12 = UOIF (France) par défaut. */
  method:    number
}

export interface PrayerTimesData {
  date: string                    // ISO "YYYY-MM-DD"
  city: PrayerCity
  timings: {
    fajr:     string              // "HH:MM"
    sunrise:  string
    dhuhr:    string
    asr:      string
    maghrib:  string
    isha:     string
    imsak?:   string
    midnight?: string
  }
  hijri?: {
    day:       string
    monthEn:   string
    monthAr:   string
    year:      string
    formatted: string             // "20 Dhū al-Qaʿdah 1447 AH"
  }
}
