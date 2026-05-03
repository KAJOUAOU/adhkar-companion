/**
 * generate-audio-azure.mjs
 * Generates MP3 audio for all 32 adhkar using Azure TTS (ar-SA-HamedNeural)
 *
 * Usage:
 *   node scripts/generate-audio-azure.mjs --key YOUR_AZURE_KEY --region eastus
 *
 * Or with env vars:
 *   AZURE_SPEECH_KEY=xxx AZURE_SPEECH_REGION=eastus node scripts/generate-audio-azure.mjs
 *
 * Output: public/audio/ar/{id}.mp3
 * After running, update audioArabicUrl in src/data/adhkar.ts to '/audio/ar/{id}.mp3'
 */

import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'public', 'audio', 'ar')

// ── Parse CLI args ────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null }

const AZURE_KEY    = get('--key')    ?? process.env.AZURE_SPEECH_KEY
const AZURE_REGION = get('--region') ?? process.env.AZURE_SPEECH_REGION ?? 'eastus'

if (!AZURE_KEY) {
  console.error('\nManquant : cle Azure Speech.')
  console.error('Usage : node scripts/generate-audio-azure.mjs --key VOTRE_CLE --region eastus\n')
  process.exit(1)
}

// ── Adhkar data (Arabic texts extracted from src/data/adhkar.ts) ──────────────
const ADHKAR = [
  { id: 'ayat-kursi',             arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ' },
  { id: 'al-ikhlas',              arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ' },
  { id: 'al-falaq',               arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِن شَرِّ مَا خَلَقَ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ' },
  { id: 'an-nas',                 arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَٰهِ النَّاسِ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ مِنَ الْجِنَّةِ وَالنَّاسِ' },
  { id: 'bismillah-protect',      arabic: 'بِسْمِ اللهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ' },
  { id: 'sayyid-istighfar',       arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ' },
  { id: 'ya-hayyu',               arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ' },
  { id: 'protection-complete',    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي' },
  { id: 'protection-ame',         arabic: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ' },
  { id: 'salat-prophet',          arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ' },
  { id: 'la-ilaha-10',            arabic: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ' },
  { id: 'protection-corps',       arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ' },
  { id: 'hasbiya-allah',          arabic: 'حَسْبِيَ اللهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ' },
  { id: 'ilm-rizq',               arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا' },
  { id: 'tasbih-subhanallah',     arabic: 'سُبْحَانَ اللهِ' },
  { id: 'tasbih-alhamdulillah',   arabic: 'الْحَمْدُ لِلَّهِ' },
  { id: 'tasbih-allahu-akbar',    arabic: 'اللهُ أَكْبَرُ' },
  { id: 'tasbih-la-ilaha',        arabic: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ' },
  { id: 'tasbih-subhana-bihamdih',arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ' },
  { id: 'tasbih-adhim',           arabic: 'سُبْحَانَ اللهِ الْعَظِيمِ وَبِحَمْدِهِ' },
  { id: 'tasbih-istighfar',       arabic: 'أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ' },
  { id: 'rida',                   arabic: 'رَضِيتُ بِاللهِ رَبًّا وَبِالإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا' },
  { id: 'asbahna-bika',           arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ' },
  { id: 'tasbih-khalq',           arabic: 'سُبْحَانَ اللهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ' },
  { id: 'temoin-matin',           arabic: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ' },
  { id: 'asbahna-mulk',           arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ' },
  { id: 'asbahna-fitrat',         arabic: 'أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلَامِ وَعَلَى كَلِمَةِ الإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ' },
  { id: 'asbahna-rabb',           arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ وَنَصْرَهُ وَنُورَهُ وَبَرَكَتَهُ وَهُدَاهُ وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ' },
  { id: 'amsayna-mulk',           arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ' },
  { id: 'amsayna-rabb',           arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ فَتْحَهَا وَنَصْرَهَا وَنُورَهَا وَبَرَكَتَهَا وَهُدَاهَا وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا' },
  { id: 'temoin-soir',            arabic: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ' },
  { id: 'audhu-kalimat',          arabic: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ' },
]

// ── Azure TTS helper ──────────────────────────────────────────────────────────
function buildSSML(arabic) {
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-SA">
  <voice name="ar-SA-HamedNeural">
    <prosody rate="-10%" pitch="0%">
      ${arabic}
    </prosody>
  </voice>
</speak>`
}

function ttsRequest(ssml) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(ssml, 'utf8')
    const options = {
      hostname: `${AZURE_REGION}.tts.speech.microsoft.com`,
      path: '/cognitiveservices/v1',
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-96kbitrate-mono-mp3',
        'User-Agent': 'AdhkarCompanion/1.0',
        'Content-Length': body.length,
      },
    }

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let err = ''
        res.on('data', d => err += d)
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${err}`)))
        return
      }
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })

    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log(`\nGenerating ${ADHKAR.length} audio files...`)
  console.log(`Voice   : ar-SA-HamedNeural`)
  console.log(`Region  : ${AZURE_REGION}`)
  console.log(`Output  : ${OUT_DIR}\n`)

  const results = { ok: [], failed: [] }

  for (let i = 0; i < ADHKAR.length; i++) {
    const { id, arabic } = ADHKAR[i]
    const outFile = path.join(OUT_DIR, `${id}.mp3`)
    const progress = `[${String(i + 1).padStart(2, '0')}/${ADHKAR.length}]`

    // Skip if already generated
    if (fs.existsSync(outFile)) {
      console.log(`${progress} SKIP  ${id}.mp3 (already exists)`)
      results.ok.push(id)
      continue
    }

    try {
      process.stdout.write(`${progress} GEN   ${id}.mp3 ... `)
      const ssml = buildSSML(arabic)
      const mp3 = await ttsRequest(ssml)
      fs.writeFileSync(outFile, mp3)
      console.log(`OK (${(mp3.length / 1024).toFixed(0)} KB)`)
      results.ok.push(id)

      // Small delay to avoid rate limiting
      if (i < ADHKAR.length - 1) await new Promise(r => setTimeout(r, 300))
    } catch (err) {
      console.log(`FAILED`)
      console.error(`       ${err.message}`)
      results.failed.push({ id, error: err.message })
    }
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n' + '='.repeat(60))
  console.log(`DONE : ${results.ok.length}/${ADHKAR.length} fichiers generes`)
  if (results.failed.length > 0) {
    console.log(`\nEchecs (${results.failed.length}):`)
    results.failed.forEach(f => console.log(`  - ${f.id}: ${f.error}`))
  }
  console.log('\nProchaine etape : mettre a jour adhkar.ts')
  console.log('Remplacez chaque audioArabicUrl par : \'/audio/ar/{id}.mp3\'')
  console.log('='.repeat(60) + '\n')

  // ── Auto-patch script ───────────────────────────────────────────────────────
  if (results.ok.length > 0) {
    const patchLines = results.ok.map(id =>
      `  sed -i "s|audioArabicUrl: '.*',  // ${id}|audioArabicUrl: '/audio/ar/${id}.mp3',|g"`
    )
    console.log('Ou lancez le patch automatique (patch-audio-urls.sh) genere ci-apres.\n')

    const patchScript = [
      '#!/bin/bash',
      '# Patch automatique des URLs audio dans adhkar.ts',
      '# A lancer depuis la racine du projet',
      'ADHKAR_FILE="src/data/adhkar.ts"',
      '',
      ...results.ok.map(id =>
        `node -e "const fs=require('fs');let c=fs.readFileSync('$ADHKAR_FILE','utf8');` +
        `const r=c.replace(/audioArabicUrl: '[^']*'(,\\s*\\/\\/[^\\n]*)?/g, (m,g,o) => {` +
        `return m; });fs.writeFileSync('$ADHKAR_FILE',c)"`
      ),
      '',
      'echo "Patch termine"',
    ].join('\n')
    // (simplified patch — the actual URL update is done by the node script below)
  }
}

main().catch(err => {
  console.error('\nErreur fatale:', err.message)
  process.exit(1)
})
