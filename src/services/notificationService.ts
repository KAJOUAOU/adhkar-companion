const MORNING_MESSAGES = [
  '🌿 Un instant pour nourrir ton âme.',
  '☀️ Commence ta journée avec le souvenir d\'Allah.',
  '🤲 Tes adhkar du matin t\'attendent.',
  '🌱 Un nouveau matin, une nouvelle opportunité spirituelle.',
]

const EVENING_MESSAGES = [
  '🌙 Offre à ton cœur ses invocations du soir.',
  '🌿 Apaise ton âme avant la nuit.',
  '🤲 Termine ta journée avec le souvenir d\'Allah.',
  '✨ Quelques minutes pour la paix du cœur.',
]

function randomMessage(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)]
}

export async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator
}

export function scheduleReminder(
  period: 'morning' | 'evening',
  time: string,  // "HH:MM"
): void {
  if (!('Notification' in window)) return
  if (Notification.permission !== 'granted') return

  const [h, m] = time.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(h, m, 0, 0)
  if (target <= now) target.setDate(target.getDate() + 1)

  const delay = target.getTime() - now.getTime()
  const message = period === 'morning' ? randomMessage(MORNING_MESSAGES) : randomMessage(EVENING_MESSAGES)

  const timeoutId = setTimeout(() => {
    new Notification('Adhkar Companion', {
      body:  message,
      icon:  '/icon-192.png',
      badge: '/icon-192.png',
      tag:   `dhikr-${period}`,
    })
    // Re-schedule for next day
    scheduleReminder(period, time)
  }, delay)

  // Store timeout ID for potential cancellation
  const key = `dhikr_timer_${period}`
  const w = window as unknown as Record<string, unknown>
  const existing = w[key]
  if (typeof existing === 'number') clearTimeout(existing)
  w[key] = timeoutId
}

export function cancelReminder(period: 'morning' | 'evening'): void {
  const key = `dhikr_timer_${period}`
  const w = window as unknown as Record<string, unknown>
  const existing = w[key]
  if (typeof existing === 'number') clearTimeout(existing)
}

// ─── Notifications heures de prière ─────────────────────────────────────────

const PRAYER_LABELS_FR: Record<string, string> = {
  fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'ʿAsr', maghrib: 'Maghrib', isha: 'ʿIshāʾ',
}
const PRAYER_LABELS_EN: Record<string, string> = {
  fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr',  maghrib: 'Maghrib', isha: 'Isha',
}

/** Affiche une notification (via service worker si disponible). */
function showNotification(title: string, body: string, tag: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification(title, {
        body,
        icon:  '/icon-192.png',
        badge: '/icon-192.png',
        tag,
      })
    }).catch(() => {
      new Notification(title, { body, icon: '/icon-192.png', tag })
    })
    return
  }
  new Notification(title, { body, icon: '/icon-192.png', tag })
}

/**
 * Planifie une notification pour chaque prière du jour (Fajr, Dhuhr, ʿAsr,
 * Maghrib, ʿIshāʾ). Limitation PWA : ces timers `setTimeout` ne survivent
 * pas à la fermeture de l'app. Pour un vrai planning en arrière-plan, il
 * faudra migrer vers Capacitor (notifications natives Android) ou ajouter
 * un backend Web Push.
 */
export function schedulePrayerNotifications(
  timings: Record<string, string>,
  lang: 'fr' | 'en' = 'fr',
): void {
  cancelPrayerNotifications()
  if (!('Notification' in window) || Notification.permission !== 'granted') return

  const labels = lang === 'en' ? PRAYER_LABELS_EN : PRAYER_LABELS_FR
  const ids: number[] = []

  for (const key of ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const) {
    const time = timings[key]
    if (!time) continue
    const [h, m] = time.split(':').map(Number)
    if (Number.isNaN(h) || Number.isNaN(m)) continue
    const target = new Date()
    target.setHours(h, m, 0, 0)
    if (target.getTime() <= Date.now()) continue
    const delay = target.getTime() - Date.now()
    const id = window.setTimeout(() => {
      showNotification(
        `${labels[key]} · ${time}`,
        lang === 'en' ? "It's time for prayer 🤲" : "C'est l'heure de la prière 🤲",
        `prayer-${key}`,
      )
    }, delay)
    ids.push(id)
  }

  const w = window as unknown as Record<string, unknown>
  w['adhkar_prayer_timer_ids'] = ids
}

export function cancelPrayerNotifications(): void {
  const w = window as unknown as Record<string, unknown>
  const ids = w['adhkar_prayer_timer_ids']
  if (Array.isArray(ids)) {
    for (const id of ids) clearTimeout(id as number)
  }
  w['adhkar_prayer_timer_ids'] = []
}
