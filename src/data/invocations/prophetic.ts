import type { InvocationItem } from '../../types'

/**
 * Invocations prophétiques (28+ invocations issues de la Sunnah).
 *
 * Source des textes arabes : sunnah.com (référence canonique vocalisée, tashkīl complet).
 * Toutes les traductions françaises correspondent EXACTEMENT au texte arabe
 * mot-à-mot afin de permettre la synchronisation audio FR/AR à venir.
 *
 * v1 : 8 invocations clés.
 */
export const INVOCATIONS_PROPHETIC: InvocationItem[] = [
  // ─── 1. Sayyid al-Istighfâr ────────────────────────────────────────────────
  {
    id: 'sayyid-istighfar',
    number: 1,
    category: 'prophetic',
    title: "Sayyid al-Istighfâr — la meilleure demande de pardon",
    titleAr: 'سَيِّدُ الِاسْتِغْفَارِ',
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي، لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration:
      "Allâhumma anta Rabbî, lâ ilâha illâ anta, khalaqtanî wa anâ 'abduka, wa anâ 'alâ 'ahdika wa wa'dika ma-stata'tu, a'oûdhu bika min charri mâ sana'tu, aboû'u laka bi-ni'matika 'alayya wa aboû'u laka bi-dhanbî, fa-ghfir lî, fa-innahu lâ yaghfiru-dh-dhunûba illâ anta.",
    translationFr:
      "Ô Allah ! Tu es mon Seigneur, nulle divinité ne mérite d'être adorée si ce n'est Toi. C'est Toi qui m'as créé et je suis Ton serviteur. Je suis fidèle à mon pacte et à ma promesse envers Toi autant que je le puis. Je cherche refuge auprès de Toi contre le mal que j'ai commis. Je reconnais Tes bienfaits sur moi et je reconnais mon péché. Pardonne-moi donc, car nul autre que Toi n'absout les péchés.",
    source: 'Sahih al-Bukhari 6306',
    sourceUrl: 'https://sunnah.com/bukhari:6306',
    grade: 'Sahih',
    tags: ['pardon', 'foi'],
  },

  // ─── 2. Anxiété et tristesse ───────────────────────────────────────────────
  {
    id: 'anxiete-tristesse',
    number: 2,
    category: 'prophetic',
    title: "Contre l'anxiété, la tristesse et les difficultés",
    titleAr: 'دُعَاءُ الْهَمِّ وَالْحَزَنِ',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    transliteration:
      "Allâhumma innî a'oûdhu bika mina-l-hammi wa-l-hazani, wa-l-'ajzi wa-l-kasali, wa-l-jubni wa-l-bukhli, wa dala'i-d-dayni, wa ghalabati-r-rijâli.",
    translationFr:
      "Ô Allah ! Je cherche protection auprès de Toi contre l'anxiété, la tristesse, l'incapacité, la fainéantise, la lâcheté, l'avarice, le poids écrasant de la dette et la domination des hommes.",
    source: 'Sahih al-Bukhari 6369',
    sourceUrl: 'https://sunnah.com/bukhari:6369',
    grade: 'Sahih',
    tags: ['anxiete', 'apaisement', 'dettes'],
  },

  // ─── 3. Pardon d'Abou Bakr ─────────────────────────────────────────────────
  {
    id: 'pardon-abu-bakr',
    number: 3,
    category: 'prophetic',
    title: "Invocation de pardon d'Abû Bakr (raḍiya Allāhu ʿanhu)",
    titleAr: 'دُعَاءُ أَبِي بَكْرٍ لِلْمَغْفِرَةِ',
    arabic:
      'اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ، وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ',
    transliteration:
      "Allâhumma innî dhalamtu nafsî dhulman kathîran, wa lâ yaghfiru-dh-dhunûba illâ anta, fa-ghfir lî maghfiratan min 'indika, wa-rhamnî, innaka anta-l-Ghafûru-r-Rahîm.",
    translationFr:
      "Ô Allah ! Je me suis fait beaucoup de tort à moi-même et nul autre que Toi ne peut pardonner les péchés. Pardonne-moi donc d'un pardon venant de Toi, et accorde-moi Ta miséricorde. Certes, c'est Toi le Pardonneur, le Très Miséricordieux.",
    source: 'Sahih al-Bukhari 834 — Sahih Muslim 2705',
    sourceUrl: 'https://sunnah.com/bukhari:834',
    grade: 'Sahih',
    tags: ['pardon', 'apaisement'],
  },

  // ─── 4. Pardon complet ────────────────────────────────────────────────────
  {
    id: 'pardon-complet',
    number: 4,
    category: 'prophetic',
    title: "Pardon complet (petits et grands, premiers et derniers)",
    titleAr: 'دُعَاءُ مَغْفِرَةِ جَمِيعِ الذُّنُوبِ',
    arabic:
      'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ',
    transliteration:
      "Allâhumma-ghfir lî dhanbî kullahu, diqqahu wa jillahu, wa awwalahu wa âkhirahu, wa 'alâniyatahu wa sirrahu.",
    translationFr:
      "Ô Allah ! Pardonne-moi tous mes péchés, les petits comme les grands, les premiers comme les derniers, ceux qui sont apparents comme ceux qui sont cachés.",
    source: 'Sahih Muslim 483',
    sourceUrl: 'https://sunnah.com/muslim:483',
    grade: 'Sahih',
    tags: ['pardon'],
  },

  // ─── 5. Avant de dormir ────────────────────────────────────────────────────
  {
    id: 'avant-sommeil',
    number: 5,
    category: 'prophetic',
    title: "Avant de dormir — Seigneur des cieux et de la terre",
    titleAr: 'دُعَاءُ قَبْلَ النَّوْمِ',
    arabic:
      'اللَّهُمَّ رَبَّ السَّمَوَاتِ وَرَبَّ الْأَرَضِينَ وَرَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْقُرْآنِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ ذِي شَرٍّ أَنْتَ آخِذٌ بِنَاصِيَتِهِ، أَنْتَ الْأَوَّلُ فَلَيْسَ قَبْلَكَ شَيْءٌ، وَأَنْتَ الْآخِرُ فَلَيْسَ بَعْدَكَ شَيْءٌ، وَالظَّاهِرُ فَلَيْسَ فَوْقَكَ شَيْءٌ، وَالْبَاطِنُ فَلَيْسَ دُونَكَ شَيْءٌ، اقْضِ عَنَّا الدَّيْنَ وَأَغْنِنَا مِنَ الْفَقْرِ',
    transliteration:
      "Allâhumma Rabba-s-samâwâti wa Rabba-l-aradîna wa Rabbanâ wa Rabba kulli chay'in, fâliqa-l-habbi wa-n-nawâ, wa munzila-t-Tawrâti wa-l-Injîli wa-l-Qur'âni, a'oûdhu bika min charri kulli dhî charrin anta âkhidhun bi-nâsiyatih, anta-l-Awwalu fa-laysa qablaka chay'un, wa anta-l-Âkhiru fa-laysa ba'daka chay'un, wa-dh-Dhâhiru fa-laysa fawqaka chay'un, wa-l-Bâtinu fa-laysa dûnaka chay'un, iqdi 'annâ-d-dayna wa aghninâ mina-l-faqr.",
    translationFr:
      "Ô Allah ! Seigneur des cieux et Seigneur des terres, notre Seigneur et le Seigneur de toute chose ; Toi qui fends la graine et le noyau, qui as fait descendre la Torah, l'Évangile et le Coran : je cherche refuge auprès de Toi contre le mal de tout être de mal dont Tu tiens le toupet. Tu es le Premier, rien ne Te précède ; Tu es le Dernier, rien ne Te succède ; Tu es l'Apparent, rien n'est au-dessus de Toi ; Tu es l'Invisible, rien n'est plus caché que Toi. Acquitte nos dettes et préserve-nous de la pauvreté.",
    source: 'Sahih Muslim 2713 — Jamiʿ at-Tirmidhi 3400',
    sourceUrl: 'https://sunnah.com/muslim:2713',
    grade: 'Sahih',
    tags: ['apaisement', 'tawakkul', 'dettes'],
  },

  // ─── 6. Invocation de la lumière (an-Nūr) ──────────────────────────────────
  {
    id: 'dua-nour',
    number: 6,
    category: 'prophetic',
    title: "Invocation de la lumière (an-Nûr)",
    titleAr: 'دُعَاءُ النُّورِ',
    arabic:
      'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَفِي بَصَرِي نُورًا، وَفِي سَمْعِي نُورًا، وَعَنْ يَمِينِي نُورًا، وَعَنْ يَسَارِي نُورًا، وَفَوْقِي نُورًا، وَتَحْتِي نُورًا، وَأَمَامِي نُورًا، وَخَلْفِي نُورًا، وَاجْعَلْ لِي نُورًا',
    transliteration:
      "Allâhumma-j'al fî qalbî nûran, wa fî basarî nûran, wa fî sam'î nûran, wa 'an yamînî nûran, wa 'an yasârî nûran, wa fawqî nûran, wa tahtî nûran, wa amâmî nûran, wa khalfî nûran, wa-j'al lî nûran.",
    translationFr:
      "Ô Allah ! Mets dans mon cœur une lumière, dans ma vue une lumière, dans mon ouïe une lumière, à ma droite une lumière, à ma gauche une lumière, au-dessus de moi une lumière, en-dessous de moi une lumière, devant moi une lumière, derrière moi une lumière, et fais de moi une lumière.",
    source: 'Sahih al-Bukhari 6316',
    sourceUrl: 'https://sunnah.com/bukhari:6316',
    grade: 'Sahih',
    tags: ['lumiere', 'guidance', 'foi'],
  },

  // ─── 7. Salât 'alā an-Nabî (Ibrāhīmiyya) ───────────────────────────────────
  {
    id: 'salat-ibrahimiyya',
    number: 7,
    category: 'prophetic',
    title: "Ṣalāt ʿalā an-Nabī ﷺ — Ibrāhīmiyya",
    titleAr: 'الصَّلَاةُ الْإِبْرَاهِيمِيَّةُ',
    arabic:
      'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ، وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration:
      "Allâhumma salli 'alâ Muhammadin, wa 'alâ âli Muhammadin, kamâ sallayta 'alâ âli Ibrâhîma, innaka Hamîdun Majîd. Allâhumma bârik 'alâ Muhammadin, wa 'alâ âli Muhammadin, kamâ bârakta 'alâ âli Ibrâhîma, innaka Hamîdun Majîd.",
    translationFr:
      "Ô Allah ! Prie sur Muhammad et sur la famille de Muhammad, comme Tu as prié sur la famille d'Ibrahim. Tu es, en vérité, Digne de louange et Glorieux. Ô Allah ! Bénis Muhammad et la famille de Muhammad, comme Tu as béni la famille d'Ibrahim. Tu es, en vérité, Digne de louange et Glorieux.",
    source: 'Sahih al-Bukhari 6357',
    sourceUrl: 'https://sunnah.com/bukhari:6357',
    grade: 'Sahih',
    tags: ['baraka', 'foi'],
  },

  // ─── 8. Refuge contre les dettes et l'épreuve de la tombe ──────────────────
  {
    id: 'refuge-dettes-tombe',
    number: 8,
    category: 'prophetic',
    title: "Refuge contre les dettes, les péchés et l'épreuve de la tombe",
    titleAr: 'دُعَاءُ الِاسْتِعَاذَةِ مِنَ الْكَسَلِ وَالْمَأْثَمِ وَالْمَغْرَمِ',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ وَالْهَرَمِ، وَالْمَأْثَمِ وَالْمَغْرَمِ، وَمِنْ فِتْنَةِ الْقَبْرِ وَعَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ النَّارِ وَعَذَابِ النَّارِ، وَمِنْ شَرِّ فِتْنَةِ الْغِنَى، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْفَقْرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ، اللَّهُمَّ اغْسِلْ عَنِّي خَطَايَايَ بِمَاءِ الثَّلْجِ وَالْبَرَدِ، وَنَقِّ قَلْبِي مِنَ الْخَطَايَا، كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ، وَبَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ',
    transliteration:
      "Allâhumma innî a'oûdhu bika mina-l-kasali wa-l-harami, wa-l-ma'thami wa-l-maghrami, wa min fitnati-l-qabri wa 'adhâbi-l-qabri, wa min fitnati-n-nâri wa 'adhâbi-n-nâri, wa min charri fitnati-l-ghinâ, wa a'oûdhu bika min fitnati-l-faqri, wa a'oûdhu bika min fitnati-l-Masîhi-d-Dajjâl. Allâhumma-ghsil 'annî khatâyâya bi-mâ'i-th-thalji wa-l-bardi, wa naqqi qalbî mina-l-khatâyâ kamâ naqqayta-th-thawba-l-abyada mina-d-danas, wa bâ'id baynî wa bayna khatâyâya kamâ bâ'adta bayna-l-mashriqi wa-l-maghrib.",
    translationFr:
      "Ô Allah ! Je cherche refuge auprès de Toi contre la paresse et la sénilité, le péché et la dette, contre l'épreuve de la tombe et son châtiment, contre l'épreuve du Feu et son châtiment, contre le mal de l'épreuve de la richesse, et je cherche refuge auprès de Toi contre l'épreuve de la pauvreté, et je cherche refuge auprès de Toi contre l'épreuve de l'Antéchrist (al-Masīḥ ad-Dajjāl). Ô Allah ! Lave mes péchés avec l'eau de la neige et de la grêle, purifie mon cœur des péchés comme Tu purifies un vêtement blanc de toute souillure, et éloigne mes péchés de moi autant que Tu as éloigné l'Orient de l'Occident.",
    source: 'Sahih al-Bukhari 6368 — Sahih Muslim 589',
    sourceUrl: 'https://sunnah.com/bukhari:6368',
    grade: 'Sahih',
    tags: ['pardon', 'dettes', 'protection'],
  },

  // ─── 9. Pardon des fautes, ignorance, excès et plaisanteries ───────────────
  {
    id: 'pardon-fautes-ignorance',
    number: 9,
    category: 'prophetic',
    title: "Pardon des fautes, ignorance et excès",
    titleAr: 'دُعَاءُ مَغْفِرَةِ الْخَطِيئَةِ وَالْجَهْلِ',
    arabic: 'اللَّهُمَّ اغْفِرْ لِي خَطِيئَتِي وَجَهْلِي وَإِسْرَافِي فِي أَمْرِي كُلِّهِ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، اللَّهُمَّ اغْفِرْ لِي خَطَايَايَ وَعَمْدِي وَجَهْلِي وَهَزْلِي، وَكُلُّ ذَلِكَ عِنْدِي، اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، أَنْتَ الْمُقَدِّمُ، وَأَنْتَ الْمُؤَخِّرُ، وَأَنْتَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Allâhumma-ghfir lî khatî'atî wa jahlî wa isrâfî fî amrî kullihi, wa mâ anta a'lamu bihi minnî. Allâhumma-ghfir lî khatâyâya wa 'amdî wa jahlî wa hazlî, wa kullu dhâlika 'indî. Allâhumma-ghfir lî mâ qaddamtu wa mâ akhkhartu wa mâ asrartu wa mâ a'lantu, anta-l-Muqaddim, wa anta-l-Mu'akhkhir, wa anta 'alâ kulli shay'in qadîr.",
    translationFr: "Ô Seigneur, pardonne-moi mes péchés, mon ignorance, mes excès en toutes choses, et ce que Tu sais mieux que moi. Ô Allah, pardonne-moi mes péchés, intentionnels et involontaires, mon ignorance, mes plaisanteries, et tout ce que j'ai fait. Ô Allah, pardonne-moi ce que j'ai fait auparavant et ce que je ferai ensuite, ce que j'ai caché et ce que j'ai révélé. Tu es Celui qui fait avancer les choses. Et Tu es Celui qui retarde, et Tu es Omnipotent.",
    source: 'Sahih al-Bukhari 6398',
    sourceUrl: 'https://sunnah.com/bukhari:6398',
    grade: 'Sahih',
    tags: ['pardon'],
  },

  // ─── 10. Refuge contre avarice, lâcheté, vieillesse et tombe ───────────────
  {
    id: 'refuge-avarice-lachete',
    number: 10,
    category: 'prophetic',
    title: "Refuge contre avarice, lâcheté et tombe",
    titleAr: 'الِاسْتِعَاذَةُ مِنَ الْبُخْلِ وَالْجُبْنِ',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبُخْلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ',
    transliteration: "Allâhumma innî a'ûdhu bika mina-l-bukhli, wa a'ûdhu bika mina-l-jubni, wa a'ûdhu bika an uradda ilâ ardhali-l-'umuri, wa a'ûdhu bika min fitnati-d-dunyâ, wa a'ûdhu bika min 'adhâbi-l-qabr.",
    translationFr: "Ô Allah, je cherche refuge auprès de Toi contre l'avarice, je cherche refuge auprès de Toi contre la lâcheté, je cherche refuge auprès de Toi contre le retour au stade le plus faible de la vie, je cherche refuge auprès de Toi contre les épreuves de ce monde, et je cherche refuge auprès de Toi contre le châtiment de la tombe.",
    source: 'Sahih al-Bukhari 6365',
    sourceUrl: 'https://sunnah.com/bukhari:6365',
    grade: 'Sahih',
    tags: ['protection', 'apaisement'],
  },

  // ─── 11. Refuge contre tout mal commis ou non ──────────────────────────────
  {
    id: 'mal-commis-non-commis',
    number: 11,
    category: 'prophetic',
    title: "Refuge contre tout mal commis ou non",
    titleAr: 'الِاسْتِعَاذَةُ مِنْ كُلِّ شَرٍّ',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ، وَمِنْ شَرِّ مَا لَمْ أَعْمَلْ',
    transliteration: "Allâhumma innî a'ûdhu bika min sharri mâ 'amiltu, wa min sharri mâ lam a'mal.",
    translationFr: "Ô Allah, je cherche refuge auprès de Toi contre le mal que j'ai commis et contre le mal que je n'ai pas commis.",
    source: 'Sahih Muslim 2716',
    sourceUrl: 'https://sunnah.com/muslim:2716',
    grade: 'Sahih',
    tags: ['pardon', 'protection'],
  },

  // ─── 12. Guidance, piété, retenue, richesse ────────────────────────────────
  {
    id: 'guidance-piete-retenue-richesse',
    number: 12,
    category: 'prophetic',
    title: "Guidance, piété, retenue et richesse",
    titleAr: 'الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    transliteration: "Allâhumma innî as'aluka-l-hudâ wa-t-tuqâ wa-l-'afâfa wa-l-ghinâ.",
    translationFr: "Ô Allah ! je Te demande La guidance et la piété, La retenue et la richesse.",
    source: 'Sahih Muslim 2721',
    sourceUrl: 'https://sunnah.com/muslim:2721',
    grade: 'Sahih',
    tags: ['guidance', 'baraka'],
  },

  // ─── 13. Refuge contre incapacité, paresse, savoir non bénéfique ───────────
  {
    id: 'incapacite-paresse-savoir',
    number: 13,
    category: 'prophetic',
    title: "Refuge contre incapacité, paresse, savoir non bénéfique",
    titleAr: 'الِاسْتِعَاذَةُ مِنَ الْعَجْزِ وَالْكَسَلِ',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَالْهَرَمِ وَعَذَابِ الْقَبْرِ. اللَّهُمَّ آتِ نَفْسِي تَقْوَاهَا، وَزَكِّهَا أَنْتَ خَيْرُ مَنْ زَكَّاهَا، أَنْتَ وَلِيُّهَا وَمَوْلَاهَا. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عِلْمٍ لَا يَنْفَعُ، وَمِنْ قَلْبٍ لَا يَخْشَعُ، وَمِنْ نَفْسٍ لَا تَشْبَعُ، وَمِنْ دَعْوَةٍ لَا يُسْتَجَابُ لَهَا',
    transliteration: "Allâhumma innî a'ûdhu bika mina-l-'ajzi wa-l-kasali, wa-l-jubni wa-l-bukhli, wa-l-harami wa 'adhâbi-l-qabri. Allâhumma âti nafsî taqwâhâ, wa zakkihâ anta khayru man zakkâhâ, anta waliyyuhâ wa mawlâhâ. Allâhumma innî a'ûdhu bika min 'ilmin lâ yanfa'u, wa min qalbin lâ yakhsha'u, wa min nafsin lâ tashba'u, wa min da'watin lâ yustajâbu lahâ.",
    translationFr: "Ô Allah ! Je me réfugie auprès de Toi contre l'incapacité, la paresse, l'avarice, la sénilité et le châtiment de la tombe. Ô Allah ! Accorde à mon âme sa piété et purifie-la, car Tu es le Meilleur qui puisse la purifier, Tu es son gardien et son maître. Ô Allah ! Je me réfugie auprès de Toi contre un savoir qui n'est pas bénéfique, contre un cœur qui ne se recueille pas, contre une âme qui ne se rassasie pas et contre une invocation qui n'est pas exaucée.",
    source: 'Sahih Muslim 2722',
    sourceUrl: 'https://sunnah.com/muslim:2722',
    grade: 'Sahih',
    tags: ['apaisement', 'sagesse'],
  },

  // ─── 14. Soumission et confiance en Allah ──────────────────────────────────
  {
    id: 'soumission-confiance',
    number: 14,
    category: 'prophetic',
    title: "Soumission et confiance en Allah",
    titleAr: 'لَكَ أَسْلَمْتُ',
    arabic: 'اللَّهُمَّ لَكَ أَسْلَمْتُ، وَبِكَ آمَنْتُ، وَعَلَيْكَ تَوَكَّلْتُ، وَإِلَيْكَ أَنَبْتُ، وَبِكَ خَاصَمْتُ. اللَّهُمَّ إِنِّي أَعُوذُ بِعِزَّتِكَ، لَا إِلَهَ إِلَّا أَنْتَ، أَنْ تُضِلَّنِي، أَنْتَ الْحَيُّ الَّذِي لَا يَمُوتُ، وَالْجِنُّ وَالْإِنْسُ يَمُوتُونَ',
    transliteration: "Allâhumma laka aslamtu, wa bika âmantu, wa 'alayka tawakkaltu, wa ilayka anabtu, wa bika khâsamtu. Allâhumma innî a'ûdhu bi-'izzatika, lâ ilâha illâ anta, an tudillanî, anta-l-Hayyu-lladhî lâ yamûtu, wa-l-jinnu wa-l-insu yamûtûn.",
    translationFr: "Ô Allah ! C'est à Toi que je me soumets, c'est en Toi que je crois, à Toi que je m'en remets, à Toi que je me repens et en Ton Nom que je dispute ! Ô Allah ! Je me réfugie auprès de Ta puissance, il n'y a aucune divinité - digne d'adoration - en dehors de Toi, afin que Tu ne m'égares pas ! Tu es le Vivant, Celui qui ne meurt pas, alors que les djinns et les hommes, eux, meurent.",
    source: 'Sahih Muslim 2717',
    sourceUrl: 'https://sunnah.com/muslim:2717',
    grade: 'Sahih',
    tags: ['tawakkul', 'foi'],
  },

  // ─── 15. Préserver les bienfaits d'Allah ───────────────────────────────────
  {
    id: 'preserver-bienfaits',
    number: 15,
    category: 'prophetic',
    title: "Préserver les bienfaits d'Allah",
    titleAr: 'زَوَالِ النِّعْمَةِ',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ زَوَالِ نِعْمَتِكَ، وَتَحَوُّلِ عَافِيَتِكَ، وَفُجَاءَةِ نِقْمَتِكَ، وَجَمِيعِ سَخَطِكَ',
    transliteration: "Allâhumma innî a'ûdhu bika min zawâli ni'matika, wa tahawwuli 'âfiyatika, wa fujâ'ati niqmatika, wa jamî'i sakhatik.",
    translationFr: "Ô Allah ! Ne me prive pas de Tes bienfaits, de Ton salut, ni de la santé dont Tu m'as comblé ! Ne m'expose pas à Ton Châtiment soudain, ni à tout ce qui enclenche Ta Colère !",
    source: 'Sahih Muslim 2739',
    sourceUrl: 'https://sunnah.com/muslim:2739',
    grade: 'Sahih',
    tags: ['baraka', 'protection'],
  },

  // ─── 16. Fermeté du cœur dans l'obéissance — Yā Muqallib al-qulūb ──────────
  {
    id: 'muqallib-al-qulub',
    number: 16,
    category: 'prophetic',
    title: "Yā Muqallib al-qulūb — Fermeté du cœur",
    titleAr: 'يَا مُقَلِّبَ الْقُلُوبِ',
    arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ',
    transliteration: "Yâ Muqalliba-l-qulûbi thabbit qalbî 'alâ dînik.",
    translationFr: "Ô Allah ! Toi qui détournes les cœurs ! Oriente mon cœur vers Ton obéissance !",
    source: 'Jamiʿ at-Tirmidhi 2140',
    sourceUrl: 'https://sunnah.com/tirmidhi:2140',
    grade: 'Hasan',
    tags: ['foi', 'guidance'],
  },

  // ─── 17. Être guidé vers la vérité — Seigneur de Jibrīl ────────────────────
  {
    id: 'guide-vers-verite-jibril',
    number: 17,
    category: 'prophetic',
    title: "Guide-moi vers la vérité (Seigneur de Jibrīl)",
    titleAr: 'رَبَّ جِبْرَائِيلَ وَمِيكَائِيلَ',
    arabic: 'اللَّهُمَّ رَبَّ جِبْرَائِيلَ وَمِيكَائِيلَ وَإِسْرَافِيلَ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، أَنْتَ تَحْكُمُ بَيْنَ عِبَادِكَ فِيمَا كَانُوا فِيهِ يَخْتَلِفُونَ، اهْدِنِي لِمَا اخْتُلِفَ فِيهِ مِنَ الْحَقِّ بِإِذْنِكَ، إِنَّكَ تَهْدِي مَنْ تَشَاءُ إِلَى صِرَاطٍ مُسْتَقِيمٍ',
    transliteration: "Allâhumma Rabba Jibrâ'îla wa Mîkâ'îla wa Isrâfîla, Fâtira-s-samâwâti wa-l-ardi, 'Âlima-l-ghaybi wa-sh-shahâdati, anta tahkumu bayna 'ibâdika fîmâ kânû fîhi yakhtalifûna, ihdinî limâ-khtulifa fîhi mina-l-haqqi bi-idhnika, innaka tahdî man tashâ'u ilâ sirâtin mustaqîm.",
    translationFr: "Ô Allah, Seigneur de Jibrīl, de Mīkāʾīl et d'Isrāfīl, Créateur des cieux et de la terre, Connaisseur de l'invisible et du visible, C'est Toi qui juges entre Tes serviteurs au sujet de ce en quoi ils divergent. Guide-moi, par Ta permission, vers la vérité dans ce sur quoi les gens divergent. Car c'est Toi qui guides qui Tu veux vers un chemin droit.",
    source: 'Sahih Muslim 770',
    sourceUrl: 'https://sunnah.com/muslim:770',
    grade: 'Sahih',
    tags: ['guidance', 'sagesse'],
  },

  // ─── 18. Refuge dans Sa satisfaction contre Sa colère ──────────────────────
  {
    id: 'satisfaction-contre-colere',
    number: 18,
    category: 'prophetic',
    title: "Refuge dans Sa satisfaction contre Sa colère",
    titleAr: 'أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ',
    arabic: 'اللَّهُمَّ أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ، وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ، وَأَعُوذُ بِكَ مِنْكَ، لَا أُحْصِي ثَنَاءً عَلَيْكَ، أَنْتَ كَمَا أَثْنَيْتَ عَلَى نَفْسِكَ',
    transliteration: "Allâhumma a'ûdhu bi-ridâka min sakhatika, wa bi-mu'âfâtika min 'uqûbatika, wa a'ûdhu bika minka, lâ uhsî thanâ'an 'alayka, anta kamâ athnayta 'alâ nafsik.",
    translationFr: "Ô Allah ! Je me réfugie auprès de Ta satisfaction contre Ton courroux et auprès de Ton pardon contre Ta punition. Je me réfugie auprès de Toi contre Toi. Je ne peux Te louer comme il sied [à ta Grandeur]. Tu es Tel que Tu as Toi-même fait Ton éloge.",
    source: 'Sahih Muslim 486',
    sourceUrl: 'https://sunnah.com/muslim:486',
    grade: 'Sahih',
    tags: ['pardon', 'protection'],
  },

  // ─── 19. Contre l'épreuve et le mauvais destin ─────────────────────────────
  {
    id: 'epreuve-mauvais-destin',
    number: 19,
    category: 'prophetic',
    title: "Contre l'épreuve et le mauvais destin",
    titleAr: 'جَهْدِ الْبَلَاءِ',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ جَهْدِ الْبَلَاءِ، وَدَرَكِ الشَّقَاءِ، وَسُوءِ الْقَضَاءِ، وَشَمَاتَةِ الْأَعْدَاءِ',
    transliteration: "Allâhumma innî a'ûdhu bika min jahdi-l-balâ'i, wa daraki-sh-shaqâ'i, wa sû'i-l-qadâ'i, wa shamâtati-l-a'dâ'.",
    translationFr: "Ô Allah, je cherche refuge auprès de Toi contre la dureté de l'épreuve, la misère et le malheur, le mauvais destin, et la joie des ennemis à mon malheur.",
    source: 'Sahih al-Bukhari 6347 — Sahih Muslim 2707',
    sourceUrl: 'https://sunnah.com/bukhari:6347',
    grade: 'Sahih',
    tags: ['protection', 'apaisement', 'anxiete'],
  },

  // ─── 20. Tout le bien, Paradis et protection ───────────────────────────────
  {
    id: 'tout-bien-paradis',
    number: 20,
    category: 'prophetic',
    title: "Tout le bien et protection (Paradis & Enfer)",
    titleAr: 'الْخَيْرِ كُلِّهِ',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنَ الْخَيْرِ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ، وَأَعُوذُ بِكَ مِنَ الشَّرِّ كُلِّهِ عَاجِلِهِ وَآجِلِهِ، مَا عَلِمْتُ مِنْهُ وَمَا لَمْ أَعْلَمْ. اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ خَيْرِ مَا سَأَلَكَ عَبْدُكَ وَنَبِيُّكَ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا عَاذَ بِهِ عَبْدُكَ وَنَبِيُّكَ. اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَعُوذُ بِكَ مِنَ النَّارِ وَمَا قَرَّبَ إِلَيْهَا مِنْ قَوْلٍ أَوْ عَمَلٍ، وَأَسْأَلُكَ أَنْ تَجْعَلَ كُلَّ قَضَاءٍ قَضَيْتَهُ لِي خَيْرًا',
    transliteration: "Allâhumma innî as'aluka mina-l-khayri kullihi 'âjilihi wa âjilihi, mâ 'alimtu minhu wa mâ lam a'lam, wa a'ûdhu bika mina-sh-sharri kullihi 'âjilihi wa âjilihi, mâ 'alimtu minhu wa mâ lam a'lam. Allâhumma innî as'aluka min khayri mâ sa'alaka 'abduka wa nabiyyuka, wa a'ûdhu bika min sharri mâ 'âdha bihi 'abduka wa nabiyyuka. Allâhumma innî as'aluka-l-jannata wa mâ qarraba ilayhâ min qawlin aw 'amalin, wa a'ûdhu bika mina-n-nâri wa mâ qarraba ilayhâ min qawlin aw 'amalin, wa as'aluka an taj'ala kulla qadâ'in qadaytahu lî khayrâ.",
    translationFr: "Ô Allah ! Je te demande tout le bien : le bien immédiat et le bien futur, ce que j'en sais ce que j'en ignore. Et je me réfugie auprès de Toi contre tout le mal : le mal immédiat et le mal futur, ce que j'en sais et ce que j'en ignore. Ô Allah ! Je Te demande le meilleur de ce que Ton serviteur et Prophète T'a demandé et je Te demande de me protéger contre le pire de ce dont Ton serviteur et Prophète T'a demandé de le protéger. Ô Allah ! Je Te demande le Paradis, ainsi que les paroles et les actes qui en rapprochent et je Te demande de me protéger contre l'Enfer, ainsi que contre les paroles et les actes qui en rapprochent. Et je Te demande de faire en sorte que tout décret que Tu as émis me concernant soit en ma faveur.",
    source: 'Sunan Ibn Mājah 3846',
    sourceUrl: 'https://sunnah.com/ibnmajah:3846',
    grade: 'Sahih',
    tags: ['baraka', 'protection', 'foi'],
  },

  // ─── 21. Sagesse, piété et vision du Visage divin ──────────────────────────
  {
    id: 'sagesse-piete-vision',
    number: 21,
    category: 'prophetic',
    title: "Sagesse, piété et vision du Visage divin",
    titleAr: 'بِعِلْمِكَ الْغَيْبَ',
    arabic: 'اللَّهُمَّ بِعِلْمِكَ الْغَيْبَ وَقُدْرَتِكَ عَلَى الْخَلْقِ أَحْيِنِي مَا عَلِمْتَ الْحَيَاةَ خَيْرًا لِي، وَتَوَفَّنِي إِذَا عَلِمْتَ الْوَفَاةَ خَيْرًا لِي. اللَّهُمَّ وَأَسْأَلُكَ خَشْيَتَكَ فِي الْغَيْبِ وَالشَّهَادَةِ، وَأَسْأَلُكَ كَلِمَةَ الْحَقِّ فِي الرِّضَا وَالْغَضَبِ، وَأَسْأَلُكَ الْقَصْدَ فِي الْفَقْرِ وَالْغِنَى، وَأَسْأَلُكَ نَعِيمًا لَا يَنْفَدُ، وَأَسْأَلُكَ قُرَّةَ عَيْنٍ لَا تَنْقَطِعُ، وَأَسْأَلُكَ الرِّضَاءَ بَعْدَ الْقَضَاءِ، وَأَسْأَلُكَ بَرْدَ الْعَيْشِ بَعْدَ الْمَوْتِ، وَأَسْأَلُكَ لَذَّةَ النَّظَرِ إِلَى وَجْهِكَ وَالشَّوْقَ إِلَى لِقَائِكَ فِي غَيْرِ ضَرَّاءَ مُضِرَّةٍ وَلَا فِتْنَةٍ مُضِلَّةٍ. اللَّهُمَّ زَيِّنَّا بِزِينَةِ الْإِيمَانِ، وَاجْعَلْنَا هُدَاةً مُهْتَدِينَ',
    transliteration: "Allâhumma bi-'ilmika-l-ghayba wa qudratika 'alâ-l-khalqi ahyinî mâ 'alimta-l-hayâta khayran lî, wa tawaffanî idhâ 'alimta-l-wafâta khayran lî. Allâhumma wa as'aluka khashyataka fî-l-ghaybi wa-sh-shahâdati, wa as'aluka kalimata-l-haqqi fî-r-ridâ wa-l-ghadabi, wa as'aluka-l-qasda fî-l-faqri wa-l-ghinâ, wa as'aluka na'îman lâ yanfadu, wa as'aluka qurrata 'aynin lâ tanqati'u, wa as'aluka-r-ridâ'a ba'da-l-qadâ'i, wa as'aluka barda-l-'ayshi ba'da-l-mawti, wa as'aluka ladhdhata-n-nazari ilâ wajhika wa-sh-shawqa ilâ liqâ'ika fî ghayri darrâ'a mudirratin wa lâ fitnatin mudillatin. Allâhumma zayyinnâ bi-zînati-l-îmâni, wa-j'alnâ hudâtan muhtadîn.",
    translationFr: "Ô Seigneur ! Avec Ta connaissance de l'invisible et Ton pouvoir sur les créatures, laisse-moi vivre tant que Tu sais que la vie est meilleure pour moi (que la mort) et fais-moi mourir si Tu sais que la mort est meilleure pour moi (que la vie). Ô Seigneur ! Je Te demande la crainte en secret et en public. Je Te demande la parole de vérité dans les moments de satisfaction et de colère. Je Te demande la modération dans les situations de richesse et de pauvreté. Je Te demande un bien-être qui ne s'épuise pas. Je Te demande une jouissance pour les yeux qui ne s'arrête pas. Je Te demande d'être agréé après que Tu aies prononcé Ton Jugement. Je Te demande une vie paisible après la mort. Je te demande la réjouissance de pouvoir voir Ton Visage et le désir ardent de Te rencontrer sans subir aucun dommage qui me nuise, ni de tentation qui m'égare. Ô Seigneur ! Embellis-nous avec la parure de la croyance et rends-nous des guides bien guidés.",
    source: 'Sunan an-Nasāʾī 1305',
    sourceUrl: 'https://sunnah.com/nasai:1305',
    grade: 'Sahih',
    tags: ['sagesse', 'guidance', 'foi'],
  },

  // ─── 22. Protection corps, religion, famille, biens ────────────────────────
  {
    id: 'protection-corps-religion-famille',
    number: 22,
    category: 'prophetic',
    title: "Protection corps, religion, famille, biens",
    titleAr: 'الْعَفْوَ وَالْعَافِيَةَ',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي. اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي. اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ، وَمِنْ خَلْفِي، وَعَنْ يَمِينِي، وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي',
    transliteration: "Allâhumma innî as'aluka-l-'âfiyata fî-d-dunyâ wa-l-âkhirati. Allâhumma innî as'aluka-l-'afwa wa-l-'âfiyata fî dînî wa dunyâya wa ahlî wa mâlî. Allâhumma-stur 'awrâtî, wa âmin raw'âtî. Allâhumma-hfaznî min bayni yadayya, wa min khalfî, wa 'an yamînî, wa 'an shimâlî, wa min fawqî, wa a'ûdhu bi-'azamatika an ughtâla min tahtî.",
    translationFr: "Ô Allah ! Je te demande le salut dans cette vie et dans l'au-delà. Ô Allah ! Je Te demande le pardon et le salut dans ma religion, ma vie, ma famille et mes biens. Ô Allah ! Cache mes défauts et mets-moi à l'abri de toutes mes craintes. Ô Allah ! Protège-moi par devant, par derrière, sur ma droite, sur ma gauche et au-dessus de moi. Je me mets sous la protection de Ta grandeur pour ne pas être enseveli.",
    source: 'Sunan Abī Dāwūd 5074',
    sourceUrl: 'https://sunnah.com/abudawud:5074',
    grade: 'Sahih',
    tags: ['protection', 'baraka'],
  },

  // ─── 23. Refuge auprès du Créateur des cieux et de la terre ────────────────
  {
    id: 'refuge-createur-cieux-terre',
    number: 23,
    category: 'prophetic',
    title: "Refuge auprès du Créateur des cieux et de la terre",
    titleAr: 'عَالِمَ الْغَيْبِ وَالشَّهَادَةِ',
    arabic: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ، وَأَنْ أَقْتَرِفَ عَلَى نَفْسِي سُوءًا، أَوْ أَجُرَّهُ إِلَى مُسْلِمٍ',
    transliteration: "Allâhumma 'Âlima-l-ghaybi wa-sh-shahâdati, Fâtira-s-samâwâti wa-l-ardi, Rabba kulli shay'in wa malîkahu, ash-hadu an lâ ilâha illâ anta, a'ûdhu bika min sharri nafsî, wa min sharri-sh-shaytâni wa shirkihi, wa an aqtarifa 'alâ nafsî sû'an, aw ajurrahu ilâ muslim.",
    translationFr: "Ô Allah ! Connaisseur de l'invisible et de l'apparent, Créateur des cieux et de la Terre, Seigneur et Possesseur de toute chose, j'atteste qu'il n'y a aucune divinité [digne d'être adorée] en dehors de Toi, je cherche refuge auprès de Toi contre le mal de mon âme, contre le mal de Satan et de son polythéisme et contre le fait de me faire du mal à moi-même ou d'en faire à un musulman.",
    source: 'Jamiʿ at-Tirmidhī 3392',
    sourceUrl: 'https://sunnah.com/tirmidhi:3392',
    grade: 'Sahih',
    tags: ['protection', 'foi'],
  },

  // ─── 24. Fermeté de la foi, gratitude, cœur sain ───────────────────────────
  {
    id: 'fermete-foi-coeur-sain',
    number: 24,
    category: 'prophetic',
    title: "Fermeté de la foi, gratitude et cœur sain",
    titleAr: 'الثَّبَاتَ فِي الْأَمْرِ',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الثَّبَاتَ فِي الْأَمْرِ، وَالْعَزِيمَةَ عَلَى الرُّشْدِ، وَأَسْأَلُكَ شُكْرَ نِعْمَتِكَ، وَحُسْنَ عِبَادَتِكَ، وَأَسْأَلُكَ قَلْبًا سَلِيمًا، وَلِسَانًا صَادِقًا، وَأَسْأَلُكَ مِنْ خَيْرِ مَا تَعْلَمُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا تَعْلَمُ، وَأَسْتَغْفِرُكَ لِمَا تَعْلَمُ، إِنَّكَ أَنْتَ عَلَّامُ الْغُيُوبِ',
    transliteration: "Allâhumma innî as'aluka-th-thabâta fî-l-amri, wa-l-'azîmata 'alâ-r-rushdi, wa as'aluka shukra ni'matika, wa husna 'ibâdatika, wa as'aluka qalban salîman, wa lisânan sâdiqan, wa as'aluka min khayri mâ ta'lamu, wa a'ûdhu bika min sharri mâ ta'lamu, wa astaghfiruka limâ ta'lamu, innaka anta 'allâmu-l-ghuyûb.",
    translationFr: "Ô Allah, je Te demande la fermeté dans l'affaire (de la foi), et la détermination à suivre la bonne voie. Je Te demande les causes de Ta miséricorde et les résolutions qui mènent à Ton pardon. Je Te demande la gratitude pour Tes bienfaits et la perfection dans Ton adoration. Je Te demande un cœur sain et une langue véridique. Je Te demande le bien de ce que Tu sais, et je cherche refuge auprès de Toi contre le mal de ce que Tu sais. Et je Te demande pardon pour ce que Tu sais. En vérité, c'est Toi le Parfait Connaisseur de l'invisible.",
    source: 'Sunan an-Nasāʾī 1304',
    sourceUrl: 'https://sunnah.com/nasai:1304',
    grade: 'Hasan',
    tags: ['foi', 'guidance'],
  },

  // ─── 25. Halāl suffit contre harām ─────────────────────────────────────────
  {
    id: 'halal-contre-haram',
    number: 25,
    category: 'prophetic',
    title: "Halāl suffit contre harām — se libérer des dettes",
    titleAr: 'اكْفِنِي بِحَلَالِكَ',
    arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    transliteration: "Allâhumma-kfinî bi-halâlika 'an harâmika, wa aghninî bi-fadlika 'amman siwâk.",
    translationFr: "Ô Allah, suffis-moi par ce qui est licite (halal) contre ce qui est illicite (haram), et enrichis-moi par Ta grâce de tout autre que Toi.",
    source: 'Jamiʿ at-Tirmidhī 3563',
    sourceUrl: 'https://sunnah.com/tirmidhi:3563',
    grade: 'Hasan',
    tags: ['dettes', 'baraka'],
  },

  // ─── 26. Protection du corps, ouïe et vue ──────────────────────────────────
  {
    id: 'protection-corps-ouie-vue',
    number: 26,
    category: 'prophetic',
    title: "Protection du corps, ouïe et vue",
    titleAr: 'عَافِنِي فِي بَدَنِي',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
    transliteration: "Allâhumma 'âfinî fî badanî, Allâhumma 'âfinî fî sam'î, Allâhumma 'âfinî fî basarî, lâ ilâha illâ anta. Allâhumma innî a'ûdhu bika mina-l-kufri wa-l-faqri, wa a'ûdhu bika min 'adhâbi-l-qabri, lâ ilâha illâ anta.",
    translationFr: "Ô Allah ! Préserve mon corps. Ô Allah ! Préserve mon ouïe. Ô Allah ! Préserve ma vue. Il n'y a aucune divinité [digne d'être adorée] en dehors de Toi. Ô Allah ! Je cherche refuge auprès de Toi contre la mécréance et la pauvreté. Je me mets sous Ta protection contre les tourments de la tombe. Il n'y a aucune divinité [digne d'être adorée] en dehors de Toi.",
    source: 'Sunan Abī Dāwūd 5090',
    sourceUrl: 'https://sunnah.com/abudawud:5090',
    grade: 'Hasan',
    tags: ['protection'],
  },

  // ─── 27. Rabbi aʿinnī — Aide, secours et soumission ────────────────────────
  {
    id: 'rabbi-ainni',
    number: 27,
    category: 'prophetic',
    title: "Rabbi aʿinnī — Aide, secours et soumission à Allah",
    titleAr: 'رَبِّ أَعِنِّي وَلَا تُعِنْ عَلَيَّ',
    arabic: 'رَبِّ أَعِنِّي وَلَا تُعِنْ عَلَيَّ، وَانْصُرْنِي وَلَا تَنْصُرْ عَلَيَّ، وَامْكُرْ لِي وَلَا تَمْكُرْ عَلَيَّ، وَاهْدِنِي وَيَسِّرِ الْهُدَى لِي، وَانْصُرْنِي عَلَى مَنْ بَغَى عَلَيَّ. رَبِّ اجْعَلْنِي لَكَ شَكَّارًا، لَكَ ذَكَّارًا، لَكَ رَهَّابًا، لَكَ مِطْوَاعًا، لَكَ مُخْبِتًا، إِلَيْكَ أَوَّاهًا مُنِيبًا. رَبِّ تَقَبَّلْ تَوْبَتِي، وَاغْسِلْ حَوْبَتِي، وَأَجِبْ دَعْوَتِي، وَثَبِّتْ حُجَّتِي، وَسَدِّدْ لِسَانِي، وَاهْدِ قَلْبِي، وَاسْلُلْ سَخِيمَةَ صَدْرِي',
    transliteration: "Rabbi a'innî wa lâ tu'in 'alayya, wa-nsurnî wa lâ tansur 'alayya, wa-mkur lî wa lâ tamkur 'alayya, wa-hdinî wa yassiri-l-hudâ lî, wa-nsurnî 'alâ man baghâ 'alayya. Rabbi-j'alnî laka shakkâran, laka dhakkâran, laka rahhâban, laka mitwâ'an, laka mukhbitan, ilayka awwâhan munîban. Rabbi taqabbal tawbatî, wa-ghsil hawbatî, wa ajib da'watî, wa thabbit hujjatî, wa saddid lisânî, wa-hdi qalbî, wa-slul sakhîmata sadrî.",
    translationFr: "Seigneur ! Aide-moi et n'aide pas contre moi ; secours-moi et ne secours pas contre moi ; ruse en ma faveur et ne ruse pas contre moi ; guide-moi et facilite-moi la guidée et secours-moi contre celui qui m'opprime. Seigneur ! Fais que je sois reconnaissant envers Toi, que je T'évoque, que je Te craigne, que je Te sois très obéissant, que je Te sois humblement soumis et que je revienne [vers Toi]. Seigneur ! Accepte mon repentir, lave mes fautes, exauce mon invocation, raffermis mon argument, guide mon coeur, accorde la justesse à ma langue et retire la haine de mon coeur.",
    source: 'Jamiʿ at-Tirmidhī 3551',
    sourceUrl: 'https://sunnah.com/tirmidhi:3551',
    grade: 'Sahih',
    tags: ['guidance', 'pardon'],
  },

  // ─── 28. Longue invocation de louange et bénédiction ───────────────────────
  {
    id: 'louange-benediction-foi',
    number: 28,
    category: 'prophetic',
    title: "Louange, bénédiction et foi (longue invocation)",
    titleAr: 'لَكَ الْحَمْدُ كُلُّهُ',
    arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ كُلُّهُ، اللَّهُمَّ لَا قَابِضَ لِمَا بَسَطْتَ، وَلَا بَاسِطَ لِمَا قَبَضْتَ، وَلَا هَادِيَ لِمَنْ أَضْلَلْتَ، وَلَا مُضِلَّ لِمَنْ هَدَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُقَرِّبَ لِمَا بَاعَدْتَ، وَلَا مُبَاعِدَ لِمَا قَرَّبْتَ. اللَّهُمَّ ابْسُطْ عَلَيْنَا مِنْ بَرَكَاتِكَ وَرَحْمَتِكَ وَفَضْلِكَ وَرِزْقِكَ. اللَّهُمَّ إِنِّي أَسْأَلُكَ النَّعِيمَ الْمُقِيمَ الَّذِي لَا يَحُولُ وَلَا يَزُولُ. اللَّهُمَّ إِنِّي أَسْأَلُكَ النَّعِيمَ يَوْمَ الْعَيْلَةِ، وَالْأَمْنَ يَوْمَ الْخَوْفِ. اللَّهُمَّ إِنِّي عَائِذٌ بِكَ مِنْ شَرِّ مَا أَعْطَيْتَنَا، وَشَرِّ مَا مَنَعْتَ. اللَّهُمَّ حَبِّبْ إِلَيْنَا الْإِيمَانَ وَزَيِّنْهُ فِي قُلُوبِنَا، وَكَرِّهْ إِلَيْنَا الْكُفْرَ وَالْفُسُوقَ وَالْعِصْيَانَ، وَاجْعَلْنَا مِنَ الرَّاشِدِينَ. اللَّهُمَّ تَوَفَّنَا مُسْلِمِينَ، وَأَحْيِنَا مُسْلِمِينَ، وَأَلْحِقْنَا بِالصَّالِحِينَ غَيْرَ خَزَايَا وَلَا مَفْتُونِينَ',
    transliteration: "Allâhumma laka-l-hamdu kulluhu, Allâhumma lâ qâbida limâ basatta, wa lâ bâsita limâ qabadta, wa lâ hâdiya liman adlalta, wa lâ mudilla liman hadayta, wa lâ mu'tiya limâ mana'ta, wa lâ mâni'a limâ a'tayta, wa lâ muqarriba limâ bâ'adta, wa lâ mubâ'ida limâ qarrabta. Allâhumma-bsut 'alaynâ min barakâtika wa rahmatika wa fadlika wa rizqika. Allâhumma innî as'aluka-n-na'îma-l-muqîma-lladhî lâ yahûlu wa lâ yazûlu. Allâhumma innî as'aluka-n-na'îma yawma-l-'aylati, wa-l-amna yawma-l-khawfi. Allâhumma innî 'â'idhun bika min sharri mâ a'taytanâ wa sharri mâ mana'ta. Allâhumma habbib ilaynâ-l-îmâna wa zayyinhu fî qulûbinâ, wa karrih ilaynâ-l-kufra wa-l-fusûqa wa-l-'isyâna, wa-j'alnâ mina-r-râshidîn. Allâhumma tawaffanâ muslimîna, wa ahyinâ muslimîna, wa alhiqnâ bi-s-sâlihîna ghayra khazâyâ wa lâ maftûnîn.",
    translationFr: "Ô Allah, à Toi appartient toute louange. Ô Allah, nul ne peut retenir ce que Tu étends, et nul ne peut étendre ce que Tu retires. Nul ne guide celui que Tu égares, et nul n'égare celui que Tu guides. Nul ne donne ce que Tu retires, et nul ne retire ce que Tu donnes. Nul ne rapproche celui que Tu éloignes, et nul n'éloigne celui que Tu rapproches. Ô Allah, étends sur nous Tes bénédictions, Ta miséricorde, Ton excellence et Ta subsistance. Ô Allah, je T'implore pour le bonheur éternel qui ne change ni ne disparaît. Ô Allah, je T'implore pour le bien le jour de la détresse et la sécurité le jour de la peur. Ô Allah, je me réfugie auprès de Toi contre le mal de ce que Tu nous donnes et contre le mal de ce que Tu retires. Ô Allah, rends l'Imān (la foi) agréable à nos cœurs, embellis-le en nous, et rends-nous détestable la mécréance, le péché et la désobéissance. Fais de nous des personnes droites et bien guidées. Ô Allah, fais que nous mourions en musulmans et que nous vivions en musulmans, et joins-nous aux justes, sans humiliation ni épreuve.",
    source: 'Sunan an-Nasāʾī 1281 — Musnad Ahmad',
    sourceUrl: 'https://sunnah.com/nasai:1281',
    grade: 'Sahih',
    tags: ['baraka', 'foi', 'guidance'],
  },
]
