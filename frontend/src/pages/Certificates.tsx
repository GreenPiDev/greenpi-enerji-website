import { useTranslation } from 'react-i18next'
import PageBackground from '../components/PageBackground'
import Seo from '../components/Seo'

const INTRO_TEXT =
  'Our management systems, aligned with international standards, certify our commitment to quality, safety and sustainability.'

const CERTIFICATES = [
  {
    code: 'ISO 9001',
    name: 'Quality Management System',
    text: 'Certifies our quality processes, built on customer satisfaction and continual improvement.',
  },
  {
    code: 'ISO 45001',
    name: 'Occupational Health & Safety Management System',
    text: 'Shows that we provide a safe and healthy working environment for our people.',
  },
  {
    code: 'ISO 14001',
    name: 'Environmental Management System',
    text: 'Documents that we manage and reduce the environmental impact of our operations.',
  },
  {
    code: 'ISO 27001',
    name: 'Information Security Management System',
    text: 'Safeguards the confidentiality, integrity and availability of our information assets.',
  },
  {
    code: 'ISO 50001',
    name: 'Energy Management System',
    text: 'Shows that we monitor and continually improve our energy performance.',
  },
  {
    code: 'ISO 22301',
    name: 'Business Continuity Management System',
    text: 'Documents our ability to keep operating through potential disruptions.',
  },
  {
    code: 'ISO 20000-1',
    name: 'IT Service Management System',
    text: 'Assures that our IT services are delivered in a planned, controlled and reliable way.',
  },
]

function CertificateCard({ code, name, text }: { code: string; name: string; text: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-900/85 p-6 shadow-2xl">
      <div
        className="pointer-events-none absolute left-0 top-0 h-24 w-24 bg-emerald-400/20"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      <div className="relative">
        <h2 className="text-2xl font-semibold text-white">{code}</h2>
        <p className="mb-3 mt-1 font-semibold text-emerald-300">{name}</p>
        <p className="leading-relaxed text-white/75">{text}</p>
      </div>
    </div>
  )
}

function Certificates() {
  const { t } = useTranslation()
  return (
    <PageBackground>
      <Seo title={t('Our certificates')} description={t(INTRO_TEXT)} />
      <div className="min-h-screen w-full px-6 pb-20 pt-32 md:px-10">
        <h1 className="mb-3 text-3xl font-semibold text-white">{t('Our certificates')}</h1>
        <p className="mb-10 w-full leading-relaxed text-emerald-300">{t(INTRO_TEXT)}</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CERTIFICATES.map((c) => (
            <CertificateCard key={c.code} code={c.code} name={t(c.name)} text={t(c.text)} />
          ))}
        </div>
      </div>
    </PageBackground>
  )
}

export default Certificates
