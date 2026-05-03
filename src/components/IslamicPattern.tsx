interface Props {
  className?: string
  opacity?: number
}

export default function IslamicPattern({ className = '', opacity = 0.06 }: Props) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        {/*
          Motif géométrique islamique authentique — étoile à 8 branches (Khatam)
          Inspiré des zellige marocains et de l'architecture andalouse.
          Tile 100×100 :
            • Étoile à 8 branches (tracé seul) au centre
            • Losange rotatif connectant les tuiles adjacentes (sebka / treillis)
            • Cercle central ornemental
            • Petits carrés aux 4 coins pour la continuité du treillis
        */}
        <pattern id="islamic-geo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
            {/* Étoile à 8 branches */}
            <polygon points="50,10 58,32 78,22 68,42 90,50 68,58 78,78 58,68 50,90 42,68 22,78 32,58 10,50 32,42 22,22 42,32" />
            {/* Trame losange (sebka) — connecte aux tuiles voisines */}
            <polygon points="50,2 98,50 50,98 2,50" />
            {/* Rosace centrale */}
            <circle cx="50" cy="50" r="10" />
            {/* Petits losanges aux coins pour la continuité */}
            <polygon points="0,0 8,0 12,8 8,16 0,16 0,8" />
            <polygon points="100,0 100,8 92,12 84,8 84,0 92,0" />
            <polygon points="0,100 0,92 8,88 16,92 16,100 8,100" />
            <polygon points="100,100 92,100 88,92 92,84 100,84 100,92" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-geo)" />
    </svg>
  )
}

export function GeometricBorder({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 400 20" preserveAspectRatio="none" className="w-full h-5">
        <path
          d="M0,10 L20,0 L40,10 L60,0 L80,10 L100,0 L120,10 L140,0 L160,10 L180,0 L200,10 L220,0 L240,10 L260,0 L280,10 L300,0 L320,10 L340,0 L360,10 L380,0 L400,10"
          fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2"
        />
      </svg>
    </div>
  )
}
