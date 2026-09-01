import { useTranslation } from 'react-i18next'
import PageBackground from '../components/PageBackground'

const INTRO_TITLE = 'Technical solution areas tailored to your project, sector, and site conditions'

const INTRO_TEXT =
  'Green Pi brings together diverse project needs — from renewable energy to medium voltage, from power quality to lightning protection — under a single solution framework.'

const SOLUTIONS = [
  {
    title: 'Renewable Energy',
    text: 'Solar and wind power plant projects, PV panels, field equipment, power distribution, and energy monitoring solutions.',
  },
  {
    title: 'Low and Medium Voltage',
    text: 'Transformers, switchgear cells, relays, current and voltage transformers, cable terminations, fuses, and load break switches.',
  },
  {
    title: 'Panels, SCADA and Communication',
    text: 'Industrial modems, grid monitoring relays, fault indicator systems, RTUs, energy analyzers, and rectifier solutions.',
  },
  {
    title: 'Lightning Protection',
    text: 'Power and low-current surge arresters, external lightning protection systems, GSM towers, and ship and marina protection solutions.',
  },
  {
    title: 'Vehicle Charging Systems',
    text: 'Electric vehicle charging stations, energy infrastructure, and solar-supported field solutions.',
  },
  {
    title: 'Ship and Marina Electrics',
    text: 'IP-rated fixtures, switches and sockets, junction boxes, cable glands, and electrical products suited for marine environments.',
  },
  {
    title: 'Power Quality',
    text: 'Power quality recorders, analyzers, protection relays, and uninterrupted auxiliary supply systems for critical facilities.',
  },
  {
    title: 'Project and Product Consultancy',
    text: 'Product selection based on sector, building, and application, alternative comparison, catalog, and quotation support.',
  },
]

function SolutionCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-900/85 p-6 shadow-2xl">
      <div
        className="pointer-events-none absolute left-0 top-0 h-24 w-24 bg-emerald-400/20"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      <div className="relative">
        <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>
        <p className="leading-relaxed text-white/75">{text}</p>
      </div>
    </div>
  )
}

function Solutions() {
  const { t } = useTranslation()
  return (
    <PageBackground>
      <div className="min-h-screen w-full px-6 pb-20 pt-32 md:px-10">
        <h1 className="mb-3 text-3xl font-semibold text-white">{t('Solutions')}</h1>
        <p className="mb-2 text-lg text-white">{t(INTRO_TITLE)}</p>
        <p className="mb-10 w-full leading-relaxed text-emerald-300">{t(INTRO_TEXT)}</p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SOLUTIONS.map((s) => (
            <SolutionCard key={s.title} title={t(s.title)} text={t(s.text)} />
          ))}
        </div>
      </div>
    </PageBackground>
  )
}

export default Solutions
