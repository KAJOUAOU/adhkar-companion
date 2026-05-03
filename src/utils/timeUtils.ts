import type { Period } from '../types'

export function getCurrentPeriod(): Period {
  const h = new Date().getHours()
  // Morning: Fajr-time (~4h) to Dhuhr (~13h)
  if (h >= 4 && h < 13) return 'morning'
  // Evening: Asr-time (~13h) to Isha/night
  return 'evening'
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h >= 4 && h < 7)   return 'Bismillah, debout pour nourrir ton cœur ☀️'
  if (h >= 7 && h < 12)  return 'Un nouveau matin pour nourrir ton âme'
  if (h >= 12 && h < 14) return 'Que ton après-midi soit béni 🌿'
  if (h >= 14 && h < 18) return 'Prends un instant pour ton Seigneur'
  if (h >= 18 && h < 21) return 'Apaise ton âme avant la nuit 🌙'
  return 'Offre à ton cœur ses invocations du soir'
}

export function getPeriodLabel(period: Period): string {
  const labels = {
    morning: 'Matin',
    evening: 'Soir',
    both:    'Matin & Soir',
  }
  return labels[period]
}

export function getPeriodEmoji(period: Period): string {
  return period === 'morning' ? '☀️' : period === 'evening' ? '🌙' : '🌗'
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function isToday(dateStr: string): boolean {
  return dateStr === formatDate(new Date())
}

export function isYesterday(dateStr: string): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return dateStr === formatDate(yesterday)
}

export function getDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return formatDate(d)
}

export function getLast30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) => getDaysAgo(29 - i))
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
