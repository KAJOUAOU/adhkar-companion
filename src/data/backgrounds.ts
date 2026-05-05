export interface BgTheme {
  id:         string
  label:      string
  file:       string        // paysage — desktop 16:9
  fileMobile: string        // portrait — mobile 9:16
  style:      'light' | 'dark'
}

export const BG_THEMES: BgTheme[] = [
  {
    id:         'morning-lanterns',
    label:      'Lanternes — Jour',
    file:       '/backgrounds/bg-morning-lanterns.png',
    fileMobile: '/backgrounds/bg-cream-mobile.png',
    style:      'light',
  },
  {
    id:         'evening-lanterns',
    label:      'Lanternes — Nuit',
    file:       '/backgrounds/bg-evening-lanterns.png',
    fileMobile: '/backgrounds/bg-brown-mobile.png',
    style:      'dark',
  },
  {
    id:         'green-dark',
    label:      'Vert émeraude',
    file:       '/backgrounds/bg-green-dark.png',
    fileMobile: '/backgrounds/bg-green-dark-mobile.png',
    style:      'dark',
  },
  {
    id:         'green-mint',
    label:      'Vert menthe',
    file:       '/backgrounds/bg-green-mint.png',
    fileMobile: '/backgrounds/bg-green-mint-mobile.png',
    style:      'light',
  },
  {
    id:         'blue-light',
    label:      'Bleu ciel',
    file:       '/backgrounds/bg-blue-light.png',
    fileMobile: '/backgrounds/bg-blue-light-mobile.png',
    style:      'light',
  },
  {
    id:         'lavender',
    label:      'Lavande',
    file:       '/backgrounds/bg-lavender.png',
    fileMobile: '/backgrounds/bg-lavender-mobile.png',
    style:      'light',
  },
  {
    id:         'navy',
    label:      'Bleu nuit',
    file:       '/backgrounds/bg-navy.png',
    fileMobile: '/backgrounds/bg-navy-mobile.png',
    style:      'dark',
  },
  {
    id:         'burgundy',
    label:      'Bordeaux',
    file:       '/backgrounds/bg-burgundy.png',
    fileMobile: '/backgrounds/bg-burgundy-mobile.png',
    style:      'dark',
  },
  {
    id:         'pink',
    label:      'Rose',
    file:       '/backgrounds/bg-pink.png',
    fileMobile: '/backgrounds/bg-pink-mobile.png',
    style:      'light',
  },
  {
    id:         'black',
    label:      'Nuit noire',
    file:       '/backgrounds/bg-black.png',
    fileMobile: '/backgrounds/bg-black-mobile.png',
    style:      'dark',
  },
]

export const DEFAULT_SESSION_BG: Record<string, string> = {
  morning: 'morning-lanterns',
  evening: 'evening-lanterns',
  quick:   'morning-lanterns',
}
