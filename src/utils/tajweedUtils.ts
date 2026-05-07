/**
 * Tajweed Coloring Utility — v6 (Riwayat Hafs ʿan ʿĀṣim, script imlaei)
 *
 * Schéma simplifié et universel inspiré du Tajweed Quran de Dar al-Maʿrifah :
 *
 * 🔴 Rouge   tj-madd          — Toute prolongation (Madd : Tabīʿī, Wājib,
 *                               Jāʾiz, Lāzim — fusion en une seule couleur).
 * 🟢 Vert    tj-ghunna        — Toute nasalisation : Ghunna (نّ مّ),
 *                               Idghām bi Ghunna, Ikhfāʾ, Iqlab,
 *                               Ikhfāʾ Šafawi, Idghām Šafawi.
 * 🔵 Bleu    tj-qalqalah      — Qalqala : ق ط ب ج د en sakin ou waqf.
 * 🟫 Brun    tj-tafkheem-lam  — Tafkhīm du لام de الله (après fatha/damma).
 *
 * Le moteur fonctionne avec le script imlaei (script moderne simplifié)
 * mais reste compatible avec le rasm uthmani (caractères ٱ ـٰ ـۥ ـۦ ٓ etc.
 * sont reconnus comme diacritiques transparents).
 */

// ─── Diacritiques Unicode (codes) ────────────────────────────────────────────
const FATHA       = 'َ'
const DAMMA       = 'ُ'
const KASRA       = 'ِ'
const SHADDAH     = 'ّ'
const SUKOON      = 'ْ'
const TANWIN_FATH = 'ً'
const TANWIN_DAMM = 'ٌ'
const TANWIN_KASR = 'ٍ'
const DAGGER_ALIF = 'ٰ' // ـٰ (madd implicite)
const IQLAB_HIGH  = 'ۢ' // marqueur iqlab uthmani sur ن sakin
const IQLAB_LOW   = 'ۭ' // marqueur iqlab uthmani sur tanwin

// ─── Lettres ────────────────────────────────────────────────────────────────
const ALEF         = 'ا'
const ALEF_WASLA   = 'ٱ'
const ALEF_MAQSURA = 'ى'
const ALEF_MADDA   = 'آ'
const WAW          = 'و'
const YA           = 'ي'

const HAMZA_FORMS = new Set(['ء', 'أ', 'إ', 'ؤ', 'ئ', ALEF_MADDA])
const MADD_BASE   = new Set([ALEF, ALEF_WASLA, ALEF_MAQSURA, WAW, YA])

// ─── Qalqala ────────────────────────────────────────────────────────────────
const QALQALAH = new Set(['ق', 'ط', 'ب', 'ج', 'د'])

// ─── Règles Nun sakin / Tanwin ──────────────────────────────────────────────
const IZHAR_HALQI         = new Set(['ء', 'ه', 'ع', 'ح', 'غ', 'خ', 'أ', 'إ'])
const IDGHAAM_BI_GHUNNA   = new Set(['ي', 'ن', 'م', 'و'])
const IDGHAAM_BILA_GHUNNA = new Set(['ل', 'ر'])
const IKHFAA_LETTERS      = new Set([
  'ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك',
])

// ─── Séparateurs ─────────────────────────────────────────────────────────────
const SEPARATORS = new Set([
  ' ', '\n', '،', '۝', 'ۚ', 'ۖ', 'ۗ', 'ۘ', 'ۙ', 'ۛ',
  '۩', '.', '(', ')', '—', '–', '﴿', '﴾',
  '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩',
])

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isDiacritic(c: string): boolean {
  const code = c.charCodeAt(0)
  return (
    (code >= 0x064B && code <= 0x065F) ||  // harakat + tanwin + maddah + hamza
    code === 0x0670 ||                       // dagger alif
    (code >= 0x06D6 && code <= 0x06ED) ||  // small marks
    code === 0x0640                          // tatweel
  )
}

function hasTanwinInDiac(diac: string): boolean {
  return diac.includes(TANWIN_FATH) || diac.includes(TANWIN_DAMM) || diac.includes(TANWIN_KASR)
}

/** Lettre de base précédente (saute les diacritiques). */
function prevBase(chars: string[], i: number): { char: string; index: number } {
  let j = i - 1
  while (j >= 0 && isDiacritic(chars[j])) j--
  return { char: j >= 0 ? chars[j] : '', index: j }
}

