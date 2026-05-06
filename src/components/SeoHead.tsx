import { Helmet } from 'react-helmet-async'

interface SeoHeadProps {
  title: string
  description: string
  canonical?: string
  keywords?: string
}

const BASE_URL = 'https://adhkar-companion.com'
const OG_IMAGE = `${BASE_URL}/og-image.png`

export default function SeoHead({ title, description, canonical, keywords }: SeoHeadProps) {
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : BASE_URL

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Adhkar Companion" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  )
}
