import { useTranslation } from 'react-i18next'
import PageBackground from '../components/PageBackground'

function Products() {
  const { t } = useTranslation()
  return (
    <PageBackground>
      <div className="flex min-h-screen items-center justify-center pt-20">
        <h1 className="text-2xl font-semibold text-white">{t('Products')}</h1>
      </div>
    </PageBackground>
  )
}

export default Products
