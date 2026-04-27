import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://amonoff-platform.netlify.app' // ⚠️ Sizning URL bilan o'zgartiring!
const SITE_NAME = 'Darslik Platforma'
const DEFAULT_IMAGE = `${SITE_URL}/web-app-manifest-512x512.png`

function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false
}) {
  // Default qiymatlar
  const seoTitle = title 
    ? `${title} | ${SITE_NAME}` 
    : `${SITE_NAME} — Online ta'lim`
  
  const seoDescription = description || 
    "Online ta'lim platformasi. Eng yaxshi mutaxassislardan o'rganing. Istalgan vaqtda, istalgan joyda. 500+ dan ortiq kurslar."
  
  const seoImage = image || DEFAULT_IMAGE
  const seoUrl = url ? `${SITE_URL}${url}` : SITE_URL
  
  const seoKeywords = keywords || 
    "online kurs, darslik, ta'lim, dasturlash, dizayn, o'qish, uzbek, bilim, video kurs"

  return (
    <Helmet>
      {/* Asosiy meta */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={SITE_NAME} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Canonical */}
      <link rel="canonical" href={seoUrl} />
      
      {/* ============ OPEN GRAPH (Facebook, Telegram, LinkedIn) ============ */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="uz_UZ" />
      
      {/* ============ TWITTER CARD ============ */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* ============ SCHEMA.ORG (Google uchun) ============ */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": SITE_NAME,
          "url": SITE_URL,
          "logo": DEFAULT_IMAGE,
          "description": seoDescription,
          "sameAs": [
            "https://t.me/darslik_platforma",
            "https://instagram.com/darslik_platforma"
          ]
        })}
      </script>
    </Helmet>
  )
}

export default SEO