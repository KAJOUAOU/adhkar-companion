import { useState, useRef, useCallback, useEffect } from 'react'
import type { AudioState } from '../types'

interface RepeatCtx {
  remaining: number
  onEachEnd: () => void
  onAllDone: () => void
}

export function useAudio() {
  const audioRef        = useRef<HTMLAudioElement | null>(null)
  const repeatCtxRef    = useRef<RepeatCtx | null>(null)
  const manualEndCbRef  = useRef<(() => void) | null>(null)
  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    currentId: null,
    duration:  0,
    currentTime: 0,
    isLoading: false,
    error:     null,
  })

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audioRef.current = audio

    const handlers = {
      loadstart:      () => setState(s => ({ ...s, isLoading: true, error: null })),
      canplay:        () => setState(s => ({ ...s, isLoading: false })),
      play:           () => setState(s => ({ ...s, isPlaying: true })),
      pause:          () => setState(s => ({ ...s, isPlaying: false })),
      ended: () => {
        setState(s => ({ ...s, isPlaying: false, currentTime: 0 }))
        const ctx = repeatCtxRef.current
        if (ctx) {
          ctx.onEachEnd()
          if (ctx.remaining > 0) {
            ctx.remaining--
            const a = audioRef.current
            if (a) { a.currentTime = 0; a.play().catch(() => {}) }
          } else {
            repeatCtxRef.current = null
            setTimeout(() => ctx.onAllDone(), 400)
          }
        } else {
          // Mode manuel : fire le callback de fin si défini
          manualEndCbRef.current?.()
        }
      },
      timeupdate:     () => setState(s => ({ ...s, currentTime: audio.currentTime })),
      durationchange: () => setState(s => ({ ...s, duration: audio.duration || 0 })),
      error:          () => setState(s => ({ ...s, isLoading: false, error: "Audio indisponible", isPlaying: false })),
    }

    Object.entries(handlers).forEach(([evt, fn]) => audio.addEventListener(evt, fn as EventListener))
    return () => {
      Object.entries(handlers).forEach(([evt, fn]) => audio.removeEventListener(evt, fn as EventListener))
      audio.pause()
      audio.src = ''
    }
  }, [])

  const play = useCallback(async (id: string, url: string) => {
    const audio = audioRef.current
    if (!audio) return

    // If same track, toggle pause/play
    if (state.currentId === id) {
      if (audio.paused) {
        try { await audio.play() } catch {}
      } else {
        audio.pause()
      }
      return
    }

    // New track
    audio.pause()
    audio.src    = url
    audio.currentTime = 0
    setState(s => ({ ...s, currentId: id, isLoading: true, error: null }))

    try {
      await audio.play()
    } catch {
      setState(s => ({ ...s, error: "Lecture impossible. Vérifiez votre connexion.", isLoading: false }))
    }
  }, [state.currentId])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.src = ''
    setState({ isPlaying: false, currentId: null, duration: 0, currentTime: 0, isLoading: false, error: null })
  }, [])

  const playRepeat = useCallback(async (
    id: string, url: string, times: number,
    onEachEnd: () => void, onAllDone: () => void,
  ) => {
    const audio = audioRef.current
    if (!audio) return
    repeatCtxRef.current = { remaining: times - 1, onEachEnd, onAllDone }
    audio.pause()
    audio.src = url
    audio.currentTime = 0
    setState(s => ({ ...s, currentId: id, isLoading: true, error: null }))
    try {
      await audio.play()
    } catch {
      setState(s => ({ ...s, error: 'Lecture impossible. Vérifiez votre connexion.', isLoading: false }))
      repeatCtxRef.current = null
    }
  }, [])

  const stopRepeat = useCallback(() => {
    repeatCtxRef.current = null
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.src = ''
    setState({ isPlaying: false, currentId: null, duration: 0, currentTime: 0, isLoading: false, error: null })
  }, [])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
  }, [])

  // Web Speech API fallback
  const speak = useCallback((text: string, lang: string = 'ar-SA') => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
    setState(s => ({ ...s, isPlaying: true, currentId: 'tts' }))
    utterance.onend = () => setState(s => ({ ...s, isPlaying: false, currentId: null }))
  }, [])

  const setManualEndCallback = useCallback((cb: (() => void) | null) => {
    manualEndCbRef.current = cb
  }, [])

  return { state, play, stop, playRepeat, stopRepeat, seek, speak, setManualEndCallback }
}
