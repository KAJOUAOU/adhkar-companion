import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, RefreshCw, Compass as CompassIcon, AlertCircle } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { fetchQiblaDirection, DEFAULT_CITY } from '../services/prayerTimesService'
import IslamicPattern from '../components/IslamicPattern'
import SeoHead from '../components/SeoHead'

// iOS expose une API DeviceOrientationEvent.requestPermission()
type DeviceOrientationEventiOS = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

export default function Qibla() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const lang = settings.language
  const city = settings.prayerCity ?? DEFAULT_CITY

  const [qibla,    setQibla]    = useState<number | null>(null)  // angle depuis le nord vrai (0-360°)
  const [heading,  setHeading]  = useState<number | null>(null)  // orientation du téléphone (0-360°)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)
  const [orientationGranted, setOrientationGranted] = useState(false)
  const [orientationSupported, setOrientationSupported] = useState(true)

  const handlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null)

  // Fetch qibla direction
  const loadQibla = async () => {
    setLoading(true)
    setError(null)
    try {
      const dir = await fetchQiblaDirection(city.latitude, city.longitude)
      setQibla(dir)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { loadQibla() }, [city.latitude, city.longitude])

  // Activation orientation (iOS demande une gesture utilisateur)
  const enableOrientation = async () => {
    setError(null)
    const DOE = DeviceOrientationEvent as DeviceOrientationEventiOS
    try {
      if (typeof DOE.requestPermission === 'function') {
        const result = await DOE.requestPermission()
        if (result !== 'granted') {
          setError(lang === 'en' ? 'Permission denied for compass.' : 'Permission refusée pour la boussole.')
          return
        }
      }
      // Attache l'événement
      const handler = (e: DeviceOrientationEvent) => {
        // iOS : webkitCompassHeading donne l'orientation par rapport au nord magnétique
        // (déjà calibré)
        const wkHeading = (e as any).webkitCompassHeading
        if (typeof wkHeading === 'number') {
          setHeading(wkHeading)
          return
        }
        // Android : alpha = rotation autour de Z, 0 = nord pour la plupart des
        // navigateurs si event.absolute est true. Sinon, c'est relatif.
        if (typeof e.alpha === 'number') {
          setHeading(360 - e.alpha)
        }
      }
      handlerRef.current = handler
      window.addEventListener('deviceorientationabsolute', handler as any, true)
      window.addEventListener('deviceorientation', handler, true)
      setOrientationGranted(true)
    } catch (e) {
      setOrientationSupported(false)
      setError(
        lang === 'en'
          ? 'Compass not supported on this device.'
          : 'Boussole non supportée par cet appareil.'
      )
    }
  }

  useEffect(() => {
    return () => {
      if (handlerRef.current) {
        window.removeEventListener('deviceorientationabsolute', handlerRef.current as any, true)
        window.removeEventListener('deviceorientation', handlerRef.current, true)
      }
    }
  }, [])

  // Calcul de l'angle relatif de la flèche : qibla - heading
  // Si on connait le heading, la flèche pointe vers (qibla - heading) sur l'écran.
  // Si on ne connait pas le heading (boussole pas activée), on affiche la qibla
  // par rapport au nord en haut.
  const arrowAngle = qibla !== null
    ? heading !== null
      ? ((qibla - heading) + 360) % 360
      : qibla
    : 0

  return (
    <div className="h-dvh flex flex-col overflow-hidden" style={{ background: 'var(--t-body-bg, #FAF7EE)' }}>
      <SeoHead
        title="Qibla — Direction de la Kaaba | Adhkar Companion"
        description="Boussole Qibla : direction exacte vers la Kaaba à La Mecque. Calcul automatique selon votre position. Boussole interactive avec orientation du téléphone."
        canonical="/qibla"
        keywords="qibla, kaaba, mecque, boussole islamique, direction prière, qibla compass"
      />

      {/* Header */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{
          background: 'var(--t-hero, linear-gradient(150deg,#6E5010,#8B6914))',
          paddingTop:    'max(env(safe-area-inset-top, 0px), 30px)',
          paddingBottom: 16,
          paddingLeft:   20,
          paddingRight:  20,
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <IslamicPattern className="text-white" opacity={0.10} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 transition-colors"
              style={{ color: 'rgba(255,255,255,0.70)' }}
            >
              <ArrowLeft size={18} />
              <span className="text-sm">{lang === 'en' ? 'Back' : 'Retour'}</span>
            </button>
            <button
              onClick={loadQibla}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15"
              style={{ color: 'rgba(255,255,255,0.85)' }}
              disabled={loading}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span className="text-xs">{lang === 'en' ? 'Refresh' : 'Actualiser'}</span>
            </button>
          </div>

          <h1 className="text-2xl font-display font-bold leading-tight" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>
            {lang === 'en' ? 'Qibla direction' : 'Direction de la Qibla'}
          </h1>
          <p className="text-sm font-semibold mt-1 opacity-85" style={{ color: 'var(--t-hero-text,#2C1A06)' }}>
            <MapPin size={13} className="inline -mt-0.5 mr-1" />
            {city.name}, {city.country}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-5 py-6 space-y-5">

        {/* Compass */}
        <div className="flex justify-center">
          <div className="relative w-[280px] h-[280px]">
            {/* Cercle extérieur avec graduations */}
            <svg viewBox="0 0 280 280" className="w-full h-full">
              {/* Background circle */}
              <circle cx="140" cy="140" r="135" fill="var(--t-body-bg, #FAF7EE)" stroke="rgba(201,150,58,0.30)" strokeWidth="2" />
              {/* Graduations tous les 30° */}
              {Array.from({ length: 12 }, (_, i) => i * 30).map(angle => {
                const rad = (angle - 90) * Math.PI / 180
                const x1 = 140 + 130 * Math.cos(rad)
                const y1 = 140 + 130 * Math.sin(rad)
                const x2 = 140 + 120 * Math.cos(rad)
                const y2 = 140 + 120 * Math.sin(rad)
                return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(120,82,24,0.4)" strokeWidth="1.5" />
              })}

              {/* Cardinal labels — rotated by -heading so they stay aligned with real directions */}
              <g transform={`rotate(${heading !== null ? -heading : 0}, 140, 140)`}>
                <text x="140" y="22"  textAnchor="middle" fontSize="16" fontWeight="800" fill="#DC2626">N</text>
                <text x="265" y="146" textAnchor="middle" fontSize="14" fontWeight="700" fill="rgba(120,82,24,0.85)">E</text>
                <text x="140" y="270" textAnchor="middle" fontSize="14" fontWeight="700" fill="rgba(120,82,24,0.85)">S</text>
                <text x="15"  y="146" textAnchor="middle" fontSize="14" fontWeight="700" fill="rgba(120,82,24,0.85)">W</text>
              </g>

              {/* Arrow toward Qibla — rotated by arrowAngle */}
              {qibla !== null && (
                <g transform={`rotate(${arrowAngle}, 140, 140)`}>
                  {/* Tail */}
                  <line x1="140" y1="160" x2="140" y2="100" stroke="rgba(120,82,24,0.30)" strokeWidth="3" strokeLinecap="round" />
                  {/* Arrow shaft */}
                  <line x1="140" y1="140" x2="140" y2="40" stroke="#C9963A" strokeWidth="6" strokeLinecap="round" />
                  {/* Arrowhead */}
                  <path d="M 140,30 L 128,55 L 140,48 L 152,55 Z" fill="#C9963A" />
                  {/* Kaaba icon at the tip */}
                  <g transform="translate(140, 16)">
                    <rect x="-9" y="-9" width="18" height="18" rx="2" fill="#1A0C02" />
                    <rect x="-9" y="-9" width="18" height="6" fill="#C9963A" />
                  </g>
                </g>
              )}

              {/* Center dot */}
              <circle cx="140" cy="140" r="6" fill="#1A0C02" />
              <circle cx="140" cy="140" r="3" fill="#C9963A" />
            </svg>
          </div>
        </div>

        {/* Info numérique */}
        {qibla !== null && (
          <div className="bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
              {lang === 'en' ? 'Direction from True North' : 'Direction depuis le Nord vrai'}
            </p>
            <p className="text-3xl font-display font-bold tabular-nums mt-1 text-gray-900 dark:text-cream-100">
              {qibla.toFixed(1)}°
            </p>
            {heading !== null && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {lang === 'en' ? 'Phone heading: ' : 'Orientation téléphone : '}
                {heading.toFixed(0)}° · {lang === 'en' ? 'compass active' : 'boussole active'}
              </p>
            )}
          </div>
        )}

        {/* Activate compass */}
        {!orientationGranted && orientationSupported && (
          <button
            onClick={enableOrientation}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gold-500 text-white font-bold text-sm shadow-medium active:scale-98 transition-transform"
          >
            <CompassIcon size={16} />
            {lang === 'en' ? 'Activate compass' : 'Activer la boussole'}
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-3 flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300">{error}</p>
          </div>
        )}

        {/* Notes */}
        <div className="bg-cream-50 dark:bg-night-800 rounded-2xl p-4 border border-cream-200 dark:border-white/5">
          <p className="text-xs font-bold text-gray-700 dark:text-cream-200 mb-2">
            {lang === 'en' ? 'How to use' : 'Mode d\'emploi'}
          </p>
          <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5 leading-relaxed">
            <li>{lang === 'en'
              ? '1. Tap "Activate compass" to enable phone orientation.'
              : '1. Tape « Activer la boussole » pour autoriser l\'orientation du téléphone.'}</li>
            <li>{lang === 'en'
              ? '2. Hold your phone flat. The arrow points toward the Kaaba.'
              : '2. Tiens le téléphone à plat. La flèche dorée pointe vers la Kaaba.'}</li>
            <li>{lang === 'en'
              ? '3. If the compass is unstable, calibrate by drawing a figure-8 in the air.'
              : '3. Si la boussole est instable, calibre en dessinant un 8 en l\'air.'}</li>
            <li>{lang === 'en'
              ? '4. Avoid metallic objects and electronic devices nearby.'
              : '4. Évite les objets métalliques et appareils électroniques à proximité.'}</li>
          </ul>
        </div>

        <p className="text-[10px] text-center text-gray-400 leading-relaxed pt-1">
          {lang === 'en'
            ? 'Source: Aladhan API · Direction calculated by spherical geometry from Kaaba (21.4225°N, 39.8262°E)'
            : 'Source : API Aladhan · Direction calculée par géométrie sphérique depuis la Kaaba (21.4225°N, 39.8262°E)'}
        </p>
      </div>
    </div>
  )
}
