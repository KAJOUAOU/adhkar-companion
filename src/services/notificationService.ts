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
