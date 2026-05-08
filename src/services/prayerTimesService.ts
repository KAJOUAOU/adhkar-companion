/**
 * Prayer Times Service — Aladhan API client + caching
 *
 * Source : https://aladhan.com/prayer-times-api (API publique, gratuite, sans clé)
 *
 * Stratégie de cache : on stocke la réponse de chaque jour dans localStorage
 * sous la clé `prayer_times_<YYYY-MM-DD>_<lat>_<lng>_<method>`. Les données
 * d'un jour donné ne changent jamais — donc on peut servir hors-ligne sans
 * limite de fraîcheur. Les anciennes entrées sont nettoyées au-delà de 7 jours.
 */

import type { PrayerCity, PrayerTimesData } from '../types'

const ALADHAN_BASE = 'https://api.aladhan.com/v1/timings'
const CACHE_PREFIX = 'prayer_times_'
const CACHE_MAX_DAYS = 7

// ─── Default city : Angers, France ──────────────────────────────────────────
export const DEFAULT_CITY: PrayerCity = {
  name: 'Angers',
  country: 'France',
  latitude: 47.4784,
  longitude: -0.5632,
  method: 12, // UOIF — France (Union des Organisations Islamiques de France)
}

// ─── Quelques préréglages utiles si l'utilisateur change de ville plus tard ─
export const PRESET_CITIES: PrayerCity[] = [
  { name: 'Angers',      country: 'France',  latitude: 47.4784, longitude: -0.5632, method: 12 },
  { name: 'Paris',       country: 'France',  latitude: 48.8566, longitude:  2.3522, method: 12 },
  { name: 'Lyon',        country: 'France',  latitude: 45.7640, longitude:  4.8357, method: 12 },
  { name: 'Marseille',   country: 'France',  latitude: 43.2965, longitude:  5.3698, method: 12 },
  { name: 'Toulouse',    country: 'France',  latitude: 43.6047, longitude:  1.4442, method: 12 },
  { name: 'Lille',       country: 'France',  latitude: 50.6292, longitude:  3.0573, method: 12 },
  { name: 'Bordeaux',    country: 'France',  latitude: 44.8378, longitude: -0.5792, method: 12 },
  { name: 'Nantes',      country: 'France',  latitude: 47.2184, longitude: -1.5536, method: 12 },
  { name: 'Strasbourg',  country: 'France',  latitude: 48.5734, longitude:  7.7521, method: 12 },
  { name: 'Bruxelles',   country: 'Belgique', latitude: 50.8503, longitude:  4.3517, method: 3  },
  { name: 'Genève',      country: 'Suisse',  latitude: 46.2044, longitude:  6.1432, method: 3  },
  { name: 'Montréal',    country: 'Canada',  latitude: 45.5019, longitude: -73.5674, method: 2 },
  { name: 'La Mecque',   country: 'Arabie Saoudite', latitude: 21.4225, longitude: 39.8262, method: 4 },
  { name: 'Médine',      country: 'Arabie Saoudite', latitude: 24.5247, longitude: 39.5692, method: 4 },
  { name: 'Casablanca',  country: 'Maroc',   latitude: 33.5731, longitude: -7.5898, method: 21 },
  { name: 'Alger',       country: 'Algérie', latitude: 36.7538, longitude:  3.0588, method: 19 },
  { name: 'Tunis',       country: 'Tunisie', latitude: 36.8065, longitude: 10.1815, method: 5  },
  { name: 'Istanbul',    country: 'Turquie', latitude: 41.0082, longitude: 28.9784, method: 13 },
  { name: 'Le Caire',    country: 'Égypte',  latitude: 30.0444, longitude: 31.2357, method: 5  },
  { name: 'Londres',     country: 'UK',      latitude: 51.5074, longitude: -0.1278, method: 3  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function todayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildCacheKey(date: string, city: PrayerCity): string {
  return `${CACHE_PREFIX}${date}_${city.latitude}_${city.longitude}_${city.method}`
}

function readCache(date: string, city: PrayerCity): PrayerTimesData | null {
  try {
    const raw = localStorage.getItem(buildCacheKey(date, city))
    if (!raw) return null
    return JSON.parse(raw) as PrayerTimesData
  } catch {
    return null
  }
}

function writeCache(date: string, city: PrayerCity, data: PrayerTimesData): void {
  try {
    localStorage.setItem(buildCacheKey(date, city), JSON.stringify(data))
  } catch {
    // Storage plein ou désactivé — on ignore silencieusement
  }
}

function pruneOldCache(): void {
  try {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - CACHE_MAX_DAYS)
    const cutoffStr = cutoff.toISOString().split('T')[0]
    const toDelete: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!k || !k.startsWith(CACHE_PREFIX)) continue
      // Format : prayer_times_YYYY-MM-DD_lat_lng_method
      const date = k.slice(CACHE_PREFIX.length, CACHE_PREFIX.length + 10)
      if (date < cutoffStr) toDelete.push(k)
    }
    toDelete.forEach(k => localStorage.removeItem(k))
  } catch { /* noop */ }
}

