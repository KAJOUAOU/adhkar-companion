/**
 * Tajweed Coloring Utility — v5 (Riwayat Hafs 'an 'Asim, Rasm Uthmani)
 *
 * Règles implémentées selon la riwaya de Hafs 'an 'Asim sur le rasm uthmani
 * (Mushaf de Médine — texte Quran.com / tanzil.net) :
 *
 * ─── MADD (couleurs rouges, 4 niveaux) ───────────────────────────────────────
 * tj-madd        — Madd Tabi'i (2 temps)         : voyelle longue naturelle
 * tj-madd-wajib  — Madd Wajib Muttasil (4-5 t)   : madd + hamza dans même mot (شَآءَ)
 * tj-madd-jaiz   — Madd Jaiz Munfasil (2-5 t)    : madd fin de mot + hamza début suivant
 * tj-madd-lazim  — Madd Lazim (6 temps)          : madd + sukoon/shadda
 *
 * ─── NASALISATION (couleurs vertes) ──────────────────────────────────────────
 * tj-ghunna           — ن/م avec shadda (2 temps nasals)
 * tj-idghaam          — Idghâm bi Ghunna : ن sakin/tanwin + ي ن م و
 * tj-ikhfaa           — Ikhfâ' : ن sakin/tanwin + 15 lettres
 * tj-iqlab            — Iqlab : ن sakin/tanwin + ب → م nasal
 * tj-ikhfaa-shafawi   — م sakin + ب
 * tj-idghaam-shafawi  — م sakin + م
 *
 * ─── QALQALA (bleu ciel) ─────────────────────────────────────────────────────
 * tj-qalqalah    — ق ط ب ج د en sakin ou waqf (rebond sonore)
 *
 * ─── TAFKHIM (bleu foncé / brun) ─────────────────────────────────────────────
 * tj-tafkheem      — ر mufakhkham + حروف الاستعلاء (ص ض ط ظ خ غ ق)
 * tj-tafkheem-lam  — لام de الله après fatha ou damma
 *
 * ─── NON COLORÉ ──────────────────────────────────────────────────────────────
 * Izhar Halqi, Idghâm bila Ghunna, Izhar Shafawi, ر muraqqaq, لام de الله
 * après kasra, alef wasla silencieux.
 *
 * ─── CARACTÈRES UTHMANI GÉRÉS ────────────────────────────────────────────────
 * ٱ alef wasla, ـٰ dagger alif, ـۥ small waw (silat), ـۦ small ya (silat),
 * ٓ maddah above, ا۟ alef silencieux, ٌۭ ٍۭ ًۭ markers iqlab, ـ tatweel.
 */

// ─── Diacritiques (codes Unicode) ────────────────────────────────────────────
const FATHA       = 'َ' // َ
const DAMMA       = 'ُ' // ُ
const KASRA       = 'ِ' // ِ
const SHADDAH     = 'ّ' // ّ
const SUKOON      = 'ْ' // ْ
const TANWIN_FATH = 'ً' // ً
const TANWIN_DAMM = 'ٌ' // ٌ
const TANWIN_KASR = 'ٍ' // ٍ
const MADDAH_ABOVE = 'ٓ' // ٓ  (mark for extended madd)
const DAGGER_ALIF  = 'ٰ' // ـٰ (alef khanjariya — madd implicite)
const TATWEEL      = 'ـ' // ـ  (visuel uniquement)
const SILENT_MARK  = '۟' // ۟  (small round zero — lettre silencieuse)
const IQLAB_MARK_HIGH = 'ۢ' // ۢ  (small high meem — marqueur iqlab sur ن sakin)
const IQLAB_MARK_LOW  = 'ۭ' // ۭ  (small low meem — marqueur iqlab sur tanwin)

// ─── Lettres de base (rasm uthmani inclus) ──────────────────────────────────
const ALEF         = 'ا'
const ALEF_WASLA   = 'ٱ' // U+0671
const ALEF_MAQSURA = 'ى'
const ALEF_MADDA   = 'آ'
const WAW          = 'و'
const YA           = 'ي'
const YA_NO_DOTS   = 'ى' // alef maqsura (pas de points)
const SMALL_WAW    = 'ۥ' // U+06E5 (silat saghirah après damma)
const SMALL_YA     = 'ۦ' // U+06E6 (silat saghirah après kasra)

const HAMZA_FORMS = new Set(['ء', 'أ', 'إ', 'ؤ', 'ئ'])

