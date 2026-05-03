/**
 * Tajweed Coloring Utility — v4 (Riwayat Hafs 'an 'Asim)
 *
 * Règles implémentées selon la riwaya de Hafs 'an 'Asim :
 *
 * 🔴 Rouge     — Qalqalah         (ق ط ب ج د) en position sakin ou waqf
 * 🟢 Vert      — Madd             prolongation : ا و ي ى آ après voyelle correspondante
 * 🔵 Bleu      — Ghunna (shadda)  ن ou م avec shadda = 2 temps nasals
 * 🟣 Violet    — Idghâm bi Ghunna ن sakin/tanwin avant ي ن م و (fusion + son nasal)
 * 🟠 Orange    — Ikhfâ'           ن sakin/tanwin avant 15 lettres (son voilé + nasalité)
 * 🟡 Or        — Iqlab            ن sakin/tanwin avant ب → م nasal
 * 🩵 Cyan      — Ikhfâ' Shafawi   م sakin avant ب (léger voile nasal labial)
 * 🔶 Or foncé  — Idghâm Shafawi   م sakin avant م (fusion labiale nasale)
 * 🟤 Marron    — Tafkheem         حروف الاستعلاء: ص ض ط ظ خ غ ق (prononciation épaisse)
 *
 * Non coloré (transparent) :
 * — Izhar Halqi  : ن sakin/tanwin avant ء ه ع ح غ خ → son clair, aucun effet
 * — Idghâm bila Ghunna : ن sakin/tanwin avant ل ر → fusion pure, sans nasalité
 * — Izhar Shafawi : م sakin avant tout autre que م ou ب → son clair
 */

// ─── Diacritiques Unicode ────────────────────────────────────────────────────
const SUKOON      = '\u0652' // ْ  (sukun)
const SHADDAH     = '\u0651' // ّ  (shadda)
const FATHA       = '\u064E' // َ
const DAMMA       = '\u064F' // ُ
const KASRA       = '\u0650' // ِ
const TANWIN_FATH = '\u064B' // ً
const TANWIN_DAMM = '\u064C' // ٌ
const TANWIN_KASR = '\u064D' // ٍ

// ─── Qalqalah ────────────────────────────────────────────────────────────────
// Lettres : ق ط ب ج د — vibration sonore en position sakin ou waqf
const QALQALAH = new Set(['ق', 'ط', 'ب', 'ج', 'د'])

// ─── Règles du Nun sakin (ن ساكن) et Tanwin (تنوين) ─────────────────────────
// 1. Izhar Halqi — 6 lettres gutturales → son clair, PAS de couleur
const IZHAR_HALQI = new Set(['ء', 'ه', 'ع', 'ح', 'غ', 'خ'])

// 2. Idghaam bi Ghunna — 4 lettres → fusion + 2 temps nasals (حروف يَنمُو)
const IDGHAAM_BI_GHUNNA = new Set(['ي', 'ن', 'م', 'و'])

// 3. Idghaam bila Ghunna — 2 lettres → fusion complète SANS son nasal → PAS de couleur
const IDGHAAM_BILA_GHUNNA = new Set(['ل', 'ر'])

// 4. Iqlab — ب → ن se transforme en م nasal avec ghunna
const IQLAB_LETTERS = new Set(['ب'])

// 5. Ikhfaa — 15 lettres → son atténué + nasalité
const IKHFAA_LETTERS = new Set([
  'ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش',
  'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك',
])

// ─── Tafkheem (حروف الاستعلاء) ───────────────────────────────────────────────
// 7 lettres : ص ض ط ظ خ غ ق — prononciation épaisse (langue en haut)
// Note : ق et ط sont aussi dans Qalqalah — Qalqalah prend priorité quand sakin
const ISTI_LA = new Set(['ص', 'ض', 'ط', 'ظ', 'خ', 'غ', 'ق'])

// ─── Madd — lettres de prolongation ─────────────────────────────────────────
const MADD_LETTERS = new Set(['ا', 'و', 'ي', 'آ', 'ى'])

// ─── Séparateurs (fin de mot) ─────────────────────────────────────────────────
const SEPARATORS = new Set([
  ' ', '\n', '،', '۝', 'ۚ', 'ۖ', 'ۗ', 'ۘ', 'ۙ', 'ۛ',
  '۩', '.', '(', ')', '—', '–', '﴿', '﴾',
])

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isHarakat(c: string): boolean {
  const code = c.charCodeAt(0)
  return code >= 0x064B && code <= 0x0652
}

function isTanwin(c: string): boolean {
  return c === TANWIN_FATH || c === TANWIN_DAMM || c === TANWIN_KASR
}

function hasTanwinInDiac(diac: string): boolean {
  return diac.split('').some(isTanwin)
}

