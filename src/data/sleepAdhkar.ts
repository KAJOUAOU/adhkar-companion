import { getAdhkarById } from './adhkar'
import type { AdhkarItem } from '../types'

export interface SleepItem {
  id: string
  number: number
  title: string
  titleAr: string
  arabic: string
  transliteration: string
  translationFr: string
  merit?: string
  source?: string
}

const ayatKursi = getAdhkarById('ayat-kursi')

export const SLEEP_ADHKAR: SleepItem[] = [
  // Al-Mulk — sera ajouté à l'étape 2
  // {
  //   id: 'al-mulk',
  //   number: 1,
  //   ...
  // },

  {
    id: 'ayat-kursi-sleep',
    number: 1,
    title: 'Ayat al-Kursi',
    titleAr: 'آية الكرسي',
    arabic: ayatKursi?.arabic ?? '',
    transliteration: ayatKursi?.transliteration ?? '',
    translationFr: ayatKursi?.translationFr ?? '',
    merit: "Celui qui récite Ayat al-Kursi avant de dormir, Allah lui désigne un ange pour le protéger toute la nuit et le Shaytan ne peut l'approcher jusqu'au matin.",
    source: 'Bukhari',
  },

  {
    id: 'baqarah-285-286',
    number: 2,
    title: 'Fin de Surat Al-Baqarah',
    titleAr: 'خاتمة سورة البقرة',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: "Âmanar-rasûlu bimâ unzila ilayhi mir-rabbihi wal-mu'minûn, kullun âmana billâhi wa malâ'ikatihi wa kutubihi wa rusulih, lâ nufarriqu bayna ahadin mir-rusulih, wa qâlû sami'nâ wa ata'nâ, ghufrânaka rabbanâ wa ilaykal-masîr. Lâ yukallifullâhu nafsan illâ wus'ahâ, lahâ mâ kasabat wa 'alayhâ maktasabat, rabbanâ lâ tu'âkhidhnâ in nasînâ aw akhta'nâ, rabbanâ wa lâ tahmil 'alaynâ isran kamâ hamaltahu 'alal-ladhîna min qablinâ, rabbanâ wa lâ tuhammilnâ mâ lâ tâqata lanâ bih, wa'fu 'annâ waghfir lanâ warhamnâ, anta mawlânâ fansurnâ 'alal-qawmil-kâfirîn.",
    translationFr: "Le Messager croit en ce qui lui a été révélé par son Seigneur, et les croyants aussi. Chacun croit en Allah, en Ses anges, en Ses livres et en Ses messagers — nous ne faisons aucune distinction entre Ses messagers. Ils disent : « Nous avons entendu et obéi. Accorde-nous Ton pardon, notre Seigneur. C'est vers Toi que s'effectue le retour. » Allah n'impose à chaque âme que ce qu'elle peut porter. À son bénéfice tout bien qu'elle gagne, et à sa charge tout mal qu'elle acquiert. Seigneur, ne nous punis pas si nous oublions ou commettons une erreur. Seigneur, ne nous impose pas un fardeau comme Tu en as imposé à ceux qui nous ont précédés. Seigneur, ne nous fais pas porter ce que nous n'avons pas la force de supporter. Efface nos fautes, pardonne-nous et aie pitié de nous. Tu es notre Maître, accorde-nous la victoire sur les gens mécréants.",
    merit: "Le Prophète ﷺ a dit : « Deux versets de la fin de la Sourate Al-Baqara suffisent à celui qui les récite pendant la nuit. »",
    source: 'Bukhari & Muslim',
  },
]