// ─── Lettres porteuses de madd ──────────────────────────────────────────────
const MADD_BASE_LETTERS = new Set([ALEF, ALEF_WASLA, ALEF_MAQSURA, WAW, YA, ALEF_MADDA])
const SILAT_SAGHIRAH    = new Set([SMALL_WAW, SMALL_YA])

// ─── Qalqala ─────────────────────────────────────────────────────────────────
const QALQALAH = new Set(['ق', 'ط', 'ب', 'ج', 'د'])

// ─── Règles Nun sakin / Tanwin ──────────────────────────────────────────────
const IZHAR_HALQI       = new Set(['ء', 'ه', 'ع', 'ح', 'غ', 'خ', 'أ', 'إ'])
const IDGHAAM_BI_GHUNNA = new Set(['ي', 'ن', 'م', 'و']) // يَنْمُو
const IDGHAAM_BILA_GHUNNA = new Set(['ل', 'ر'])
const IQLAB_LETTERS     = new Set(['ب'])
const IKHFAA_LETTERS    = new Set([
  'ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك',
])

// ─── حروف الاستعلاء (Tafkhim) ────────────────────────────────────────────────
const ISTI_LA = new Set(['ص', 'ض', 'ط', 'ظ', 'خ', 'غ', 'ق'])

// ─── Séparateurs (fin de mot, pause) ─────────────────────────────────────────
const SEPARATORS = new Set([
  ' ', '\n', '،', '۝', 'ۚ', 'ۖ', 'ۗ', 'ۘ', 'ۙ', 'ۛ',
  '۩', '.', '(', ')', '—', '–', '﴿', '﴾',
  // Marqueurs de fin de verset (chiffres arabes après ۝)
  '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩',
])

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** Tout caractère qui n'est pas une lettre de base : harakat, marques uthmani, tatweel. */
function isDiacritic(c: string): boolean {
  const code = c.charCodeAt(0)
  return (
    (code >= 0x064B && code <= 0x065F) ||  // harakat + tanwin + maddah + hamza marks
    code === 0x0670 ||                       // dagger alif
    (code >= 0x06D6 && code <= 0x06ED) ||  // small Arabic letter marks (silat, iqlab marker, etc.)
    code === 0x0640                          // tatweel
  )
}

function isTanwin(c: string): boolean {
  return c === TANWIN_FATH || c === TANWIN_DAMM || c === TANWIN_KASR
}

function hasTanwinInDiac(diac: string): boolean {
  return diac.split('').some(isTanwin)
}

/** Lettre de base précédente (ignore diacritiques). */
function prevBase(chars: string[], i: number): { char: string; index: number } {
  let j = i - 1
  while (j >= 0 && isDiacritic(chars[j])) j--
  return { char: j >= 0 ? chars[j] : '', index: j }
}

/** Lettre de base suivante (ignore diacritiques). */
function nextBase(chars: string[], i: number): { char: string; index: number } {
  let j = i + 1
  while (j < chars.length && isDiacritic(chars[j])) j++
  return { char: j < chars.length ? chars[j] : '', index: j }
}

/** Collecte les diacritiques après position i (jusqu'à prochaine lettre de base ou séparateur). */
function collectDiacritics(chars: string[], startAfter: number): { diac: string; end: number } {
  let diac = ''
  let j = startAfter
  while (j < chars.length && isDiacritic(chars[j])) {
    diac += chars[j]
    j++
  }
  return { diac, end: j }
}

/** Voyelle d'une lettre (cherche fatha/damma/kasra dans ses diacritiques). */
function vowelOfLetter(chars: string[], letterIndex: number): string {
  if (letterIndex < 0 || letterIndex >= chars.length) return ''
  const { diac } = collectDiacritics(chars, letterIndex + 1)
  if (diac.includes(FATHA))  return FATHA
  if (diac.includes(DAMMA))  return DAMMA
  if (diac.includes(KASRA))  return KASRA
  if (diac.includes(TANWIN_FATH)) return FATHA
  if (diac.includes(TANWIN_DAMM)) return DAMMA
  if (diac.includes(TANWIN_KASR)) return KASRA
  return ''
}

