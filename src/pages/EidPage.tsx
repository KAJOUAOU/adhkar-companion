import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Square } from 'lucide-react'
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

const ARABIC_FONT_SIZE: Record<string, string> = {
  md:   '1.25rem',
  lg:   '1.5rem',
  xl:   '1.75rem',
  '2xl':'2rem',
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
  const arabicSize = ARABIC_FONT_SIZE[settings.arabicSize] ?? '1.5rem'

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
      if (loopRef.current) setTimeout(loopSpeak, 800)
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

  useEffect(() => () => {
    loopRef.current = false
    window.speechSynthesis.cancel()
  }, [])

  // Restart loop when version changes
  useEffect(() => {
    if (!isPlaying) return
    loopRef.current = false
    window.speechSynthesis.cancel()
    setTimeout(() => {
      loopRef.current = true
      loopSpeak()
    }, 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-10">

      {/* Header — même style que SleepAdhkar mais avec la palette dorée du Dashboard */}
      <div
        className="relative border-b border-white/10 px-5 pb-6"
        style={{
          background: 'var(--t-hero, linear-gradient(150deg,#6E5010,#8B6914))',
          paddingTop: 'max(env(safe-area-inset-top, 0px), 48px)',
        }}
      >
        <button
          onClick={() => { handleStop(); navigate(-1) }}
          className="p-2 -ml-1 rounded-xl text-white/60 hover:bg-white/10 transition-colors mb-3"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
            ☪️
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white leading-tight">
              {t.title}
            </h1>
            <p className="text-xs text-white/50 mt-0.5">
              {t.fitr} · {t.adha}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* Version tabs */}
        <div className="flex gap-2">
          {(['short', 'long'] as const).map(v => (
            <button
              key={v}
              onClick={() => setVersion(v)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                version === v
                  ? 'bg-forest-800 text-white'
                  : 'bg-white dark:bg-night-800 text-gray-600 dark:text-gray-400 border border-cream-200 dark:border-white/10'
              }`}
            >
              {v === 'short' ? t.short : t.long}
            </button>
          ))}
        </div>

        {/* Arabic text card */}
        <div className="bg-white dark:bg-night-800 rounded-2xl p-5 shadow-soft border border-cream-200 dark:border-white/10">
          <p
            className="font-arabic text-right text-gray-900 dark:text-cream-100 leading-loose"
            style={{ fontSize: arabicSize, lineHeight: 2.1 }}
            dir="rtl"
          >
            {takbir.arabic}
          </p>
        </div>

        {/* Transliteration */}
        {showTranslit && (
          <div className="bg-white dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-cream-200 dark:border-white/10">
            <p className="text-xs font-bold text-gold-600 dark:text-gold-400 uppercase tracking-wide mb-2">
              {t.translitLabel}
            </p>
            <p className="text-sm text-gray-600 dark:text-cream-300 leading-relaxed italic whitespace-pre-line">
              {takbir.transliteration}
            </p>
          </div>
        )}

        {/* Translation */}
        {showTranslation && (
          <div className="bg-amber-50 dark:bg-night-800 rounded-2xl p-4 shadow-soft border border-amber-100 dark:border-white/10">
            <p className="text-xs font-bold text-amber-700 dark:text-gold-400 uppercase tracking-wide mb-2">
              {t.translationLabel}
            </p>
            <p className="text-sm text-gray-700 dark:text-cream-300 leading-relaxed">
              {translation}
            </p>
          </div>
        )}

        {/* Toggle pills */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowTranslit(v => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              showTranslit
                ? 'bg-forest-800 text-white border-forest-800'
                : 'bg-white dark:bg-night-800 text-gray-500 dark:text-gray-400 border-cream-200 dark:border-white/10'
            }`}
          >
            {t.translitLabel}
          </button>
          <button
            onClick={() => setShowTranslation(v => !v)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              showTranslation
                ? 'bg-forest-800 text-white border-forest-800'
                : 'bg-white dark:bg-night-800 text-gray-500 dark:text-gray-400 border-cream-200 dark:border-white/10'
            }`}
          >
            {t.translationLabel}
          </button>
        </div>

        {/* Play / Stop */}
        {isPlaying ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 py-1">
              <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
              <span className="text-sm font-semibold text-gold-600 dark:text-gold-400">{t.playing}</span>
            </div>
            <button
              onClick={handleStop}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base border transition-all active:scale-98 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/30"
            >
              <Square size={18} fill="currentColor" />
              {t.stop}
            </button>
          </div>
        ) : (
          <button
            onClick={handlePlay}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-base text-white transition-all active:scale-98"
            style={{ background: 'var(--t-primary-d, #5C4010)' }}
          >
            <Play size={18} fill="currentColor" />
            {t.playLoop}
          </button>
        )}

      </div>
    </div>
  )
}