/** Lettre de base précédente (ignore les diacritiques) */
function prevBase(chars: string[], i: number): string {
  let j = i - 1
  while (j >= 0 && isHarakat(chars[j])) j--
  return j >= 0 ? chars[j] : ''
}

/** Lettre de base suivante (ignore les diacritiques) */
function nextBase(chars: string[], i: number): string {
  let j = i + 1
  while (j < chars.length && isHarakat(chars[j])) j++
  return j < chars.length ? chars[j] : ''
}

/** Collecte les diacritiques après la position i */
function collectDiacritics(chars: string[], startAfter: number): { diac: string; end: number } {
  let diac = ''
  let j = startAfter
  while (j < chars.length && isHarakat(chars[j])) {
    diac += chars[j]
    j++
  }
  return { diac, end: j }
}

/** Voyelle de la lettre précédente (fatha, damma, kasra) */
function prevVowel(chars: string[], i: number): string {
  let j = i - 1
  // Chercher la lettre précédente + ses diacritiques
  while (j >= 0 && isHarakat(chars[j])) j--
  // Maintenant j est sur la lettre précédente (base), on cherche ses diacritiques
  if (j < 0) return ''
  const { diac } = collectDiacritics(chars, j + 1)
  if (diac.includes(FATHA))  return FATHA
  if (diac.includes(DAMMA))  return DAMMA
  if (diac.includes(KASRA))  return KASRA
  // Fatha implicite sur alef d'ouverture de mot
  return ''
}