/** Trouve le prochain caractère non-séparateur non-diacritique. */
function findNextLetter(chars: string[], from: number): { char: string; index: number; crossedSpace: boolean } {
  let j = from
  let crossedSpace = false
  while (j < chars.length) {
    const c = chars[j]
    if (SEPARATORS.has(c)) {
      if (c === ' ' || c === '\n') crossedSpace = true
      j++
      continue
    }
    if (isDiacritic(c)) { j++; continue }
    return { char: c, index: j, crossedSpace }
  }
  return { char: '', index: j, crossedSpace }
}

// ─── Détection Lām de Allah (الله / ٱللَّه) ──────────────────────────────────
/** Détecte si le لّ à `lamShaddaPos` est le lām de Allah (suivi de ه, précédé de ل + alef). */
function isLamAllah(chars: string[], lamShaddaPos: number): boolean {
  const before = prevBase(chars, lamShaddaPos)
  if (before.char !== 'ل') return false
  const after = nextBase(chars, lamShaddaPos)
  if (after.char !== 'ه') return false
  return true
}

/** Détermine si le lām de Allah est mufakhkham (true) ou muraqqaq (false). */
function isLamAllahMufakhkham(chars: string[], lamShaddaPos: number): boolean {
  // Remonter : لّ → ل précédent → ٱ ou ا → lettre précédente avec voyelle
  const firstLam = prevBase(chars, lamShaddaPos)
  if (firstLam.index < 0) return true

  const beforeFirstLam = prevBase(chars, firstLam.index)
  // Doit être ٱ ou ا (ou rien = début de parole)
  if (beforeFirstLam.char === ALEF_WASLA || beforeFirstLam.char === ALEF) {
    const beforeAlef = prevBase(chars, beforeFirstLam.index)
    if (beforeAlef.index < 0 || SEPARATORS.has(beforeAlef.char) || beforeAlef.char === '') {
      return true // début de parole → tafkhim par défaut
    }
    const vowel = vowelOfLetter(chars, beforeAlef.index)
    return vowel !== KASRA // kasra → tarqiq, sinon tafkhim
  }
  // Pattern non standard, fallback tafkhim
  return true
}

// ─── Détection Tafkhim/Tarqiq du Rā ─────────────────────────────────────────
/** Détermine si le ر à position `i` est mufakhkham. */
function isRaMufakhkham(chars: string[], i: number, diac: string): boolean {
  const hasFatha  = diac.includes(FATHA)
  const hasDamma  = diac.includes(DAMMA)
  const hasKasra  = diac.includes(KASRA)
  const hasSukoon = diac.includes(SUKOON)
  const hasTanwinD = hasTanwinInDiac(diac)
  const hasShadda = diac.includes(SHADDAH)

  // Cas 1 : ر avec fatha ou damma (avec ou sans shadda) → tafkhim
  if (hasFatha || hasDamma) return true

  // Cas 2 : ر avec kasra → tarqiq
  if (hasKasra) return false

  // Cas 3 : ر avec tanwin
  if (hasTanwinD) {
    if (diac.includes(TANWIN_KASR)) return false
    return true
  }

  // Cas 4 : ر sakin (ou shadda sans voyelle visible — rare)
  if (hasSukoon || hasShadda) {
    // Regarder la lettre précédente
    const prev = prevBase(chars, i)
    if (prev.index < 0) return true // début → tafkhim
    const prevVowel = vowelOfLetter(chars, prev.index)
    // ر sakin précédé de kasra asliyya → tarqiq
    if (prevVowel === KASRA) {
      // Sauf si la lettre suivante est isti'la avec fatha/damma → jawaz al-wajhayn, on prend tafkhim
      const next = nextBase(chars, i)
      if (next.char && ISTI_LA.has(next.char)) {
        const nextVowel = vowelOfLetter(chars, next.index)
        if (nextVowel === FATHA || nextVowel === DAMMA) return true
      }
      return false
    }
    // ر sakin précédé de fatha ou damma → tafkhim
    if (prevVowel === FATHA || prevVowel === DAMMA) return true
    // ر sakin précédé de sukoon → regarder encore plus loin
    if (prevVowel === '' || prevVowel === SUKOON) {
      // Lettre précédente est sakin, regarder sa précédente
      const prev2 = prevBase(chars, prev.index)
      if (prev2.index < 0) return true
      const prev2Vowel = vowelOfLetter(chars, prev2.index)
      if (prev2Vowel === KASRA) {
        // Si la lettre intermédiaire est ya sakin → tarqiq
        if (prev.char === YA || prev.char === YA_NO_DOTS) return false
        return false
      }
      return true
    }
  }

  // Cas 5 : ر en fin de mot (waqf) — regarder la lettre précédente
  const next = nextBase(chars, i)
  if (next.char === '' || SEPARATORS.has(next.char)) {
    const prev = prevBase(chars, i)
    if (prev.index < 0) return true
    const prevVowel = vowelOfLetter(chars, prev.index)
    if (prevVowel === KASRA) return false
    return true
  }

  // Défaut
  return true
}

