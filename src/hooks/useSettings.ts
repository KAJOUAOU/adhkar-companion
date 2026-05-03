import { useState, useCallback, useEffect } from 'react'
import type { AppSettings } from '../types'
import { loadSettings, saveSettings } from '../services/storageService'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(loadSettings)

  // Apply light/dark mode
  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.classList.add('dark')
    } else if (settings.theme === 'light') {
      root.classList.remove('dark')
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      root.classList.toggle('dark', mq.matches)
      const handler = (e: MediaQueryListEvent) => root.classList.toggle('dark', e.matches)
      mq.addEventListener('change', handler)
      return () => mq.removeEventListener('change', handler)
    }
  }, [settings.theme])

  // Apply color theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.colorTheme ?? 'parchemin')
  }, [settings.colorTheme])

  const updateSettings = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      saveSettings(next)
      return next
    })
  }, [])

  const updateMany = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates }
      saveSettings(next)
      return next
    })
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setSettings(prev => {
      const favs = prev.favoritesIds.includes(id)
        ? prev.favoritesIds.filter(f => f !== id)
        : [...prev.favoritesIds, id]
      const next = { ...prev, favoritesIds: favs }
      saveSettings(next)
      return next
    })
  }, [])

  return { settings, updateSettings, updateMany, toggleFavorite }
}