// ─── Fetch d'une journée ─────────────────────────────────────────────────────
export async function fetchPrayerTimes(city: PrayerCity = DEFAULT_CITY, date?: string): Promise<PrayerTimesData> {
  const dateKey = date || todayKey()

  // 1. Cache hit
  const cached = readCache(dateKey, city)
  if (cached) return cached

  // 2. Fetch depuis Aladhan — format date attendu : DD-MM-YYYY
  const [y, m, d] = dateKey.split('-')
  const apiDate = `${d}-${m}-${y}`
  const url = `${ALADHAN_BASE}/${apiDate}?latitude=${city.latitude}&longitude=${city.longitude}&method=${city.method}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`)
  const json = await res.json()

  if (!json?.data?.timings) throw new Error('Aladhan API: réponse invalide')

  const t = json.data.timings as Record<string, string>
  const hijri = json.data.date?.hijri

  // Aladhan retourne les horaires sous la forme "06:23 (CEST)" — on garde HH:MM
  const stripTz = (s: string) => s.split(' ')[0]

  const data: PrayerTimesData = {
    date: dateKey,
    city,
    timings: {
      fajr:    stripTz(t.Fajr),
      sunrise: stripTz(t.Sunrise),
      dhuhr:   stripTz(t.Dhuhr),
      asr:     stripTz(t.Asr),
      maghrib: stripTz(t.Maghrib),
      isha:    stripTz(t.Isha),
      imsak:   stripTz(t.Imsak),
      midnight: t.Midnight ? stripTz(t.Midnight) : undefined,
    },
    hijri: hijri ? {
      day:        hijri.day,
      monthEn:    hijri.month?.en ?? '',
      monthAr:    hijri.month?.ar ?? '',
      year:       hijri.year,
      formatted:  `${hijri.day} ${hijri.month?.en ?? ''} ${hijri.year} AH`,
    } : undefined,
  }

  writeCache(dateKey, city, data)
  pruneOldCache()
  return data
}

// ─── Helpers temps réel ──────────────────────────────────────────────────────

export interface NextPrayer {
  name: string                  // 'fajr' | 'sunrise' | ... (lowercase id)
  label: string                 // 'Fajr' | 'Lever' | ...
  time: string                  // 'HH:MM'
  remaining: { hours: number; minutes: number; totalMinutes: number }
  isTomorrow: boolean
}

const PRAYER_ORDER: { id: keyof PrayerTimesData['timings']; label: string }[] = [
  { id: 'fajr',    label: 'Fajr' },
  { id: 'sunrise', label: 'Lever' },
  { id: 'dhuhr',   label: 'Dhuhr' },
  { id: 'asr',     label: 'ʿAsr' },
  { id: 'maghrib', label: 'Maghrib' },
  { id: 'isha',    label: 'ʿIshāʾ' },
]

/** Convertit "HH:MM" en minutes depuis minuit. */
function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function getNextPrayer(data: PrayerTimesData, now: Date = new Date()): NextPrayer {
  const nowMin = now.getHours() * 60 + now.getMinutes()
  for (const p of PRAYER_ORDER) {
    const t = data.timings[p.id]
    if (!t) continue
    const m = toMinutes(t)
    if (m > nowMin) {
      const diff = m - nowMin
      return {
        name: p.id,
        label: p.label,
        time: t,
        remaining: { hours: Math.floor(diff / 60), minutes: diff % 60, totalMinutes: diff },
        isTomorrow: false,
      }
    }
  }
  // Toutes les prières du jour sont passées → Fajr de demain
  const fajr = data.timings.fajr
  const m = toMinutes(fajr) + 24 * 60
  const diff = m - nowMin
  return {
    name: 'fajr',
    label: 'Fajr',
    time: fajr,
    remaining: { hours: Math.floor(diff / 60), minutes: diff % 60, totalMinutes: diff },
    isTomorrow: true,
  }
}

/**
 * Détermine si la fenêtre courante est "matin" ou "soir" selon les horaires de prière.
 *
 * Convention adoptée (largement consensuelle parmi les savants) :
 *   - **Adhkar du matin** : entre Fajr et Dhuhr (idéalement avant le Sunrise mais
 *     toléré jusqu'à Dhuhr).
 *   - **Adhkar du soir**  : entre ʿAsr et Maghrib (idéalement) et toléré jusqu'à
 *     l'aube (Fajr du jour suivant).
 *   - Avant Fajr : on considère encore "soir" (la nuit est temps de soir).
 */
export function getPeriodFromPrayerTimes(data: PrayerTimesData, now: Date = new Date()): 'morning' | 'evening' {
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const fajr   = toMinutes(data.timings.fajr)
  const dhuhr  = toMinutes(data.timings.dhuhr)
  // Matin : Fajr ≤ now < Dhuhr
  if (nowMin >= fajr && nowMin < dhuhr) return 'morning'
  return 'evening'
}