// ─── Détection type de Madd ──────────────────────────────────────────────────
type MaddType = 'tabii' | 'wajib' | 'jaiz' | 'lazim'

/** Classifie le type de madd à partir des diacritiques + contexte. */
function classifyMadd(chars: string[], maddLetterEndIndex: number, hasMaddahMark: boolean): MaddType {
  if (!hasMaddahMark) return 'tabii'

  // Trouver ce qui suit la lettre de madd (en ignorant ses diacritiques)
  const next = findNextLetter(chars, maddLetterEndIndex)

  // Si la prochaine lettre est une hamza
  if (next.char && (HAMZA_FORMS.has(next.char) || next.char === ALEF_MADDA)) {
    return next.crossedSpace ? 'jaiz' : 'wajib'
  }

  // Si la prochaine lettre a sukoon ou shadda → Lazim
  if (next.char) {
    const nextDiac = collectDiacritics(chars, next.index + 1).diac
    if (nextDiac.includes(SUKOON) || nextDiac.includes(SHADDAH)) {
      return 'lazim'
    }
  }

  // Par défaut, si maddah présent mais sans contexte clair → Tabi'i étendu (rare)
  return 'tabii'
}

// ─── Rendu HTML ───────────────────────────────────────────────────────────────
function span(cls: string, title: string, text: string): string {
  return `<span class="${cls}" title="${title}">${text}</span>`
}

function maddTitle(t: MaddType): string {
  switch (t) {
    case 'wajib': return 'Madd Wājib Muttaṣil — 4 à 5 temps (madd + hamza, même mot)'
    case 'jaiz':  return 'Madd Jāʾiz Munfaṣil — 2 à 5 temps (madd + hamza, mot suivant)'
    case 'lazim': return 'Madd Lāzim — 6 temps (madd + sukūn/shadda)'
    default:      return 'Madd Ṭabīʿī — 2 temps (prolongation naturelle)'
  }
}

function maddClass(t: MaddType): string {
  switch (t) {
    case 'wajib': return 'tj-madd-wajib'
    case 'jaiz':  return 'tj-madd-jaiz'
    case 'lazim': return 'tj-madd-lazim'
    default:      return 'tj-madd'
  }
}

/**
 * Pousse une lettre ordinaire dans le résultat. Si la lettre porte un
 * dagger alif (ـٰ), elle est colorée comme madd Ṭabīʿī (équivalent à un alef long).
 */
function pushOrdinary(result: string[], unit: string, hasDagger: boolean): void {
  if (hasDagger) {
    result.push(span(maddClass('tabii'), maddTitle('tabii'), unit))
  } else {
    result.push(unit)
  }
}

