import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Square, Volume2 } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'
import { getT } from '../i18n'

const TAKBIR_SHORT = {
  arabic: 'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللهُ،\nوَاللهُ أَكْبَرُ، اللهُ أَكْبَرُ، وَلِلَّهِ الحَمْدُ',
  transliteration:
    'Allāhu Akbar, Allāhu Akbar, lā ilāha illā-llāh,\nwa-llāhu Akbar, Allāhu Akbar, wa li-llāhi l-ḥamd.',
}

const TAKBIR_LONG = {
  arabic:
    'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ،\nلَا إِلَهَ إِلَّا اللهُ،\nوَاللهُ أَكْبَرُ، اللهُ أَكْبَرُ، وَلِلَّهِ الحَمْدُ.\nاللهُ أَكْبَرُ كَبِيرًا، وَالحَمْدُ لِلَّهِ كَثِيرًا،\nوَسُبْحَانَ اللهِ بُكْرَةً وَأَصِيلًا.\nلَا إِلَهَ إِلَّا اللهُ وَحْدَهُ، صَدَقَ وَعْدَهُ،\nوَنَصَرَ عَبْدَهُ، وَأَعَزَّ جُنْدَهُ، وَهَزَمَ الأَحْزَابَ وَحْدَهُ.\nلَا إِلَهَ إِلَّا اللهُ وَلَا نَعْبُدُ إِلَّا إِيَّاهُ،\nمُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الكَافِرُونَ.\nاللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ،\nوَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ،\nوَعَلَى أَصْحَابِ سَيِّدِنَا مُحَمَّدٍ،\nوَعَلَى أَنْصَارِ سَيِّدِنَا مُحَمَّدٍ،\nوَعَلَى أَزْوَاجِ سَيِّدِنَا مُحَمَّدٍ،\nوَعَلَى ذُرِّيَّةِ سَيِّدِنَا مُحَمَّدٍ،\nوَسَلِّمْ تَسْلِيمًا كَثِيرًا.',
  transliteration:
    'Allāhu Akbar, Allāhu Akbar, Allāhu Akbar,\nlā ilāha illā-llāh,\nwa-llāhu Akbar, Allāhu Akbar, wa li-llāhi l-ḥamd.\nAllāhu Akbaru kabīran, wa l-ḥamdu li-llāhi kathīran,\nwa subḥāna-llāhi bukratan wa aṣīlā.\nLā ilāha illā-llāhu waḥdah, ṣadaqa wa\'dah,\nwa naṣara \'abdah, wa a\'azza jundah, wa hazama l-aḥzāba waḥdah.\nLā ilāha illā-llāhu wa lā na\'budu illā iyyāh,\nmukhliṣīna lahu d-dīna wa law kariha l-kāfirūn.\nAllāhumma ṣalli \'alā sayyidinā Muḥammad,\nwa \'alā āli sayyidinā Muḥammad,\nwa \'alā aṣḥābi sayyidinā Muḥammad,\nwa \'alā anṣāri sayyidinā Muḥammad,\nwa \'alā azwāji sayyidinā Muḥammad,\nwa \'alā dhurriyyati sayyidinā Muḥammad,\nwa sallim taslīman kathīrā.',
}

export default function EidPage() {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const lang = settings.language
  const t = getT(lang).eid

  const [version, setVersion] = useState<'short' | 'long'>('short')
  const [showTranslit, setShowTranslit] = useState(settings.showTranslit)
  const [showTranslation, setShowTranslation] = useState(settings.showTranslation)
  const [isPlaying, setIsPlaying] = useState(false)

  const loopRef = useRef(false)

  const takbir = version === 'short' ? TAKBIR_SHORT : TAKBIR_LONG
  const translation = version === 'short' ? t.translationShort : t.translationLong

  const speakOnce = (text: string, onEnd: () => void) => {
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text.replace(/\n/g, ' '))
    utter.lang = 'ar-SA'
    utter.rate = 0.80
    utter.onend = onEnd
    utter.onerror = onEnd
    window.speechSynthesis.speak(utter)
  }

  const loopSpeak = () => {
    if (!loopRef.current) return
    speakOnce(takbir.arabic, () => {
      if (loopRef.current) {
        setTimeout(loopSpeak, 800)
      }
    })
  }

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return
    loopRef.current = true
    setIsPlaying(true)
    loopSpeak()
  }

  const handleStop = () => {
    loopRef.current = false
    setIsPlaying(false)
    window.speechSynthesis.cancel()
  }

  // Stop on unmount or version change
  useEffect(() => {
    return () => {
      loopRef.current = false
      window.speechSynthesis.cancel()
    }
  }, [])

  useEffect(() => {
    if (isPlaying) {
      handleStop()
      setTimeout(() => {
        loopRef.current = true
        setIsPlaying(true)
        loopSpeak()
      }, 200)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  return (
    <div
      className="h-dvh flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d2b1a 0%, #1a3a20 40%, #0f1f30 100%)' }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 pt-safe"
        style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 16px)', paddingBottom: '12px' }}
      >
        <button
          onClick={() => { handleStop(); navigate(-1) }}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">{t.back}</span>
        </button>
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5">
          <Volume2 size={13} className="text-yellow-300" />
          <span className="text-xs font-bold text-yellow-300 tracking-wide">
            {t.title}
          </span>
        </div>
      </div>

      {/* Version tabs */}
      <div className="flex-shrink-0 flex gap-2 px-5 pb-3">
        {(['short', 'long'] as const).map(v => (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              version === v
                ? 'bg-yellow-400 text-gray-900'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            {v === 'short' ? t.short : t.long}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-5 py-2">
        {/* Arabic text */}
        <div className="bg-white/5 rounded-2xl p-5 mb-4 border border-white/10">
          <p
            className="font-arabic text-right leading-loose text-white"
            style={{ fontSize: `${settings.arabicSize}px`, lineHeight: 2 }}
            dir="rtl"
          >
            {takbir.arabic}
          </p>
        </div>

        {/* Transliteration */}
        {showTranslit && (
          <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
            <p className="text-yellow-200/80 text-sm leading-relaxed italic whitespace-pre-line">
              {takbir.transliteration}
            </p>
          </div>
        )}

        {/* Translation */}
        {showTranslation && (
          <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
            <p className="text-white/70 text-sm leading-relaxed">
              {translation}
            </p>
          </div>
        )}

        {/* Toggle buttons */}
        <div className="flex gap-2 flex-wrap pb-4">
          <button
            onClick={() => setShowTranslit(v => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              showTranslit ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            {t.translitLabel}
          </button>
          <button
            onClick={() => setShowTranslation(v => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              showTranslation ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' : 'bg-white/5 text-white/40 border border-white/10'
            }`}
          >
            {t.translationLabel}
          </button>
        </div>
      </div>

      {/* Bottom — Play/Stop */}
      <div
        className="flex-shrink-0 px-5 pt-3 flex flex-col gap-3"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 20px)' }}
      >
        {isPlaying ? (
          <>
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-yellow-300 text-sm font-semibold">{t.playing}</span>
            </div>
            <button
              onClick={handleStop}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all active:scale-98"
              style={{ background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(239,68,68,0.35)', color: '#fca5a5' }}
            >
              <Square size={20} fill="currentColor" />
              {t.stop}
            </button>
          </>
        ) : (
          <button
            onClick={handlePlay}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base transition-all active:scale-98"
            style={{ background: 'linear-gradient(135deg, #d4a017, #b8860b)', color: '#1a0f00' }}
          >
            <Play size={20} fill="currentColor" />
            {t.playLoop}
          </button>
        )}
      </div>
    </div>
  )
}
