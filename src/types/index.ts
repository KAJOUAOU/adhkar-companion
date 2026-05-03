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
  merit?: string
  source?: string
  tags: NeedTag[]
  audioArabicUrl?: string
  audioFrenchUrl?: string
  isEssential?: boolean      // used in "2 min mode"
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
export type ColorTheme  = 'parchemin' | 'perle' | 'emeraude' | 'saphir' | 'rose-sable'

export interface AppSettings {
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
