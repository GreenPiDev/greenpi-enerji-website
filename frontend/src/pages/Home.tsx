import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getProducts, type Product } from '../lib/api'

function Home() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-semibold">{t('Green Pi Energy')}</h1>
      {error && <p className="text-red-600">{error}</p>}
      {!error && !products && <p>{t('Loading...')}</p>}
      {products && <p>{products.length} ürün yüklendi.</p>}
    </div>
  )
}

export default Home
