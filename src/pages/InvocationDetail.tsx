import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Share2, CheckCheck, Heart, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import {
  getInvocationById,
  ALL_INVOCATIONS,
} from '../data/invocations'
import { useSettings } from '../hooks/useSettings'
import { useAudio } from '../hooks/useAudio'
import IslamicPattern from '../components/IslamicPattern'
import AudioPlayer from '../components/AudioPlayer'
import SeoHead from '../components/SeoHead'

const ARABIC_SIZES: Record<string, string> = {
  md:  'text-2xl',
  lg:  'text-3xl',
  xl:  'text-[2.2rem]',
  '2xl': 'text-[2.6rem]',
}

const CATEGORY_LABEL: Record<string, { fr: string; en: string }> = {
  coran:     { fr: 'Coran',       en: 'Quran' },
  khatma:    { fr: 'Khatma',      en: 'Khatma' },
  prophetic: { fr: 'Prophétique', en: 'Prophetic' },
}

export default function InvocationDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const item = getInvocationById(id ?? '')
  const { settings, toggleFavorite } = useSettings()
  const audio = useAudio()
  const lang = settings.language
  const [copied, setCopied] = useState(false)

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-gray-400">
          {lang === 'en' ? 'Invocation not found.' : 'Invocation introuvable.'}
        </p>
        <button onClick={() => navigate('/invocations')} className="text-forest-700 text-sm font-semibold hover:underline">
          {lang === 'en' ? '← Back to invocations' : '← Retour aux invocations'}
        </button>
      </div>
    )
  }

  const isFavorite = settings.favoritesIds.includes(item.id)
  const translation = (lang === 'en' && item.translationEn) ? item.translationEn : item.translationFr
  const categoryLabel = CATEGORY_LABEL[item.category][lang]

  // Invocations similaires : partage au moins un tag, exclut soi-même
  const similar = ALL_INVOCATIONS.filter(other =>
    other.id !== item.id && other.tags.some(t => item.tags.includes(t)),
  ).slice(0, 4)

  const handleShare = async () => {
    const text = `${item.title} — ${item.titleAr}\n\n${item.arabic}\n\n${translation}\n\n— ${item.source}`
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text })
      } catch { /* annulé */ }
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // SEO description : 150-160 chars max
  const seoDescription = `${item.title} — invocation islamique authentique (${item.source}). Texte arabe vocalisé, translittération et traduction française.`.slice(0, 160)

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-night-950 pb-20">
      <SeoHead
        title={`${item.title} — ${item.titleAr} | Adhkar Companion`}
        description={seoDescription}
        canonical={`/invocation/${item.id}`}
      />

      {/* Header */}
      <div className="relative overflow-hidden bg-white dark:bg-night-900 border-b border-cream-200 dark:border-white/10 px-5 pt-safe pt-12 pb-5 flex items-center gap-3">
        <IslamicPattern className="text-forest-800 dark:text-forest-400" opacity={0.06} />
        <button
          onClick={() => navigate(-1)}
          className="relative z-10 p-2 -ml-1 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-cream-100 dark:hover:bg-night-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="relative z-10 flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gold-700 dark:text-gold-400">
            {categoryLabel}
          </p>
          <h1 className="text-lg font-display font-bold text-gray-900 dark:text-cream-100 leading-tight truncate">
            {item.title}
          </h1>
          <p className="text-xs text-gray-400 font-arabic truncate">{item.titleAr}</p>
        </div>
        <button
          onClick={() => toggleFavorite(item.id)}
          className="relative z-10 p-2 rounded-xl text-gray-400 hover:text-gold-500 transition-colors"
          aria-label={lang === 'en' ? 'Toggle favorite' : 'Ajouter aux favoris'}
        >
          <Heart size={20} fill={isFavorite ? '#C9963A' : 'none'} className={isFavorite ? 'text-gold-500' : ''} />
        </button>
      </div>

      {/* Carte principale */}
      <div className="px-4 pt-5">
        <div className="glass dark:glass-dark rounded-3xl overflow-hidden">
          {/* Arabic */}
          <div className="px-6 py-7 bg-gradient-to-b from-cream-50 to-white dark:from-night-900 dark:to-night-800">
            <p
              className={`font-arabic leading-loose text-right dir-rtl whitespace-pre-line text-gray-900 dark:text-cream-100 ${ARABIC_SIZES[settings.arabicSize] || 'text-[2.2rem]'}`}
              dir="rtl"
            >
              {item.arabic}
            </p>
          </div>

          {/* Transliteration */}
          {settings.showTranslit && item.transliteration && (
            <div className="px-6 py-4 border-t border-cream-100 dark:border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {lang === 'en' ? 'Transliteration' : 'Translittération'}
              </p>
              <p className="text-sm italic text-gray-600 dark:text-gray-300 leading-relaxed select-text">
                {item.transliteration}
              </p>
            </div>
          )}

          {/* Translation */}
          {settings.showTranslation && (
            <div className="px-6 py-4 border-t border-cream-100 dark:border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {lang === 'en' ? 'Translation' : 'Traduction'}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed select-text">
                {translation}
              </p>
            </div>
          )}

          {/* Source */}
          <div className="px-6 py-4 border-t border-cream-100 dark:border-white/5 bg-gold-50/40 dark:bg-gold-900/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              {lang === 'en' ? 'Source' : 'Source'}
            </p>
            {item.sourceUrl ? (
              <a
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-gold-700 dark:text-gold-400 hover:underline"
              >
                {item.source}
                <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-sm font-bold text-gold-700 dark:text-gold-400">{item.source}</p>
            )}
            {item.grade && (
              <span className={`ml-2 text-xs font-semibold ${
                item.grade === 'Sahih' ? 'text-emerald-700 dark:text-emerald-400' :
                item.grade === 'Hasan' ? 'text-blue-700 dark:text-blue-400' :
                item.grade === 'Compilation' ? 'text-amber-700 dark:text-amber-400' :
                'text-gray-500'
              }`}>
                · {item.grade}
              </span>
            )}
            {item.gradingNote && (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                {item.gradingNote}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Audio dual FR/AR */}
      <div className="px-4 pt-5">
        <div className="bg-white dark:bg-night-800 rounded-2xl p-4 border border-cream-200 dark:border-white/5 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
            {lang === 'en' ? 'Audio' : 'Audio'}
          </p>

          {/* Audio arabe */}
          <div className="flex items-center justify-between gap-3 py-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {lang === 'en' ? 'Arabic recitation' : 'Récitation arabe'}
            </span>
            {item.audioArabicUrl ? (
              <AudioPlayer
                adhkarId={`${item.id}-ar`}
                audioUrl={item.audioArabicUrl}
                audioState={audio.state}
                onPlay={audio.play}
                onStop={audio.stop}
              />
            ) : (
              <span className="text-xs text-gray-400 italic">
                {lang === 'en' ? 'Coming soon' : 'Bientôt disponible'}
              </span>
            )}
          </div>

          {/* Audio français */}
          <div className="flex items-center justify-between gap-3 py-2 border-t border-cream-100 dark:border-white/5">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {lang === 'en' ? 'French translation' : 'Traduction française'}
            </span>
            {item.audioFrenchUrl ? (
              <AudioPlayer
                adhkarId={`${item.id}-fr`}
                audioUrl={item.audioFrenchUrl}
                audioState={audio.state}
                onPlay={audio.play}
                onStop={audio.stop}
              />
            ) : (
              <span className="text-xs text-gray-400 italic">
                {lang === 'en' ? 'Coming soon' : 'Bientôt disponible'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pt-4 flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white dark:bg-night-800 border border-cream-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-200 active:scale-[0.99] transition-transform"
        >
          {copied ? (
            <><CheckCheck size={15} className="text-forest-600" /> {lang === 'en' ? 'Copied!' : 'Copié !'}</>
          ) : (
            <><Share2 size={15} /> {lang === 'en' ? 'Share' : 'Partager'}</>
          )}
        </button>
      </div>

      {/* Invocations similaires */}
      {similar.length > 0 && (
        <div className="px-4 pt-7">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
            {lang === 'en' ? 'Similar invocations' : 'Invocations similaires'}
          </p>
          <ul className="space-y-2">
            {similar.map(other => (
              <li key={other.id}>
                <Link
                  to={`/invocation/${other.id}`}
                  className="flex items-center justify-between gap-3 bg-white dark:bg-night-800 hover:bg-cream-50 dark:hover:bg-night-700 rounded-2xl p-3 border border-cream-200 dark:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-forest-100 dark:bg-forest-900 text-forest-800 dark:text-forest-300 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                      {other.number}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-cream-100 truncate">{other.title}</p>
                      <p className="text-[10px] text-gold-700 dark:text-gold-400 uppercase tracking-wide font-bold truncate">{other.source}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