/** Voyelle d'une lettre (cherche dans ses diacritiques qui suivent). */
function vowelOfLetter(chars: string[], letterIndex: number): string {
  if (letterIndex < 0 || letterIndex >= chars.length) return ''
  let j = letterIndex + 1
  while (j < chars.length && isDiacritic(chars[j])) {
    const c = chars[j]
    if (c === FATHA || c === TANWIN_FATH) return FATHA
    if (c === DAMMA || c === TANWIN_DAMM) return DAMMA
    if (c === KASRA || c === TANWIN_KASR) return KASRA
    j++
  }
  return ''
}

/** Collecte les diacritiques après position i. */
function collectDiacritics(chars: string[], startAfter: number): { diac: string; end: number } {
  let diac = ''
  let j = startAfter
  while (j < chars.length && isDiacritic(chars[j])) {
    diac += chars[j]
    j++
  }
  return { diac, end: j }
}

/** Trouve la prochaine lettre de base (saute diacritiques + séparateurs). */
function findNextLetter(chars: string[], from: number): { char: string; index: number; crossedSpace: boolean } {
  let j = from
  let crossedSpace = false
  while (j < chars.length) {
    const c = chars[j]
    if (c === ' ' || c === '\n') { crossedSpace = true; j++; continue }
    if (SEPARATORS.has(c)) { j++; continue }
    if (isDiacritic(c)) { j++; continue }
    return { char: c, index: j, crossedSpace }
  }
  return { char: '', index: j, crossedSpace }
}

// ─── Détection Lām de Allah ─────────────────────────────────────────────────
/** لّ (lām + shadda) à `i` est-il le lām de الله ? Pattern : ل + لّ + ه. */
function isLamAllah(chars: string[], i: number): boolean {
  const before = prevBase(chars, i)
  if (before.char !== 'ل') return false
  let j = i + 1
  while (j < chars.length && isDiacritic(chars[j])) j++
  const after = j < chars.length ? chars[j] : ''
  return after === 'ه'
}

/** Le لام de الله est-il mufakhkham (true) ou muraqqaq (false) ? */
function isLamAllahMufakhkham(chars: string[], lamShaddaPos: number): boolean {
  // Remonter : لّ → ل précédent → ٱ/ا → lettre précédente avec voyelle
  const firstLam = prevBase(chars, lamShaddaPos)
  if (firstLam.index < 0) return true

  const beforeFirstLam = prevBase(chars, firstLam.index)
  if (beforeFirstLam.char === ALEF_WASLA || beforeFirstLam.char === ALEF) {
    const beforeAlef = prevBase(chars, beforeFirstLam.index)
    if (beforeAlef.index < 0 || SEPARATORS.has(beforeAlef.char)) return true
    return vowelOfLetter(chars, beforeAlef.index) !== KASRA
  }
  // Pas de pattern attendu — défaut tafkhim
  return true
}

// ─── Rendu HTML ───────────────────────────────────────────────────────────────
function span(cls: string, title: string, text: string): string {
  return `<span class="${cls}" title="${title}">${text}</span>`
}

