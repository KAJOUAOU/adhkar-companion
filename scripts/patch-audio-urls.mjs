/**
 * patch-audio-urls.mjs
 * Met a jour automatiquement audioArabicUrl dans src/data/adhkar.ts
 * vers les fichiers locaux generes par generate-audio-azure.mjs
 *
 * Usage (apres avoir genere les MP3) :
 *   node scripts/patch-audio-urls.mjs
 *   node scripts/patch-audio-urls.mjs --dry-run   (apercu sans modifier)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.resolve(__dirname, '..')
const ADHKAR_TS = path.join(ROOT, 'src', 'data', 'adhkar.ts')
const AUDIO_DIR = path.join(ROOT, 'public', 'audio', 'ar')
const DRY_RUN   = process.argv.includes('--dry-run')

// IDs de tous les adhkar (meme ordre que dans adhkar.ts)
const ADHKAR_IDS = [
  'ayat-kursi', 'al-ikhlas', 'al-falaq', 'an-nas',
  'bismillah-protect', 'sayyid-istighfar', 'ya-hayyu',
  'protection-complete', 'protection-ame', 'salat-prophet',
  'la-ilaha-10', 'protection-corps', 'hasbiya-allah', 'ilm-rizq',
  'tasbih-subhanallah', 'tasbih-alhamdulillah', 'tasbih-allahu-akbar',
  'tasbih-la-ilaha', 'tasbih-subhana-bihamdih', 'tasbih-adhim',
  'tasbih-istighfar', 'rida', 'asbahna-bika', 'tasbih-khalq',
  'temoin-matin', 'asbahna-mulk', 'asbahna-fitrat', 'asbahna-rabb',
  'amsayna-mulk', 'amsayna-rabb', 'temoin-soir', 'audhu-kalimat',
]

function main() {
  // Check which files exist
  const present = ADHKAR_IDS.filter(id =>
    fs.existsSync(path.join(AUDIO_DIR, `${id}.mp3`))
  )
  const missing = ADHKAR_IDS.filter(id =>
    !fs.existsSync(path.join(AUDIO_DIR, `${id}.mp3`))
  )

  console.log(`\nFichiers MP3 trouves : ${present.length}/${ADHKAR_IDS.length}`)
  if (missing.length > 0) {
    console.log(`Manquants (garderont l'URL actuelle) : ${missing.join(', ')}`)
  }

  if (present.length === 0) {
    console.log('\nAucun MP3 trouve dans public/audio/ar/. Lancez d\'abord generate-audio-azure.mjs')
    process.exit(0)
  }

  let content = fs.readFileSync(ADHKAR_TS, 'utf8')
  let patchCount = 0

  // For each ID that has an MP3, find the block in adhkar.ts and replace audioArabicUrl
  for (const id of present) {
    const localUrl = `/audio/ar/${id}.mp3`

    // Match: id: 'the-id', ... audioArabicUrl: 'anything'
    // We use a regex that finds the audioArabicUrl line following the id
    // Strategy: replace audioArabicUrl in the block that contains this id
    const blockRegex = new RegExp(
      `(id:\\s*'${id}'[\\s\\S]{0,800}?audioArabicUrl:\\s*')(https?://[^']+)(')`
    )

    if (blockRegex.test(content)) {
      const before = content.match(blockRegex)?.[2]
      if (before === localUrl) {
        console.log(`  SKIP  ${id} (deja a jour)`)
        continue
      }
      content = content.replace(blockRegex, `$1${localUrl}$3`)
      console.log(`  PATCH ${id}`)
      console.log(`        ${before}`)
      console.log(`     -> ${localUrl}`)
      patchCount++
    } else {
      console.log(`  WARN  ${id}: pattern non trouve dans adhkar.ts`)
    }
  }

  if (patchCount === 0) {
    console.log('\nTout est deja a jour. Aucune modification.')
    return
  }

  if (DRY_RUN) {
    console.log(`\n[DRY-RUN] ${patchCount} URL(s) seraient mises a jour (fichier non modifie)`)
  } else {
    fs.writeFileSync(ADHKAR_TS, content, 'utf8')
    console.log(`\n${patchCount} URL(s) mises a jour dans ${ADHKAR_TS}`)
    console.log('Relancez le serveur de dev pour voir les changements.')
  }
}

main()
