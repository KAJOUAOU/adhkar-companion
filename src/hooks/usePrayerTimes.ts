/**
 * usePrayerTimes — Hook React pour récupérer les horaires de prière du jour.
 *
 * Données fournies :
 *  - `data`        : PrayerTimesData (timings + hijri)
 *  - `next`        : NextPrayer (prochaine prière + temps restant, recalculé chaque minute)
 *  - `loading`     : true tant que la 1ʳᵉ requête n'est pas résolue
 *  - `error`       : message si la requête échoue (mais on conserve le cache si dispo)
 *  - `refresh()`   : force un re-fetch (utile après changement de ville)
 *
 * Le cache est géré au niveau du service (localStorage par jour+ville) — donc
 * la 2ᵉ navigation au cours de la journée est instantanée.
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import type { PrayerCity, PrayerTimesData } from '../types'
import { fetchPrayerTimes, getNextPrayer, DEFAULT_CITY, DEFAULT_METHOD, type NextPrayer } from '../services/prayerTimesService'

interface UsePrayerTimesResult {
  data:    PrayerTimesData | null
  next:    NextPrayer | null
  loading: boolean
  error:   string | null
  refresh: () => void
}

export function usePrayerTimes(city: PrayerCity = DEFAULT_CITY, method: number = DEFAULT_METHOD): UsePrayerTimesResult {
  const [data,    setData]    = useState<PrayerTimesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [next,    setNext]    = useState<NextPrayer | null>(null)
  const [tick,    setTick]    = useState(0)

  // Recalcul "next prayer" toutes les 30 secondes
  const tickRef = useRef<number>()
  useEffect(() => {
    tickRef.current = window.setInterval(() => setTick(t => t + 1), 30_000)
    return () => { if (tickRef.current) window.clearInterval(tickRef.current) }
  }, [])

  // Met à jour `next` quand `data` ou `tick` change
  useEffect(() => {
    if (data) setNext(getNextPrayer(data))
  }, [data, tick])

  // Fonction de chargement (utilisée à l'init et au refresh)
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const d = await fetchPrayerTimes(city, method)
      setData(d)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur de récupération des horaires'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [city.latitude, city.longitude, method])

  useEffect(() => { load() }, [load])

  return { data, next, loading, error, refresh: load }
}