// ─── Rendu HTML ───────────────────────────────────────────────────────────────
function span(cls: string, title: string, text: string): string {
  return `<span class="${cls}" title="${title}">${text}</span>`
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

    // Diacritique isolé (ne devrait pas arriver normalement)
    if (isHarakat(c)) { result.push(c); i++; continue }

    // Sépara teur ou ponctuation → sortie directe
    if (SEPARATORS.has(c)) { result.push(c); i++; continue }

    // Collecte les diacritiques qui suivent cette lettre
    const { diac, end: nxt } = collectDiacritics(chars, i + 1)
    const after = chars[nxt] || ''  // première lettre base suivante

    const hasSukoon  = diac.includes(SUKOON)
    const hasShaddah = diac.includes(SHADDAH)
    const hasTanwinD = hasTanwinInDiac(diac)

    // ── Alif Madd (آ) ─────────────────────────────────────────────────────────
    if (c === 'آ') {
      result.push(span('tj-madd', 'Madd — Prolongation (2 temps)', 'آ'))
      i++; continue
    }

    // ── NUN (ن) ───────────────────────────────────────────────────────────────
    if (c === 'ن') {
      // نّ — Shadda : Ghunna obligatoire (2 temps)
      if (hasShaddah) {
        result.push(span('tj-ghunna', 'Ghunna — Nasalisation 2 temps (ن mušaddada)', `ن${diac}`))
        i = nxt; continue
      }

      // ن sakin OU tanwin → appliquer les 4 règles
      if (hasSukoon || hasTanwinD) {
        // Izhar Halqi → son clair, PAS de couleur
        if (IZHAR_HALQI.has(after)) {
          result.push(`ن${diac}`)
          i = nxt; continue
        }
        // Iqlab → ن devient م nasal avant ب
        if (IQLAB_LETTERS.has(after)) {
          result.push(span('tj-iqlab', 'Iqlab — ن se transforme en م nasal avant ب', `ن${diac}`))
          i = nxt; continue
        }
        // Idghaam bi Ghunna → fusion avec son nasal (ي ن م و)
        if (IDGHAAM_BI_GHUNNA.has(after)) {
          result.push(span('tj-idghaam', 'Idghâm bi Ghunna — Fusion nasale (ي ن م و)', `ن${diac}`))
          i = nxt; continue
        }
        // Idghaam bila Ghunna → fusion pure sans son nasal (ل ر) → PAS de couleur
        if (IDGHAAM_BILA_GHUNNA.has(after)) {
          result.push(`ن${diac}`)
          i = nxt; continue
        }
        // Ikhfaa → son atténué + nasalité avant 15 lettres
        if (IKHFAA_LETTERS.has(after)) {
          result.push(span('tj-ikhfaa', 'Ikhfâ\u2019 — Son voilé nasal avant ن sakin', `ن${diac}`))
          i = nxt; continue
        }
      }

      // ن normale → pas de règle spéciale
      result.push(`ن${diac}`)
      i = nxt; continue
    }

    // ── MEEM (م) ──────────────────────────────────────────────────────────────
    if (c === 'م') {
      // مّ — Shadda : Ghunna obligatoire (2 temps)
      if (hasShaddah) {
        result.push(span('tj-ghunna', 'Ghunna — Nasalisation 2 temps (م mušaddada)', `م${diac}`))
        i = nxt; continue
      }

      // م sakin → 3 règles
      if (hasSukoon) {
        // Idghaam Shafawi : م sakin avant م → fusion labiale nasale
        if (after === 'م') {
          result.push(span('tj-idghaam-shafawi', 'Idghâm Šafawi — م sakin fusionne avec م suivant (+ ghunna)', `م${diac}`))
          i = nxt; continue
        }
        // Ikhfaa Shafawi : م sakin avant ب → léger voile labial nasal
        if (after === 'ب') {
          result.push(span('tj-ikhfaa-shafawi', 'Ikhfâ\u2019 Šafawi — م sakin devant ب, son labial voilé nasal', `م${diac}`))
          i = nxt; continue
        }
        // Izhar Shafawi : tout autre → son clair → PAS de couleur
        result.push(`م${diac}`)
        i = nxt; continue
      }

      result.push(`م${diac}`)
      i = nxt; continue
    }

    // ── QALQALAH (ق ط ب ج د) ─────────────────────────────────────────────────
    // Condition : lettre en position sakin (sukoon, waqf ou fin de mot)
    if (QALQALAH.has(c)) {
      const isAtRest =
        hasSukoon ||
        hasShaddah ||          // doublée : première moitié est sakin
        SEPARATORS.has(after) ||
        after === ''
      if (isAtRest) {
        result.push(span('tj-qalqalah', 'Qalqalah — Rebond sonore', `${c}${diac}`))
        i = nxt; continue
      }
      // Si mouvement (voyelle) → peut quand même être Tafkheem pour ق et ط
      if (ISTI_LA.has(c)) {
        result.push(span('tj-tafkheem', 'Tafkheem — Prononciation épaisse (حرف استعلاء)', `${c}${diac}`))
        i = nxt; continue
      }
    }

    // ── TAFKHEEM — حروف الاستعلاء (ص ض ظ خ غ + ق ط quand non-sakin) ──────────
    if (ISTI_LA.has(c)) {
      result.push(span('tj-tafkheem', 'Tafkheem — Prononciation épaisse (حرف استعلاء)', `${c}${diac}`))
      i = nxt; continue
    }

    // ── MADD — Prolongation ───────────────────────────────────────────────────
    // ا و ي ى doivent être précédées de la voyelle correspondante
    if (MADD_LETTERS.has(c)) {
      const pb     = prevBase(chars, i)
      const pVowel = prevVowel(chars, i)
      const isMadd =
        pb !== '' &&
        !SEPARATORS.has(pb) &&
        pb !== '\n' &&
        (
          (c === 'ا' && (pVowel === FATHA || pVowel === ''))  ||  // alef après fatha
          (c === 'و' && pVowel === DAMMA)                      ||  // waw après damma
          (c === 'ي' && pVowel === KASRA)                      ||  // ya après kasra
          (c === 'ى' && (pVowel === FATHA || pVowel === ''))   ||  // alef maqsura
          c === 'آ'                                                  // toujours madd
        )

      if (isMadd) {
        result.push(span('tj-madd', 'Madd — Prolongation (min. 2 temps)', `${c}${diac}`))
        i = nxt; continue
      }
    }

    // ── Lettre ordinaire ──────────────────────────────────────────────────────
    result.push(`${c}${diac}`)
    i = nxt
  }

  return result.join('')
}

// ─── Export des CSS (synchronisé avec index.css) ─────────────────────────────
export const TAJWEED_CSS = `
.tj-qalqalah        { color: #DC2626; font-weight: 800; }   /* Rouge    — Qalqalah               */
.tj-madd            { color: #16A34A; }                      /* Vert     — Madd (prolongation)    */
.tj-ghunna          { color: #1D4ED8; font-weight: 700; }   /* Bleu     — Ghunna (nasalisation)  */
.tj-idghaam         { color: #7C3AED; font-weight: 600; }   /* Violet   — Idghâm bi Ghunna       */
.tj-ikhfaa          { color: #EA580C; }                      /* Orange   — Ikhfâ' (halqi)         */
.tj-iqlab           { color: #D97706; font-weight: 700; }   /* Or       — Iqlab (ن→م avant ب)    */
.tj-ikhfaa-shafawi  { color: #0891B2; }                      /* Cyan     — Ikhfâ' Šafawi (م+ب)   */
.tj-idghaam-shafawi { color: #9333EA; font-weight: 600; }   /* Violet f — Idghâm Šafawi (م+م)    */
.tj-tafkheem        { color: #92400E; font-weight: 600; }   /* Marron   — Tafkheem (استعلاء)     */
`
