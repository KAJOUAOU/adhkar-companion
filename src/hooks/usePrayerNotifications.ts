/**
 * Schedule prayer-time notifications quand l'app est ouverte.
 *
 * Ce hook se monte au niveau App et :
 *   - écoute le réglage `prayerNotificationsEnabled`
 *   - écoute les horaires du jour (via usePrayerTimes)
 *   - lance schedulePrayerNotifications() à chaque changement
 *
 * Limitation PWA : si l'utilisateur ferme l'app, les setTimeout sont perdus.
 * Pour un vrai background, il faudra Capacitor (LocalNotifications natives)
 * ou un Web Push backend.
 */
import { useEffect } from 'react'
import { useSettings } from './useSettings'
import { usePrayerTimes } from './usePrayerTimes'
import { schedulePrayerNotifications, cancelPrayerNotifications } from '../services/notificationService'

export function usePrayerNotifications(): void {
  const { settings } = useSettings()
  const { data } = usePrayerTimes(settings.prayerCity, settings.prayerMethod)

  useEffect(() => {
    if (!settings.prayerNotificationsEnabled) {
      cancelPrayerNotifications()
      return
    }
    if (!data) return
    schedulePrayerNotifications(data.timings as unknown as Record<string, string>, settings.language)
    return () => cancelPrayerNotifications()
  }, [
    settings.prayerNotificationsEnabled,
    settings.language,
    data?.timings.fajr,
    data?.timings.dhuhr,
    data?.timings.asr,
    data?.timings.maghrib,
    data?.timings.isha,
  ])
}
