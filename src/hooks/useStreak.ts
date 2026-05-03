import { useState, useCallback } from 'react'
import type { StreakData } from '../types'
import { loadStreak, saveStreak, markDayProgress } from '../services/storageService'

export function useStreak() {
  const [streak, setStreak] = useState<StreakData>(loadStreak)

  const recordProgress = useCallback((
    period: 'morning' | 'evening',
    completed: number,
    total: number,
  ) => {
    setStreak(prev => {
      const next = markDayProgress(prev, period, completed, total)
      saveStreak(next)
      return next
    })
  }, [])

  const getTodayProgress = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    return streak.history.find(d => d.date === today) ?? null
  }, [streak])

  return { streak, recordProgress, getTodayProgress }
}
