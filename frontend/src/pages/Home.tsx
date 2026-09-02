import { useTranslation } from 'react-i18next'
import Hero from '../components/Hero'
import Seo from '../components/Seo'

function Home() {
  const { t } = useTranslation()
  return (
    <div>
      <Seo
        title={t('Home')}
        description={t(
          "Green Pi Enerji offers smart electrical infrastructure products and solutions for solar power plants, shopping malls, hospitals, data centers, and more locations across Turkey.",
        )}
      />
      <h1 className="sr-only">
        {t(
          'Green Pi Enerji — Low and Medium Voltage Electrical Equipment Supplier',
        )}
      </h1>
      <Hero />
    </div>
  )
}

export default Home
