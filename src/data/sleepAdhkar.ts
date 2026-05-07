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
  audioArabicUrl?: string
  isQuran?: boolean
}

const ayatKursi = getAdhkarById('ayat-kursi')

export const SLEEP_ADHKAR: SleepItem[] = [

  {
    id: 'al-mulk',
    number: 1,
    title: 'Sourate Al-Mulk',
    titleAr: 'سورة الملك',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nتَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝١ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ۝٢ الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ ۝٣ ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ ۝٤ وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ ۝٥ وَلِلَّذِينَ كَفَرُوا بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ الْمَصِيرُ ۝٦ إِذَا أُلْقُوا فِيهَا سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ ۝٧ تَكَادُ تَمَيَّزُ مِنَ الْغَيْظِ ۖ كُلَّمَا أُلْقِيَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَا أَلَمْ يَأْتِكُمْ نَذِيرٌ ۝٨ قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ اللَّهُ مِن شَيْءٍ إِنْ أَنتُمْ إِلَّا فِي ضَلَالٍ كَبِيرٍ ۝٩ وَقَالُوا لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِي أَصْحَابِ السَّعِيرِ ۝١٠ فَاعْتَرَفُوا بِذَنبِهِمْ فَسُحْقًا لِّأَصْحَابِ السَّعِيرِ ۝١١ إِنَّ الَّذِينَ يَخْشَوْنَ رَبَّهُم بِالْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ ۝١٢ وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ ۖ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ ۝١٣ أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ ۝١٤ هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِن رِّزْقِهِ ۖ وَإِلَيْهِ النُّشُورُ ۝١٥ أَأَمِنتُم مَّن فِي السَّمَاءِ أَن يَخْسِفَ بِكُمُ الْأَرْضَ فَإِذَا هِيَ تَمُورُ ۝١٦ أَمْ أَمِنتُم مَّن فِي السَّمَاءِ أَن يُرْسِلَ عَلَيْكُمْ حَاصِبًا ۖ فَسَتَعْلَمُونَ كَيْفَ نَذِيرِ ۝١٧ وَلَقَدْ كَذَّبَ الَّذِينَ مِن قَبْلِهِمْ فَكَيْفَ كَانَ نَكِيرِ ۝١٨ أَوَلَمْ يَرَوْا إِلَى الطَّيْرِ فَوْقَهُمْ صَافَّاتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا الرَّحْمَٰنُ ۚ إِنَّهُ بِكُلِّ شَيْءٍ بَصِيرٌ ۝١٩ أَمَّنْ هَٰذَا الَّذِي هُوَ جُندٌ لَّكُمْ يَنصُرُكُم مِّن دُونِ الرَّحْمَٰنِ ۚ إِنِ الْكَافِرُونَ إِلَّا فِي غُرُورٍ ۝٢٠ أَمَّنْ هَٰذَا الَّذِي يَرْزُقُكُمْ إِنْ أَمْسَكَ رِزْقَهُ ۚ بَل لَّجُّوا فِي عُتُوٍّ وَنُفُورٍ ۝٢١ أَفَمَن يَمْشِي مُكِبًّا عَلَىٰ وَجْهِهِ أَهْدَىٰ أَمَّن يَمْشِي سَوِيًّا عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ ۝٢٢ قُلْ هُوَ الَّذِي أَنشَأَكُمْ وَجَعَلَ لَكُمُ السَّمْعَ وَالْأَبْصَارَ وَالْأَفْئِدَةَ ۖ قَلِيلًا مَّا تَشْكُرُونَ ۝٢٣ قُلْ هُوَ الَّذِي ذَرَأَكُمْ فِي الْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ ۝٢٤ وَيَقُولُونَ مَتَىٰ هَٰذَا الْوَعْدُ إِن كُنتُمْ صَادِقِينَ ۝٢٥ قُلْ إِنَّمَا الْعِلْمُ عِندَ اللَّهِ وَإِنَّمَا أَنَا نَذِيرٌ مُّبِينٌ ۝٢٦ فَلَمَّا رَأَوْهُ زُلْفَةً سِيئَتْ وُجُوهُ الَّذِينَ كَفَرُوا وَقِيلَ هَٰذَا الَّذِي كُنتُم بِهِ تَدَّعُونَ ۝٢٧ قُلْ أَرَأَيْتُمْ إِنْ أَهْلَكَنِيَ اللَّهُ وَمَن مَّعِيَ أَوْ رَحِمَنَا فَمَن يُجِيرُ الْكَافِرِينَ مِنْ عَذَابٍ أَلِيمٍ ۝٢٨ قُلْ هُوَ الرَّحْمَٰنُ آمَنَّا بِهِ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِي ضَلَالٍ مُّبِينٍ ۝٢٩ قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَن يَأْتِيكُم بِمَاءٍ مَّعِينٍ ۝٣٠',
    transliteration: 'Bismillâhi r-Rahmâni r-Rahîm. Tabârakalladzî biyadihi-l-mulku wa huwa \'alâ kulli chay\'in qadîr...',
    translationFr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. (1) Béni soit Celui en Whose main est la royauté — Il est Omnipotent. (2) Celui qui a créé la mort et la vie afin de vous éprouver et de savoir qui de vous agira le mieux. Il est le Puissant, le Pardonneur. (3) Celui qui a créé sept cieux superposés. Tu ne vois aucune imperfection dans la création du Tout Miséricordieux. Regarde encore : y vois-tu la moindre fissure ? (4) Puis regarde deux fois encore : le regard te reviendra bredouille et épuisé. (5) Nous avons orné le ciel terrestre de lampes et en avons fait des projectiles contre les diables — Nous leur avons préparé le supplice de la Fournaise. (6) Pour ceux qui ont mécru envers leur Seigneur, il y a le supplice de l'Enfer. Quelle mauvaise destination ! (7) Lorsqu'ils y seront jetés, ils entendront son rugissement, et elle bouillonnera. (8) Elle sera sur le point d'éclater de rage. Chaque fois qu'un groupe y sera jeté, ses gardiens leur demanderont : « Ne vous est-il pas venu un avertisseur ? » (9) Ils diront : « Si, un avertisseur nous est venu, mais nous l'avons traité de menteur en disant : Allah n'a rien fait descendre. Vous n'étiez que dans un grand égarement. » (10) Ils diront : « Si nous avions écouté ou raisonné, nous ne serions pas parmi les habitants de la Fournaise. » (11) Ils reconnaîtront ainsi leur faute. Qu'ils soient loin de la miséricorde, les habitants de la Fournaise ! (12) Ceux qui craignent leur Seigneur sans Le voir auront un pardon et une grande récompense. (13) Que vous cachiez vos paroles ou les disiez tout haut, Il connaît le contenu des cœurs. (14) Celui qui a tout créé ne saurait-Il pas ? Il est le Subtil, le Parfaitement Informé. (15) C'est Lui qui vous a assujetti la terre. Parcourez-en les contrées et mangez de Sa provision. C'est vers Lui que sera la Résurrection. (16) Êtes-vous assurés que Celui qui est dans le ciel ne vous fera pas engloutir par la terre quand elle tremblera ? (17) Ou êtes-vous assurés que Celui qui est dans le ciel ne vous enverra pas une tornade ? Vous saurez alors ce qu'est Mon avertissement. (18) Ceux qui ont vécu avant eux ont démenti aussi — et quelle fut Ma réprobation ! (19) N'ont-ils pas vu les oiseaux au-dessus d'eux déployant leurs ailes et les repliant ? Seul le Tout Miséricordieux les maintient. Il voit toutes choses. (20) Qui est donc celui qui pourrait vous servir d'armée et vous secourir, en dehors du Tout Miséricordieux ? Les mécréants ne sont que dans l'illusion. (21) Qui est celui qui peut vous nourrir si Allah retient Sa subsistance ? Ils s'entêtent dans l'arrogance et la fuite. (22) Celui qui marche la tête inclinée est-il mieux guidé que celui qui marche debout sur un chemin droit ? (23) Dis : « C'est Lui qui vous a créés et vous a accordé l'ouïe, les regards et les cœurs. » Que vous rendez-vous peu reconnaissants ! (24) Dis : « C'est Lui qui vous a répandus sur la terre, et c'est vers Lui que vous serez rassemblés. » (25) Ils disent : « Quand sera tenue cette promesse, si vous êtes véridiques ? » (26) Dis : « La science n'appartient qu'à Allah. Je ne suis qu'un avertisseur explicite. » (27) Quand ils le verront s'approcher, les visages de ceux qui ont mécru s'assombriront, et on leur dira : « C'est cela que vous réclamiez ! » (28) Dis : « Que vous en semble, si Allah me fait périr ainsi que ceux qui sont avec moi, ou s'Il nous fait miséricorde, qui protégera les mécréants d'un douloureux châtiment ? » (29) Dis : « C'est Lui le Tout Miséricordieux. Nous avons cru en Lui et en Lui nous nous remettons. Vous saurez bientôt qui est dans un égarement manifeste. » (30) Dis : « Que vous en semble, si votre eau s'enfonçait dans la terre, qui vous en apporterait de jaillissante ? »",
    merit: "Le Prophète ﷺ a dit : « Une sourate du Coran de trente versets intercédera pour son lecteur jusqu'à ce qu'il soit pardonné : تَبَارَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ » — c'est Al-Mulk.",
    source: 'Abou Dawoud, At-Tirmidhi, Ibn Maja',
    audioArabicUrl: '/audio/ar/al-mulk.mp3',
    isQuran: true,
  },

  {
    id: 'ayat-kursi-sleep',
    number: 2,
    title: 'Ayat al-Kursi',
    titleAr: 'آية الكرسي',
    arabic: ayatKursi?.arabic ?? '',
    transliteration: ayatKursi?.transliteration ?? '',
    translationFr: ayatKursi?.translationFr ?? '',
    merit: "Celui qui récite Ayat al-Kursi avant de dormir, Allah lui désigne un ange pour le protéger toute la nuit et le Shaytan ne peut l'approcher jusqu'au matin.",
    source: 'Bukhari',
    audioArabicUrl: '/audio/ar/ayat-kursi.mp3',
    isQuran: true,
  },

  {
    id: 'baqarah-285-286',
    number: 3,
    title: 'Les deux derniers versets de Surat Al-Baqarah',
    titleAr: 'آخِرُ آيَتَيْنِ مِنْ سُورَةِ الْبَقَرَةِ',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝٢٨٥ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: "Âmanar-rasûlu bimâ unzila ilayhi mir-rabbihi wal-mu'minûn, kullun âmana billâhi wa malâ'ikatihi wa kutubihi wa rusulih, lâ nufarriqu bayna ahadin mir-rusulih, wa qâlû sami'nâ wa ata'nâ, ghufrânaka rabbanâ wa ilaykal-masîr. Lâ yukallifullâhu nafsan illâ wus'ahâ, lahâ mâ kasabat wa 'alayhâ maktasabat, rabbanâ lâ tu'âkhidhnâ in nasînâ aw akhta'nâ, rabbanâ wa lâ tahmil 'alaynâ isran kamâ hamaltahu 'alal-ladhîna min qablinâ, rabbanâ wa lâ tuhammilnâ mâ lâ tâqata lanâ bih, wa'fu 'annâ waghfir lanâ warhamnâ, anta mawlânâ fansurnâ 'alal-qawmil-kâfirîn.",
    translationFr: "Le Messager croit en ce qui lui a été révélé par son Seigneur, et les croyants aussi. Chacun croit en Allah, en Ses anges, en Ses livres et en Ses messagers — nous ne faisons aucune distinction entre Ses messagers. Ils disent : « Nous avons entendu et obéi. Accorde-nous Ton pardon, notre Seigneur. C'est vers Toi que s'effectue le retour. » Allah n'impose à chaque âme que ce qu'elle peut porter. À son bénéfice tout bien qu'elle gagne, et à sa charge tout mal qu'elle acquiert. Seigneur, ne nous punis pas si nous oublions ou commettons une erreur. Seigneur, ne nous impose pas un fardeau comme Tu en as imposé à ceux qui nous ont précédés. Seigneur, ne nous fais pas porter ce que nous n'avons pas la force de supporter. Efface nos fautes, pardonne-nous et aie pitié de nous. Tu es notre Maître, accorde-nous la victoire sur les gens mécréants.",
    merit: "Le Prophète ﷺ a dit : « Deux versets de la fin de la Sourate Al-Baqara suffisent à celui qui les récite pendant la nuit. »",
    source: 'Bukhari & Muslim',
    audioArabicUrl: '/audio/ar/baqarah-285-286.mp3',
    isQuran: true,
  },
]
