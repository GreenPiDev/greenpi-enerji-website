import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../lib/seo'

type SeoProps = {
  title: string
  description: string
  image?: string
  noindex?: boolean
  jsonLd?: object | object[]
}

function Seo({ title, description, image, noindex, jsonLd }: SeoProps) {
  const { pathname } = useLocation()
  const canonical = `${SITE_URL}${pathname}`
  const fullTitle = `${title} | ${SITE_NAME}`
  const ogImage = image ?? DEFAULT_OG_IMAGE
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdList.map((entry, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  )
}

export default Seo
