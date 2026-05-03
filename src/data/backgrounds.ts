export interface BgTheme {
  id:         string
  label:      string
  file:       string  // paysage — desktop
  fileMobile: string  // portrait — mobile/tablette
  style:      'light' | 'dark'
}

export const BG_THEMES: BgTheme[] = [
  {
    id:         'morning-lanterns',
    label:      'Lanternes — Jour',
    file:       '/backgrounds/bg-morning-lanterns.png',
    fileMobile: '/backgrounds/backgroung mobile 9-16 creme.png',
    style:      'light',
  },
  {
    id:         'evening-lanterns',
    label:      'Lanternes — Nuit',
    file:       '/backgrounds/bg-evening-lanterns.png',
    fileMobile: '/backgrounds/backgroung mobile 9-16 brown.png',
    style:      'dark',
  },
]

export const DEFAULT_SESSION_BG: Record<string, string> = {
  morning: 'morning-lanterns',
  evening: 'evening-lanterns',
  quick:   'morning-lanterns',
}