// ─── Fonction principale ──────────────────────────────────────────────────────
export function applyTajweedHTML(arabic: string): string {
  if (!arabic) return arabic

  const chars  = [...arabic]
  const result: string[] = []
  let i = 0

  while (i < chars.length) {
    const c = chars[i]

    // Newline → <br>
    if (c === '\n') { result.push('<br>'); i++; continue }

    // Diacritique isolé (ne devrait pas arriver hors contexte)
    if (isDiacritic(c)) { result.push(c); i++; continue }

    // Séparateur ou ponctuation
    if (SEPARATORS.has(c)) { result.push(c); i++; continue }

    // Collecte les diacritiques de la lettre courante
    const { diac, end: nxt } = collectDiacritics(chars, i + 1)
    const after = chars[nxt] || ''
    const unit  = c + diac

    const hasSukoon  = diac.includes(SUKOON)
    const hasShaddah = diac.includes(SHADDAH)
    const hasTanwinD = hasTanwinInDiac(diac)
    const hasMaddah  = diac.includes(MADDAH_ABOVE)
    const hasDagger  = diac.includes(DAGGER_ALIF)

    // ── Alef Madda (آ) — toujours madd ───────────────────────────────────────
    if (c === ALEF_MADDA) {
      const t = classifyMadd(chars, nxt, true)
      result.push(span(maddClass(t), maddTitle(t), unit))
      i = nxt; continue
    }

    // ── Silat Saghirah (ـۥ ـۦ) — petit waw / petit ya après haa ──────────────
    if (SILAT_SAGHIRAH.has(c)) {
      // Si suivi de maddah ٓ → contexte madd étendu, sinon Tabi'i
      const t = classifyMadd(chars, nxt, hasMaddah)
      result.push(span(maddClass(t), maddTitle(t), unit))
      i = nxt; continue
    }

    // ── Iqlab implicite (tanwin + marqueur ۭ ou ۢ sur n'importe quelle lettre)
    if (hasTanwinD && (diac.includes(IQLAB_MARK_LOW) || diac.includes(IQLAB_MARK_HIGH))) {
      result.push(span('tj-iqlab', 'Iqlab — tanwin devient م nasal devant ب', unit))
      i = nxt; continue
    }

    // ── NUN (ن) ───────────────────────────────────────────────────────────────
    if (c === 'ن') {
      // نّ avec shadda → Ghunna 2 temps
      if (hasShaddah) {
        result.push(span('tj-ghunna', 'Ghunna — 2 temps nasals (ن mušaddada)', unit))
        i = nxt; continue
      }
      // Marqueur iqlab explicite (rasm uthmani : ن sans sukoon mais avec ۢ)
      if (diac.includes(IQLAB_MARK_HIGH)) {
        result.push(span('tj-iqlab', 'Iqlab — ن sakin devient م nasal devant ب', unit))
        i = nxt; continue
      }
      // ن sakin ou tanwin
      if (hasSukoon || hasTanwinD) {
        if (IZHAR_HALQI.has(after)) {
          pushOrdinary(result, unit, hasDagger) // Izhar — pas de couleur
          i = nxt; continue
        }
        if (IQLAB_LETTERS.has(after)) {
          result.push(span('tj-iqlab', 'Iqlab — ن devient م nasal devant ب', unit))
          i = nxt; continue
        }
        if (IDGHAAM_BI_GHUNNA.has(after)) {
          result.push(span('tj-idghaam', 'Idghâm bi Ghunna — fusion nasale (ي ن م و)', unit))
          i = nxt; continue
        }
        if (IDGHAAM_BILA_GHUNNA.has(after)) {
          pushOrdinary(result, unit, hasDagger) // Idghâm bila Ghunna — pas de couleur
          i = nxt; continue
        }
        if (IKHFAA_LETTERS.has(after)) {
          result.push(span('tj-ikhfaa', "Ikhfâ' — son voilé nasal", unit))
          i = nxt; continue
        }
      }
      pushOrdinary(result, unit, hasDagger)
      i = nxt; continue
    }

    // ── MEEM (م) ──────────────────────────────────────────────────────────────
    if (c === 'م') {
      if (hasShaddah) {
        result.push(span('tj-ghunna', 'Ghunna — 2 temps nasals (م mušaddada)', unit))
        i = nxt; continue
      }
      if (hasSukoon) {
        if (after === 'م') {
          result.push(span('tj-idghaam-shafawi', 'Idghâm Šafawi — م sakin + م', unit))
          i = nxt; continue
        }
        if (after === 'ب') {
          result.push(span('tj-ikhfaa-shafawi', "Ikhfâ' Šafawi — م sakin devant ب", unit))
          i = nxt; continue
        }
        pushOrdinary(result, unit, hasDagger) // Izhar Shafawi — pas de couleur
        i = nxt; continue
      }
      pushOrdinary(result, unit, hasDagger)
      i = nxt; continue
    }

    // ── LAM avec shadda — détection لام de الله ──────────────────────────────
    if (c === 'ل' && hasShaddah) {
      if (isLamAllah(chars, i)) {
        if (isLamAllahMufakhkham(chars, i)) {
          result.push(span('tj-tafkheem-lam', 'Tafkhīm du لام de الله (après fatha ou damma)', unit))
        } else {
          pushOrdinary(result, unit, hasDagger) // Tarqiq — pas de couleur
        }
        i = nxt; continue
      }
      // لّ ordinaire (pas Allah)
      pushOrdinary(result, unit, hasDagger)
      i = nxt; continue
    }

    // ── RĀ (ر) — Tafkhim / Tarqiq ────────────────────────────────────────────
    if (c === 'ر') {
      if (isRaMufakhkham(chars, i, diac)) {
        result.push(span('tj-tafkheem', 'Tafkhīm du ر (mufakhkham)', unit))
      } else {
        pushOrdinary(result, unit, hasDagger) // Tarqiq — pas de couleur
      }
      i = nxt; continue
    }

    // ── QALQALAH (ق ط ب ج د en sakin ou waqf) ────────────────────────────────
    if (QALQALAH.has(c)) {
      const isAtRest =
        hasSukoon ||
        hasShaddah ||
        SEPARATORS.has(after) ||
        after === ''
      if (isAtRest) {
        result.push(span('tj-qalqalah', 'Qalqala — rebond sonore', unit))
        i = nxt; continue
      }
      // ق ou ط non sakin → tafkhim (isti'la)
      if (ISTI_LA.has(c)) {
        result.push(span('tj-tafkheem', "Tafkhīm — حرف الاستعلاء", unit))
        i = nxt; continue
      }
      pushOrdinary(result, unit, hasDagger)
      i = nxt; continue
    }

    // ── TAFKHIM — autres حروف الاستعلاء (ص ض ظ خ غ) ─────────────────────────
    if (ISTI_LA.has(c)) {
      result.push(span('tj-tafkheem', "Tafkhīm — حرف الاستعلاء", unit))
      i = nxt; continue
    }

    // ── MADD — alef, waw, ya, alef maqsura ───────────────────────────────────
    if (MADD_BASE_LETTERS.has(c)) {
      // Le caractère ا۟ (alef avec marque silencieuse) ne donne pas de madd
      if (diac.includes(SILENT_MARK)) {
        result.push(unit)
        i = nxt; continue
      }

      // ٱ (alef wasla) est silencieux dans le flot et ne crée pas de madd
      if (c === ALEF_WASLA) {
        result.push(unit)
        i = nxt; continue
      }

      // Une lettre avec shadda est un consonne géminée (yy / ww), pas un madd
      if (hasShaddah) {
        result.push(unit)
        i = nxt; continue
      }

      const prev = prevBase(chars, i)
      const prevVowel = vowelOfLetter(chars, prev.index)

      const isMadd =
        prev.char !== '' &&
        !SEPARATORS.has(prev.char) &&
        (
          (c === ALEF && (prevVowel === FATHA || prevVowel === '')) ||
          (c === ALEF_MAQSURA && (prevVowel === FATHA || prevVowel === KASRA || prevVowel === '')) ||
          (c === WAW && prevVowel === DAMMA) ||
          (c === YA  && prevVowel === KASRA)
        )

      if (isMadd) {
        const t = classifyMadd(chars, nxt, hasMaddah)
        result.push(span(maddClass(t), maddTitle(t), unit))
        i = nxt; continue
      }
    }

    // ── Lettre ordinaire (avec gestion dagger alif éventuel) ─────────────────
    pushOrdinary(result, unit, hasDagger)
    i = nxt
  }

  return result.join('')
}

