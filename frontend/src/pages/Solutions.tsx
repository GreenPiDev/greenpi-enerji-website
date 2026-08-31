import { useTranslation } from 'react-i18next'

function Solutions() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <h1 className="text-2xl font-semibold">{t('Solutions')}</h1>
    </div>
  )
}

export default Solutions
