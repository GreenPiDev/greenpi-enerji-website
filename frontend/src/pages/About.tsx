import { useTranslation } from 'react-i18next'

function About() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <h1 className="text-2xl font-semibold">{t('About us')}</h1>
    </div>
  )
}

export default About
