import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import PageBackground from '../components/PageBackground'

const ABOUT_TEXT =
  "The energy sector is one of the world's key industries, and electricity demand is expected to grow very rapidly. Green Pi Enerji Mühendislik Ltd. Şti. was established in 2023 to support the energy sector and play a significant role in its development. Green Pi Enerji offers smart solutions and products to build energy-efficient networks, reduce power consumption, and support environmental sustainability. Green Pi Enerji has delivered projects in Turkey's energy, construction, telecommunications, and manufacturing sectors. Our company sets high goals to meet customer demands and stays focused on industry trends. We take responsibility and work with motivation to solve our customers' problems and create new opportunities."

const MISSION_TEXT =
  'To create superior value for our local and international customers through the highest quality products and solutions, by building energy-efficient networks, reducing power consumption, and supporting environmental sustainability.'

const VISION_TEXT =
  'To become a global company delivering the highest quality energy products and solutions by expanding into international markets.'

function Card({ title, text, className = '' }: { title: string; text: string; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-900/85 p-8 shadow-2xl ${className}`}
    >
      <div
        className="pointer-events-none absolute left-0 top-0 h-32 w-32 bg-emerald-400/20"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />
      <div className="relative">
        <h2 className="mb-4 text-xl font-semibold text-emerald-300">{title}</h2>
        <p className="text-justify leading-relaxed text-white/85">{text}</p>
      </div>
    </div>
  )
}

function Section({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-none">{children}</div>
}

function About() {
  const { t } = useTranslation()
  return (
    <PageBackground>
      <div className="min-h-screen w-full px-6 pb-20 pt-32 md:px-10">
        <Section>
          <h1 className="mb-10 text-3xl font-semibold text-white">{t('About us')}</h1>

          <div className="space-y-6">
            <Card title={t('Who We Are')} text={t(ABOUT_TEXT)} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card title={t('Our Mission')} text={t(MISSION_TEXT)} />
              <Card title={t('Our Vision')} text={t(VISION_TEXT)} />
            </div>
          </div>
        </Section>
      </div>
    </PageBackground>
  )
}

export default About
