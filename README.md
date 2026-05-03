# Dhikr Companion — Mes Adhkar du Matin et du Soir

> Compagnon spirituel quotidien. Application web mobile premium de niveau commercial.

---

## Démarrage rapide

### Prérequis
- Node.js 18+ : https://nodejs.org
- npm 9+

### Installation

```bash
cd "C:\Users\Asus\Documents\WSHOBSON Intelligence\dhikr_companion"
npm install
npm run dev
```

Ouvre ensuite : **http://localhost:5173**

### Build production

```bash
npm run build
npm run preview
```

---

## Déploiement Vercel

### Option 1 — CLI

```bash
npm install -g vercel
cd dhikr_companion
vercel
```

### Option 2 — Dashboard Vercel

1. Va sur https://vercel.com → New Project
2. Importe depuis GitHub (pousse le dossier d'abord)
3. Framework preset : **Vite**
4. Build command : `npm run build`
5. Output dir : `dist`
6. Clique Deploy → URL publique automatique

### Option 3 — GitHub + Vercel (recommandé)

```bash
# Dans le dossier dhikr_companion
git init
git add .
git commit -m "feat: initial Dhikr Companion v1.0"
# Crée un repo sur GitHub, puis :
git remote add origin https://github.com/TON_USERNAME/dhikr-companion.git
git push -u origin main
# Puis connecte Vercel au repo → déploiement automatique à chaque push
```

---

## Architecture

```
dhikr_companion/
├── src/
│   ├── types/          # TypeScript types centralisés
│   ├── data/           # Base de données adhkar (adhkar.ts) + citations
│   ├── hooks/          # useAdhkar, useStreak, useSettings, useAudio
│   ├── services/       # storageService (localStorage), notificationService
│   ├── utils/          # timeUtils, tajweedUtils (colorisation Tajweed)
│   ├── components/     # Navigation, AdhkarCard, Counter, AudioPlayer, etc.
│   └── pages/          # Dashboard, ImmersiveMode, CardsMode, NeedOfMoment, Settings
├── public/             # manifest.json, icônes PWA
├── index.html
├── vite.config.ts      # PWA plugin configuré
├── tailwind.config.ts  # Design system custom (cream, forest, gold)
└── package.json
```

---

## Fonctionnalités V1

| Feature | Statut |
|---------|--------|
| 26 adhkar complets (PDF intégral) | ✅ |
| Texte arabe + Tajweed coloré | ✅ |
| Translittération phonétique | ✅ |
| Traduction française | ✅ |
| Mérites & sources hadith | ✅ |
| Mode immersif plein écran | ✅ |
| Compteur tactile animé | ✅ |
| Audio (sourates coraniques CDN) | ✅ |
| Fallback TTS Web Speech API | ✅ |
| Dashboard avec statut du jour | ✅ |
| Mode 2 minutes (essentiels) | ✅ |
| Besoin du moment (8 filtres) | ✅ |
| Parcourir / rechercher | ✅ |
| Système de favoris | ✅ |
| Streak de constance | ✅ |
| Rappels notifications | ✅ |
| Réglages complets | ✅ |
| Dark mode | ✅ |
| PWA installable iPhone/Android | ✅ |
| 100% offline (sauf audio CDN) | ✅ |
| Swipe mobile + clavier | ✅ |
| Safe areas iPhone | ✅ |

---

## Tajweed — Légende des couleurs

| Couleur | Règle | Description |
|---------|-------|-------------|
| 🔴 Rouge | Qalqalah | Son rebondissant sur ق ط ب ج د avec sukoon |
| 🟢 Vert | Madd | Prolongation des voyelles (آ) |
| 🔵 Cyan | Ghunna | Nasalisation sur نّ مّ (2 temps) |
| 🟠 Orange | Ikhfâ' | Son atténué de ن sakin |
| 🟣 Violet | Idghâm | Fusion de ن sakin avant و ي ر ل م ن |

---

## Audio

- **Sourates coraniques** (Ayat al-Kursi, Al-Ikhlâs, Al-Falaq, An-Nâs) :
  CDN everyayah.com — Récitateur : Sheikh Mishary Al-Afasy (128kbps)
- **Adhkar non-coraniques** :
  Fallback Web Speech API (synthèse vocale arabe intégrée dans iOS/Android)
- **V2** : Intégrer des MP3 enregistrés par un récitateur humain pour tous les adhkar

---

## Roadmap V2

### Fonctionnalités business

- **Partage visuel** — générer une belle carte image (Canvas API)
- **Authentification** — compte utilisateur, sync multi-appareils (Supabase)
- **Mode premium** — acheter des packs supplémentaires (Stripe)
- **Adhkar supplémentaires** — après prière, du voyage, du sommeil, du repas
- **Audio premium** — MP3 haute qualité par récitateur professionnel
- **Tajweed avancé** — moteur complet (bibliothèque dédiée)
- **Calendrier hijri** — afficher la date islamique
- **Statistiques spirituelles** — graphiques de progression mensuelle
- **Communauté** — partager son streak (optionnel, privé)
- **Multi-langue** — Anglais, Arabe UI

### Technique

- Backend Supabase (Postgres + Auth + Storage)
- Push notifications via Service Worker
- Offline audio (mise en cache PWA)
- Tests unitaires (Vitest)
- CI/CD GitHub Actions → Vercel

---

## Monétisation V2

| Plan | Prix | Contenu |
|------|------|---------|
| Gratuit | 0€ | Adhkar matin/soir de base |
| Premium | 2.99€ une fois | Tous les adhkar, audio complet, pas de pub |
| Pack ramadan | 1.99€ | Adhkar spéciaux Ramadan |

---

## Sources

Contenu basé sur : **"Mes invocations du matin et du soir" — QURAN TIME (@_quran_time)**
Sources hadith : Bukhari, Muslim, Abu Dawud, At-Tirmidhi, Ibn Maja, Al-Hakim, Al-Albani

---

*Développé avec ❤️ pour la Oumma*