// ─── Export des CSS (synchronisé avec index.css) ─────────────────────────────
export const TAJWEED_CSS = `
/* Madd — niveaux de prolongation (rouge, intensité croissante) */
.tj-madd            { color: #DC2626; }                              /* Tabi'i 2 temps              */
.tj-madd-wajib      { color: #B91C1C; font-weight: 700; }            /* Wajib Muttasil 4-5 temps    */
.tj-madd-jaiz       { color: #B91C1C; font-weight: 600; }            /* Jaiz Munfasil 2-5 temps     */
.tj-madd-lazim      { color: #7F1D1D; font-weight: 800; text-decoration: underline; } /* Lazim 6 temps */

/* Nasalisation (vert) */
.tj-ghunna          { color: #16A34A; font-weight: 700; }
.tj-idghaam         { color: #16A34A; font-weight: 700; }
.tj-ikhfaa          { color: #16A34A; }
.tj-iqlab           { color: #16A34A; font-weight: 700; }
.tj-ikhfaa-shafawi  { color: #16A34A; }
.tj-idghaam-shafawi { color: #16A34A; font-weight: 700; }

/* Qalqala (bleu ciel) */
.tj-qalqalah        { color: #38BDF8; font-weight: 800; }

/* Tafkhim (bleu foncé / brun) */
.tj-tafkheem        { color: #1E40AF; font-weight: 600; }
.tj-tafkheem-lam    { color: #92400E; font-weight: 700; }
`
