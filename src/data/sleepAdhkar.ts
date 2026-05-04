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
}

const ayatKursi = getAdhkarById('ayat-kursi')

export const SLEEP_ADHKAR: SleepItem[] = [

  {
    id: 'al-mulk',
    number: 1,
    title: 'Sourate Al-Mulk',
    titleAr: 'سورة الملك',
    arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۝ تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ ۝ ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ ۝ ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ ۝ ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ ۝ وَلَقَدْ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنْيَا بِمَصَـٰبِيحَ وَجَعَلْنَـٰهَا رُجُومًا لِّلشَّيَـٰطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ ٱلسَّعِيرِ ۝ وَلِلَّذِينَ كَفَرُوا۟ بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ ٱلْمَصِيرُ ۝ إِذَآ أُلْقُوا۟ فِيهَا سَمِعُوا۟ لَهَا شَهِيقًا وَهِىَ تَفُورُ ۝ تَكَادُ تَمَيَّزُ مِنَ ٱلْغَيْظِ ۖ كُلَّمَآ أُلْقِىَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَآ أَلَمْ يَأْتِكُمْ نَذِيرٌ ۝ قَالُوا۟ بَلَىٰ قَدْ جَآءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ ٱللَّهُ مِن شَىْءٍ إِنْ أَنتُمْ إِلَّا فِى ضَلَـٰلٍ كَبِيرٍ ۝ وَقَالُوا۟ لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِىٓ أَصْحَـٰبِ ٱلسَّعِيرِ ۝ فَٱعْتَرَفُوا۟ بِذَنۢبِهِمْ فَسُحْقًا لِّأَصْحَـٰبِ ٱلسَّعِيرِ ۝ إِنَّ ٱلَّذِينَ يَخْشَوْنَ رَبَّهُم بِٱلْغَيْبِ لَهُم مَّغْفِرَةٌ وَأَجْرٌ كَبِيرٌ ۝ وَأَسِرُّوا۟ قَوْلَكُمْ أَوِ ٱجْهَرُوا۟ بِهِۦٓ ۖ إِنَّهُۥ عَلِيمٌۢ بِذَاتِ ٱلصُّدُورِ ۝ أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ ٱللَّطِيفُ ٱلْخَبِيرُ ۝ هُوَ ٱلَّذِى جَعَلَ لَكُمُ ٱلْأَرْضَ ذَلُولًا فَٱمْشُوا۟ فِى مَنَاكِبِهَا وَكُلُوا۟ مِن رِّزْقِهِۦ ۖ وَإِلَيْهِ ٱلنُّشُورُ ۝ ءَأَمِنتُم مَّن فِى ٱلسَّمَآءِ أَن يَخْسِفَ بِكُمُ ٱلْأَرْضَ فَإِذَا هِىَ تَمُورُ ۝ أَمْ أَمِنتُم مَّن فِى ٱلسَّمَآءِ أَن يُرْسِلَ عَلَيْكُمْ حَاصِبًا ۖ فَسَتَعْلَمُونَ كَيْفَ نَذِيرِ ۝ وَلَقَدْ كَذَّبَ ٱلَّذِينَ مِن قَبْلِهِمْ فَكَيْفَ كَانَ نَكِيرِ ۝ أَوَلَمْ يَرَوْا۟ إِلَى ٱلطَّيْرِ فَوْقَهُمْ صَـٰٓفَّـٰتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا ٱلرَّحْمَـٰنُ ۚ إِنَّهُۥ بِكُلِّ شَىْءٍۭ بَصِيرٌ ۝ أَمَّنْ هَـٰذَا ٱلَّذِى هُوَ جُندٌ لَّكُمْ يَنصُرُكُم مِّن دُونِ ٱلرَّحْمَـٰنِ ۚ إِنِ ٱلْكَـٰفِرُونَ إِلَّا فِى غُرُورٍ ۝ أَمَّنْ هَـٰذَا ٱلَّذِى يَرْزُقُكُمْ إِنْ أَمْسَكَ رِزْقَهُۥ ۚ بَل لَّجُّوا۟ فِى عُتُوٍّ وَنُفُورٍ ۝ أَفَمَن يَمْشِى مُكِبًّا عَلَىٰ وَجْهِهِۦٓ أَهْدَىٰٓ أَمَّن يَمْشِى سَوِيًّا عَلَىٰ صِرَٰطٍ مُّسْتَقِيمٍ ۝ قُلْ هُوَ ٱلَّذِىٓ أَنشَأَكُمْ وَجَعَلَ لَكُمُ ٱلسَّمْعَ وَٱلْأَبْصَـٰرَ وَٱلْأَفْـِٔدَةَ ۖ قَلِيلًا مَّا تَشْكُرُونَ ۝ قُلْ هُوَ ٱلَّذِى ذَرَأَكُمْ فِى ٱلْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ ۝ وَيَقُولُونَ مَتَىٰ هَـٰذَا ٱلْوَعْدُ إِن كُنتُمْ صَـٰدِقِينَ ۝ قُلْ إِنَّمَا ٱلْعِلْمُ عِندَ ٱللَّهِ وَإِنَّمَآ أَنَا۠ نَذِيرٌ مُّبِينٌ ۝ فَلَمَّا رَأَوْهُ زُلْفَةً سِيٓـَٔتْ وُجُوهُ ٱلَّذِينَ كَفَرُوا۟ وَقِيلَ هَـٰذَا ٱلَّذِى كُنتُم بِهِۦ تَدَّعُونَ ۝ قُلْ أَرَءَيْتُمْ إِنْ أَهْلَكَنِىَ ٱللَّهُ وَمَن مَّعِىَ أَوْ رَحِمَنَا فَمَن يُجِيرُ ٱلْكَـٰفِرِينَ مِنْ عَذَابٍ أَلِيمٍ ۝ قُلْ هُوَ ٱلرَّحْمَـٰنُ ءَامَنَّا بِهِۦ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِى ضَلَـٰلٍ مُّبِينٍ ۝ قُلْ أَرَءَيْتُمْ إِنْ أَصْبَحَ مَآؤُكُمْ غَوْرًا فَمَن يَأْتِيكُم بِمَآءٍ مَّعِينٍۭ',
    transliteration: 'Bismillâhi r-Rahmâni r-Rahîm. Tabârakalladzî biyadihi-l-mulku wa huwa \'alâ kulli chay\'in qadîr...',
    translationFr: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux. (1) Béni soit Celui en Whose main est la royauté — Il est Omnipotent. (2) Celui qui a créé la mort et la vie afin de vous éprouver et de savoir qui de vous agira le mieux. Il est le Puissant, le Pardonneur. (3) Celui qui a créé sept cieux superposés. Tu ne vois aucune imperfection dans la création du Tout Miséricordieux. Regarde encore : y vois-tu la moindre fissure ? (4) Puis regarde deux fois encore : le regard te reviendra bredouille et épuisé. (5) Nous avons orné le ciel terrestre de lampes et en avons fait des projectiles contre les diables — Nous leur avons préparé le supplice de la Fournaise. (6) Pour ceux qui ont mécru envers leur Seigneur, il y a le supplice de l'Enfer. Quelle mauvaise destination ! (7) Lorsqu'ils y seront jetés, ils entendront son rugissement, et elle bouillonnera. (8) Elle sera sur le point d'éclater de rage. Chaque fois qu'un groupe y sera jeté, ses gardiens leur demanderont : « Ne vous est-il pas venu un avertisseur ? » (9) Ils diront : « Si, un avertisseur nous est venu, mais nous l'avons traité de menteur en disant : Allah n'a rien fait descendre. Vous n'étiez que dans un grand égarement. » (10) Ils diront : « Si nous avions écouté ou raisonné, nous ne serions pas parmi les habitants de la Fournaise. » (11) Ils reconnaîtront ainsi leur faute. Qu'ils soient loin de la miséricorde, les habitants de la Fournaise ! (12) Ceux qui craignent leur Seigneur sans Le voir auront un pardon et une grande récompense. (13) Que vous cachiez vos paroles ou les disiez tout haut, Il connaît le contenu des cœurs. (14) Celui qui a tout créé ne saurait-Il pas ? Il est le Subtil, le Parfaitement Informé. (15) C'est Lui qui vous a assujetti la terre. Parcourez-en les contrées et mangez de Sa provision. C'est vers Lui que sera la Résurrection. (16) Êtes-vous assurés que Celui qui est dans le ciel ne vous fera pas engloutir par la terre quand elle tremblera ? (17) Ou êtes-vous assurés que Celui qui est dans le ciel ne vous enverra pas une tornade ? Vous saurez alors ce qu'est Mon avertissement. (18) Ceux qui ont vécu avant eux ont démenti aussi — et quelle fut Ma réprobation ! (19) N'ont-ils pas vu les oiseaux au-dessus d'eux déployant leurs ailes et les repliant ? Seul le Tout Miséricordieux les maintient. Il voit toutes choses. (20) Qui est donc celui qui pourrait vous servir d'armée et vous secourir, en dehors du Tout Miséricordieux ? Les mécréants ne sont que dans l'illusion. (21) Qui est celui qui peut vous nourrir si Allah retient Sa subsistance ? Ils s'entêtent dans l'arrogance et la fuite. (22) Celui qui marche la tête inclinée est-il mieux guidé que celui qui marche debout sur un chemin droit ? (23) Dis : « C'est Lui qui vous a créés et vous a accordé l'ouïe, les regards et les cœurs. » Que vous rendez-vous peu reconnaissants ! (24) Dis : « C'est Lui qui vous a répandus sur la terre, et c'est vers Lui que vous serez rassemblés. » (25) Ils disent : « Quand sera tenue cette promesse, si vous êtes véridiques ? » (26) Dis : « La science n'appartient qu'à Allah. Je ne suis qu'un avertisseur explicite. » (27) Quand ils le verront s'approcher, les visages de ceux qui ont mécru s'assombriront, et on leur dira : « C'est cela que vous réclamiez ! » (28) Dis : « Que vous en semble, si Allah me fait périr ainsi que ceux qui sont avec moi, ou s'Il nous fait miséricorde, qui protégera les mécréants d'un douloureux châtiment ? » (29) Dis : « C'est Lui le Tout Miséricordieux. Nous avons cru en Lui et en Lui nous nous remettons. Vous saurez bientôt qui est dans un égarement manifeste. » (30) Dis : « Que vous en semble, si votre eau s'enfonçait dans la terre, qui vous en apporterait de jaillissante ? »",
    merit: "Le Prophète ﷺ a dit : « Une sourate du Coran de trente versets intercédera pour son lecteur jusqu'à ce qu'il soit pardonné : تَبَارَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ » — c'est Al-Mulk.",
    source: 'Abou Dawoud, At-Tirmidhi, Ibn Maja',
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
  },

  {
    id: 'baqarah-285-286',
    number: 3,
    title: 'Fin de Surat Al-Baqarah',
    titleAr: 'خاتمة سورة البقرة',
    arabic: 'آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ ۝ لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    transliteration: "Âmanar-rasûlu bimâ unzila ilayhi mir-rabbihi wal-mu'minûn, kullun âmana billâhi wa malâ'ikatihi wa kutubihi wa rusulih, lâ nufarriqu bayna ahadin mir-rusulih, wa qâlû sami'nâ wa ata'nâ, ghufrânaka rabbanâ wa ilaykal-masîr. Lâ yukallifullâhu nafsan illâ wus'ahâ, lahâ mâ kasabat wa 'alayhâ maktasabat, rabbanâ lâ tu'âkhidhnâ in nasînâ aw akhta'nâ, rabbanâ wa lâ tahmil 'alaynâ isran kamâ hamaltahu 'alal-ladhîna min qablinâ, rabbanâ wa lâ tuhammilnâ mâ lâ tâqata lanâ bih, wa'fu 'annâ waghfir lanâ warhamnâ, anta mawlânâ fansurnâ 'alal-qawmil-kâfirîn.",
    translationFr: "Le Messager croit en ce qui lui a été révélé par son Seigneur, et les croyants aussi. Chacun croit en Allah, en Ses anges, en Ses livres et en Ses messagers — nous ne faisons aucune distinction entre Ses messagers. Ils disent : « Nous avons entendu et obéi. Accorde-nous Ton pardon, notre Seigneur. C'est vers Toi que s'effectue le retour. » Allah n'impose à chaque âme que ce qu'elle peut porter. À son bénéfice tout bien qu'elle gagne, et à sa charge tout mal qu'elle acquiert. Seigneur, ne nous punis pas si nous oublions ou commettons une erreur. Seigneur, ne nous impose pas un fardeau comme Tu en as imposé à ceux qui nous ont précédés. Seigneur, ne nous fais pas porter ce que nous n'avons pas la force de supporter. Efface nos fautes, pardonne-nous et aie pitié de nous. Tu es notre Maître, accorde-nous la victoire sur les gens mécréants.",
    merit: "Le Prophète ﷺ a dit : « Deux versets de la fin de la Sourate Al-Baqara suffisent à celui qui les récite pendant la nuit. »",
    source: 'Bukhari & Muslim',
  },
]
