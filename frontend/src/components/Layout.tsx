import { Helmet } from 'react-helmet-async'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import { SITE_URL } from '../lib/seo'

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Green Pi Enerji',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Gümüş Cd. No:40, Konutkent',
    addressLocality: 'Yenimahalle/Ankara',
    postalCode: '06810',
    addressCountry: 'TR',
  },
  telephone: '+90 312 870 12 60',
  email: 'info@greenpi.com.tr',
  sameAs: ['https://www.instagram.com/greenpienergy/', 'https://www.linkedin.com/company/greenpienergy/'],
}

function Layout() {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(ORGANIZATION_JSON_LD)}</script>
      </Helmet>
      <Header />
      <Outlet />
    </>
  )
}

export default Layout
