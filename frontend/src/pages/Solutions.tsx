import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PageBackground from '../components/PageBackground'
import Seo from '../components/Seo'

const INTRO_TITLE = 'Technical solution areas tailored to your project, sector, and site conditions'

const INTRO_TEXT =
  'Green Pi brings together diverse project needs under a single solution framework, and supports your team with product selection, alternative comparison, and quotation consultancy.'

const SOLUTIONS = [
  {
    catId: 'guc-dagitim-sistemleri',
    title: 'Power Distribution Systems',
    text: 'Transformers, switchgear cells, protection relays, current and voltage transformers, cable terminations, fuses, and load break switches for power distribution networks.',
  },
  {
    catId: 'otomasyon-haberlesme',
    title: 'Automation and Communication',
    text: 'Industrial modems, grid monitoring relays, fault indicator systems, RTUs, and remote monitoring solutions for automated network operation.',
  },
  {
    catId: 'enerji-izleme-analiz',
    title: 'Energy Monitoring and Analysis',
    text: 'Power quality recorders, energy analyzers, and monitoring systems that track consumption and protect critical facilities.',
  },
  {
    catId: 'yildirimdan-korunma',
    title: 'Lightning Protection',
    text: 'Power and low-current surge arresters, and external lightning protection systems for buildings, GSM towers, and marina installations.',
  },
  {
    catId: 'elektrikli-arac-sarj',
    title: 'Electric Vehicle Charging',
    text: 'Electric vehicle charging stations, supporting energy infrastructure, and solar-supported charging field solutions.',
  },
  {
    catId: 'kablo-yonetimi',
    title: 'Cable Management',
    text: 'Cable glands, terminations, junction boxes, and cable management products suited for industrial and marine environments.',
  },
  {
    catId: 'aydinlatma',
    title: 'Lighting',
    text: 'IP-rated fixtures, and indoor and outdoor lighting solutions for industrial facilities, marinas, and public spaces.',
  },
  {
    catId: 'endustriyel-cozumler',
    title: 'Industrial Solutions',
    text: 'Tailored electrical products and technical solutions for factories, mining sites, petrochemical facilities, and other industrial applications.',
  },
]

function SolutionCard({ catId, title, text }: { catId: string; title: string; text: string }) {
  return (
    <Link
      to={`/products?cat=${catId}`}
      className="group relative block overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-900/85 p-6 shadow-2xl transition hover:border-emerald-400/40"
    >
      <div
        className="pointer-events-none absolute left-0 top-0 h-24 w-24 bg-emerald-400/20"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      <div className="relative">
        <h3 className="mb-3 text-lg font-semibold text-white group-hover:text-emerald-300">{title}</h3>
        <p className="leading-relaxed text-white/75">{text}</p>
      </div>
    </Link>
  )
}

function Solutions() {
  const { t } = useTranslation()
  return (
    <PageBackground>
      <Seo
        title={t('Solutions')}
        description={t(
          'Power distribution, automation and communication, energy monitoring, lightning protection, EV charging, cable management, lighting, and industrial solutions.',
        )}
      />
      <div className="min-h-screen w-full px-6 pb-20 pt-32 md:px-10">
        <h1 className="mb-3 text-3xl font-semibold text-white">{t('Solutions')}</h1>
        <p className="mb-2 text-lg text-white">{t(INTRO_TITLE)}</p>
        <p className="mb-10 w-full leading-relaxed text-emerald-300">{t(INTRO_TEXT)}</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s) => (
            <SolutionCard key={s.catId} catId={s.catId} title={t(s.title)} text={t(s.text)} />
          ))}
        </div>
      </div>
    </PageBackground>
  )
}

export default Solutions