/** Pousse une lettre. Si elle porte un dagger alif (ـٰ) elle est colorée comme madd. */
function pushOrdinary(result: string[], unit: string, hasDagger: boolean): void {
  if (hasDagger) {
    result.push(span('tj-madd', 'Madd — prolongation 2 temps', unit))
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

    if (c === '\n') { result.push('<br>'); i++; continue }
    if (isDiacritic(c)) { result.push(c); i++; continue }
    if (SEPARATORS.has(c)) { result.push(c); i++; continue }

    // Collecte des diacritiques de la lettre courante
    const { diac, end: nxt } = collectDiacritics(chars, i + 1)
    const after = chars[nxt] || ''
    const unit  = c + diac

    const hasSukoon  = diac.includes(SUKOON)
    const hasShaddah = diac.includes(SHADDAH)
    const hasTanwinD = hasTanwinInDiac(diac)
    const hasDagger  = diac.includes(DAGGER_ALIF)

    // ── Alef Madda (آ) — toujours madd ─────────────────────────────────────
    if (c === ALEF_MADDA) {
      result.push(span('tj-madd', 'Madd — prolongation', unit))
      i = nxt; continue
    }

    // ── Iqlab via marqueur uthmani sur tanwin ───────────────────────────────
    if (hasTanwinD && (diac.includes(IQLAB_LOW) || diac.includes(IQLAB_HIGH))) {
      result.push(span('tj-ghunna', 'Iqlab — tanwin → م nasal devant ب', unit))
      i = nxt; continue
    }

    // ── NUN (ن) ─────────────────────────────────────────────────────────────
    if (c === 'ن') {
      if (hasShaddah) {
        result.push(span('tj-ghunna', 'Ghunna — 2 temps nasals (ن mušaddada)', unit))
        i = nxt; continue
      }
      // Marqueur iqlab explicite (rasm uthmani)
      if (diac.includes(IQLAB_HIGH)) {
        result.push(span('tj-ghunna', 'Iqlab — ن devient م nasal devant ب', unit))
        i = nxt; continue
      }
      if (hasSukoon || hasTanwinD) {
        if (IZHAR_HALQI.has(after)) { pushOrdinary(result, unit, hasDagger); i = nxt; continue }
        if (after === 'ب') {
          result.push(span('tj-ghunna', 'Iqlab — ن devient م nasal devant ب', unit))
          i = nxt; continue
        }
        if (IDGHAAM_BI_GHUNNA.has(after)) {
          result.push(span('tj-ghunna', 'Idghām bi Ghunna — fusion nasale (ي ن م و)', unit))
          i = nxt; continue
        }
        if (IDGHAAM_BILA_GHUNNA.has(after)) { pushOrdinary(result, unit, hasDagger); i = nxt; continue }
        if (IKHFAA_LETTERS.has(after)) {
          result.push(span('tj-ghunna', 'Ikhfāʾ — son voilé nasal', unit))
          i = nxt; continue
        }
      }
      pushOrdinary(result, unit, hasDagger)
      i = nxt; continue
    }

    // ── Tanwin sur autre lettre + ب suivant → Iqlab ─────────────────────────
    if (hasTanwinD && after === 'ب') {
      result.push(span('tj-ghunna', 'Iqlab — tanwin → م nasal devant ب', unit))
      i = nxt; continue
    }

    // ── MEEM (م) ────────────────────────────────────────────────────────────
    if (c === 'م') {
      if (hasShaddah) {
        result.push(span('tj-ghunna', 'Ghunna — 2 temps nasals (م mušaddada)', unit))
        i = nxt; continue
      }
      if (hasSukoon) {
        if (after === 'م') {
          result.push(span('tj-ghunna', 'Idghām Šafawi — م sakin + م', unit))
          i = nxt; continue
        }
        if (after === 'ب') {
          result.push(span('tj-ghunna', 'Ikhfāʾ Šafawi — م sakin devant ب', unit))
          i = nxt; continue
        }
        pushOrdinary(result, unit, hasDagger)
        i = nxt; continue
      }
      pushOrdinary(result, unit, hasDagger)
      i = nxt; continue
    }

    // ── LAM avec shadda → détection لام de الله ────────────────────────────
    if (c === 'ل' && hasShaddah) {
      if (isLamAllah(chars, i)) {
        if (isLamAllahMufakhkham(chars, i)) {
          result.push(span('tj-tafkheem-lam', 'Tafkhīm du لام de الله (après fatha/damma)', unit))
        } else {
          pushOrdinary(result, unit, hasDagger)
        }
        i = nxt; continue
      }
      pushOrdinary(result, unit, hasDagger)
      i = nxt; continue
    }

    // ── QALQALA (ق ط ب ج د en sakin/waqf) ──────────────────────────────────
    if (QALQALAH.has(c)) {
      const isAtRest = hasSukoon || hasShaddah || SEPARATORS.has(after) || after === ''
      if (isAtRest) {
        result.push(span('tj-qalqalah', 'Qalqala — rebond sonore', unit))
        i = nxt; continue
      }
      pushOrdinary(result, unit, hasDagger)
      i = nxt; continue
    }

    // ── MADD — alef, waw, ya, alef maqsura ─────────────────────────────────
    if (MADD_BASE.has(c)) {
      // Alef wasla silencieux dans le flot
      if (c === ALEF_WASLA) { pushOrdinary(result, unit, hasDagger); i = nxt; continue }
      // Lettre avec shadda = consonne géminée, pas un madd
      if (hasShaddah) { pushOrdinary(result, unit, hasDagger); i = nxt; continue }

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
        result.push(span('tj-madd', 'Madd — prolongation', unit))
        i = nxt; continue
      }
    }

    // ── Lettre ordinaire (avec dagger alif éventuel = madd implicite) ──────
    pushOrdinary(result, unit, hasDagger)
    i = nxt
  }

  return result.join('')
}

// ─── CSS de référence (synchronisé avec src/index.css) ───────────────────────
export const TAJWEED_CSS = `
.tj-madd          { color: #DC2626; }                     /* Rouge — Madd                              */
.tj-ghunna        { color: #16A34A; font-weight: 700; }   /* Vert  — Ghunna + nasalisations             */
.tj-qalqalah      { color: #2563EB; font-weight: 700; }   /* Bleu  — Qalqala                            */
.tj-tafkheem-lam  { color: #92400E; font-weight: 700; }   /* Brun  — لام de الله tafkhīm                */
`
