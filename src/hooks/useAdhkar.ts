import { useState, useCallback, useMemo } from 'react'
import type { SessionState, Period } from '../types'
import { getAdhkarByPeriod } from '../data/adhkar'
import { loadSession, saveSession, resetSession } from '../services/storageService'

export function useAdhkar(period: 'morning' | 'evening') {
  const adhkarList = useMemo(() => getAdhkarByPeriod(period), [period])

  const [session, setSession] = useState<SessionState>(() => {
    const saved = loadSession(period)
    // If saved session is for a different period, reset
    if (saved.period !== period) return { period, currentIndex: 0, counters: {}, completed: [], startedAt: null }
    return saved
  })

  const currentAdhkar = adhkarList[session.currentIndex] ?? null
  const totalItems     = adhkarList.length
  const completedCount = session.completed.length

  const isItemDone = useCallback((id: string) => {
    return session.completed.includes(id)
  }, [session.completed])

  const getCounter = useCallback((id: string): number => {
    return session.counters[id] ?? 0
  }, [session.counters])

  const tap = useCallback(() => {
    if (!currentAdhkar) return false
    const target = currentAdhkar.repeat

    // Outer read — used for return value only (correct in manual/sync calls)
    const currentOuter = session.counters[currentAdhkar.id] ?? 0
    if (currentOuter >= target) return false
    const done = (currentOuter + 1) >= target

    // Inner update reads from prev — always correct even from async audio callbacks
    setSession(prev => {
      const prevCount = prev.counters[currentAdhkar.id] ?? 0
      if (prevCount >= target) return prev   // guard: never exceed target
      const newCount = prevCount + 1
      const isDone   = newCount >= target
      const next: SessionState = {
        ...prev,
        counters:  { ...prev.counters, [currentAdhkar.id]: newCount },
        completed: isDone && !prev.completed.includes(currentAdhkar.id)
          ? [...prev.completed, currentAdhkar.id]
          : prev.completed,
        startedAt: prev.startedAt ?? new Date().toISOString(),
      }
      saveSession(next)
      return next
    })

    return done
  }, [currentAdhkar, session.counters])

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= totalItems) return
    setSession(prev => {
      const next = { ...prev, currentIndex: index }
      saveSession(next)
      return next
    })
  }, [totalItems])

  const next = useCallback(() => {
    if (session.currentIndex < totalItems - 1) {
      goTo(session.currentIndex + 1)
      return true
    }
    return false
  }, [session.currentIndex, totalItems, goTo])

  const prev = useCallback(() => {
    if (session.currentIndex > 0) {
      goTo(session.currentIndex - 1)
      return true
    }
    return false
  }, [session.currentIndex, goTo])

  const markDone = useCallback((id: string) => {
    setSession(prev => {
      if (prev.completed.includes(id)) return prev
      const next = { ...prev, completed: [...prev.completed, id] }
      saveSession(next)
      return next
    })
  }, [])

  const resetCounter = useCallback((id: string) => {
    setSession(prev => {
      const next: SessionState = {
        ...prev,
        counters:  { ...prev.counters, [id]: 0 },
        completed: prev.completed.filter(c => c !== id),
      }
      saveSession(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    resetSession(period)
    setSession({ period, currentIndex: 0, counters: {}, completed: [], startedAt: null })
  }, [period])

  const isAllDone = completedCount >= totalItems && totalItems > 0
  const progress  = totalItems > 0 ? completedCount / totalItems : 0

  return {
    adhkarList,
    session,
    currentAdhkar,
    currentIndex: session.currentIndex,
    totalItems,
    completedCount,
    isItemDone,
    getCounter,
    tap,
    goTo,
    next,
    prev,
    markDone,
    resetCounter,
    reset,
    isAllDone,
    progress,
  }
}

// For "2 min mode"
export function useEssentialAdhkar(period: 'morning' | 'evening') {
  const allList = useMemo(() => {
    return getAdhkarByPeriod(period).filter(a => a.isEssential)
  }, [period])
  return allList
}
