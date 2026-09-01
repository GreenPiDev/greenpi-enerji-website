import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PageBackground from '../components/PageBackground'

const INTRO_TITLE = "Let's evaluate your project together"

const INTRO_TEXT =
  'You can reach out to our professional team in Ankara for product selection, technical solutions, dealership, and project requests.'

const TECH_TITLE = 'Technical Request'
const TECH_SUBTITLE = 'Looking for a quote on a specific product or project?'
const TECH_TEXT =
  "Share your product name, project details, and contact information. We'll get back to you as soon as possible."

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-900/85 p-8 shadow-2xl">
      <div
        className="pointer-events-none absolute left-0 top-0 h-24 w-24 bg-emerald-400/20"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

function Contact() {
  const { t } = useTranslation()
  return (
    <PageBackground>
      <div className="min-h-screen w-full px-6 pb-20 pt-32 md:px-10">
        <h1 className="mb-3 text-3xl font-semibold text-white">{t('Contact')}</h1>
        <p className="mb-2 text-lg text-white">{t(INTRO_TITLE)}</p>
        <p className="mb-10 w-full leading-relaxed text-emerald-300">{t(INTRO_TEXT)}</p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <InfoCard>
            <span className="text-sm font-semibold tracking-widest text-emerald-400/70">{t('Ankara')}</span>
            <h2 className="mb-4 mt-1 text-xl font-semibold text-white">{t('Office')}</h2>
            <a
              href="https://www.google.com/maps/search/?api=1&query=G%C3%BCm%C3%BC%C5%9F%20Cd.%20No%3A40%2C%20Konutkent%2C%2006810%20Yenimahalle%2FAnkara"
              target="_blank"
              rel="noreferrer"
              className="mb-6 block cursor-pointer leading-relaxed text-white/75 hover:text-emerald-300"
            >
              Gümüş Cd. No:40, Konutkent, 06810 Yenimahalle/Ankara
            </a>
            <div className="space-y-2 text-white/85">
              <a href="tel:+903128701260" className="block hover:text-emerald-300">
                +90 312 870 12 60
              </a>
              <a href="tel:+905468582020" className="block hover:text-emerald-300">
                +90 546 858 20 20
              </a>
              <a href="mailto:info@greenpi.com.tr" className="block hover:text-emerald-300">
                info@greenpi.com.tr
              </a>
            </div>
          </InfoCard>

          <InfoCard>
            <h2 className="mb-2 text-xl font-semibold text-white">{t(TECH_TITLE)}</h2>
            <p className="mb-3 text-white/85">{t(TECH_SUBTITLE)}</p>
            <p className="mb-6 leading-relaxed text-white/75">{t(TECH_TEXT)}</p>
            <Link
              to="/contact-form"
              className="inline-block rounded-full border border-sky-400/30 bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 hover:text-emerald-300"
            >
              {t('Go to Quote Form')}
            </Link>
          </InfoCard>
        </div>
      </div>
    </PageBackground>
  )
}

export default Contact
