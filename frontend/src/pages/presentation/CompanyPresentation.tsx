import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import Seo from '../../components/Seo'
import { HERO_VIDEO_LOOP } from '../../lib/media'
import Reveal from './Reveal'
import SideNav from './SideNav'
import { useHorizontalPin } from './useHorizontalPin'
import { useSmoothScroll } from './useSmoothScroll'
import {
  businessLines,
  componentBrands,
  internationalProjects,
  partnerReasons,
  processSteps,
  sectors,
  solutionCapabilities,
  turkeyProjects,
} from './content'

function SectionKicker({ children }: { children: string }) {
  return (
    <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">{children}</p>
  )
}

function CompanyPresentation() {
  const { t } = useTranslation()
  useSmoothScroll()
  const { wrapperRef: capabilitiesWrapperRef, trackRef: capabilitiesTrackRef } = useHorizontalPin(64)
  const { wrapperRef, trackRef } = useHorizontalPin()

  return (
    <div className="font-sans bg-[#060a10] text-slate-200">
      <Seo
        title={t('Company Presentation')}
        description={t('Medium-Voltage Power Distribution & Electrical Component Supply — project-specific solutions from design to delivery.')}
      />

      <Link
        to="/home"
        aria-label={t('Back to website')}
        className="group fixed left-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-md transition hover:border-emerald-400/40 hover:bg-white/10 sm:left-6 sm:top-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition group-hover:-translate-x-0.5">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <LanguageSwitcher variant="ghost" />
      </div>

      <SideNav />

      {/* Hero */}
      <section id="hero" className="relative flex min-h-[100svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-30"
          >
            <source src={HERO_VIDEO_LOOP} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(70% 70% at 80% 15%, rgba(16,185,129,0.22) 0%, rgba(14,165,233,0.14) 40%, rgba(6,10,16,0.92) 75%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060a10] via-[#060a10]/30 to-[#060a10]/70" />
        </div>

        <div className="relative z-10 w-full px-6 pb-20 pt-32 sm:px-10 sm:pb-28 lg:px-16">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-400 sm:text-sm">
              {t('Company Introduction · 2026')}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display mt-5 max-w-4xl text-[11vw] font-semibold leading-[0.95] text-white sm:text-6xl lg:text-7xl">
              {t('Medium-Voltage Power Distribution & Electrical Component Supply')}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {t('Project-specific solutions from design to delivery')}
            </p>
          </Reveal>
        </div>

        <div className="absolute bottom-8 right-6 z-10 hidden items-center gap-2 text-xs uppercase tracking-widest text-slate-500 sm:right-10 lg:flex">
          <span className="h-8 w-px animate-pulse bg-slate-500" />
          {t('Scroll')}
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="relative overflow-hidden border-t border-white/10 px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/company-presentation/02-overview.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-bottom opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a10] from-45% via-[#060a10]/25 via-60% to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <SectionKicker>{t('Overview')}</SectionKicker>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-5xl">
              {t('Two business lines, one goal: the right solution')}
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:mt-20 sm:grid-cols-2">
            {businessLines.map((line, i) => (
              <Reveal key={line.title} delay={i * 100} className="bg-[#0a1119] p-8 sm:p-10">
                <span className="font-display text-sm text-sky-400">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display mt-4 text-xl text-white sm:text-2xl">{t(line.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">{t(line.body)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MV & Power Distribution Solutions */}
      <section id="capabilities" className="border-t border-white/10 px-6 pt-24 sm:px-10 sm:pt-32 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SectionKicker>{t('Capabilities')}</SectionKicker>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-5xl">
              {t('Medium-voltage & power distribution solutions')}
            </h2>
          </Reveal>
        </div>
      </section>

      <div ref={capabilitiesWrapperRef} className="relative py-10 lg:h-screen lg:overflow-hidden lg:py-0">
        <div
          ref={capabilitiesTrackRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 sm:px-10 lg:h-full lg:snap-none lg:items-center lg:gap-6 lg:overflow-x-visible lg:px-16 lg:pb-0"
        >
          {solutionCapabilities.map((item, i) => (
            <Reveal
              key={item.title}
              delay={(i % 3) * 100}
              className="flex h-[420px] w-[78vw] max-w-sm shrink-0 snap-center flex-col border border-white/10 bg-[#0a1119] transition hover:border-emerald-400/30 lg:h-[65vh] lg:w-[420px]"
            >
              <div className="flex flex-1 items-center justify-center p-8">
                <img src={item.image} alt="" aria-hidden="true" className="h-full w-full object-contain" />
              </div>
              <div className="border-t border-white/10 p-6">
                <h3 className="font-display text-xl text-white">{t(item.title)}</h3>
                <p className="mt-3 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-slate-400">
                  {t(item.body)}
                </p>
              </div>
            </Reveal>
          ))}
          <div className="w-6 shrink-0 sm:w-10 lg:w-16" aria-hidden="true" />
        </div>
      </div>

      {/* Process & Sectors */}
      <section id="process" className="relative overflow-hidden border-t border-white/10 px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/company-presentation/04-how-we-work.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-bottom opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a10] from-45% via-[#060a10]/25 via-60% to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <SectionKicker>{t('How we work')}</SectionKicker>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-5xl">
              {t('Engineered around your project, not a catalogue')}
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-5">
            {processSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 80} className="border-t border-white/15 pt-6">
                <span className="font-display text-sm text-sky-400">{step.step}</span>
                <h3 className="font-display mt-3 text-lg text-white">{t(step.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{t(step.body)}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{t('Sectors we serve')}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {sectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-300"
                >
                  {t(sector)}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Electrical Component Supply */}
      <section id="distribution" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden border-t border-white/10 px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/company-presentation/05-distribution.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-bottom opacity-[0.08]"
          />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <SectionKicker>{t('Distribution')}</SectionKicker>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-5xl">
              {t('Electrical component supply & distribution')}
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2">
            {componentBrands.map((brand, i) => (
              <Reveal
                key={brand.title}
                delay={i * 100}
                className="rounded-2xl border border-white/10 bg-[#0a1119] p-8"
              >
                <h3 className="font-display text-xl text-white">{t(brand.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{t(brand.body)}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#0a1119] p-6 text-sm leading-relaxed text-slate-400">
              {t('Nationwide dealer network across Türkiye')}
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0a1119] p-6 text-sm leading-relaxed text-slate-400">
              {t('Direct supply to major manufacturers, sourced from China and Belgium')}
            </div>
          </Reveal>

          <Reveal delay={250} className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-8">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">{t('Key contract')}</p>
            <p className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">$2.5M</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              {t("Cylindrical fuse supply agreement with ASTOR, one of Türkiye's leading transformer manufacturers")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* International Projects -> Türkiye Projects (horizontal pin-scroll on large screens) */}
      <div ref={wrapperRef} className="relative overflow-hidden border-t border-white/10 lg:h-screen">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/company-presentation/06-track-record.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-bottom opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a10] from-45% via-[#060a10]/25 via-60% to-transparent" />
        </div>

        <div ref={trackRef} className="relative flex flex-col lg:w-[200%] lg:flex-row">
          <section
            id="international-projects"
            className="px-6 py-24 sm:px-10 sm:py-32 lg:flex lg:h-screen lg:w-screen lg:shrink-0 lg:flex-col lg:justify-center lg:px-16 lg:py-16"
          >
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <SectionKicker>{t('Track record')}</SectionKicker>
                <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-5xl">
                  {t('International projects')}
                </h2>
              </Reveal>

              <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-2 lg:mt-10">
                {internationalProjects.map((project, i) => (
                  <Reveal
                    key={project.title}
                    delay={(i % 2) * 100}
                    className="rounded-2xl border border-white/10 bg-[#0a1119] p-8"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-400">{t(project.country)}</p>
                    <h3 className="font-display mt-3 text-xl text-white">{t(project.title)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{t(project.body)}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section
            id="turkey-projects"
            className="px-6 py-24 sm:px-10 sm:py-32 lg:flex lg:h-screen lg:w-screen lg:shrink-0 lg:flex-col lg:justify-center lg:px-16 lg:py-16"
          >
            <div className="mx-auto max-w-6xl">
              <Reveal>
                <SectionKicker>{t('Selected references')}</SectionKicker>
                <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-5xl">
                  {t('Selected projects in Türkiye')}
                </h2>
              </Reveal>

              <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-3 lg:mt-10">
                {turkeyProjects.map((project, i) => (
                  <Reveal
                    key={project.title}
                    delay={i * 100}
                    className="rounded-2xl border border-white/10 bg-[#0a1119] p-7"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-sky-400">{t(project.tag)}</p>
                    <p className="font-display mt-4 text-2xl font-semibold text-emerald-400">{project.highlight}</p>
                    <h3 className="font-display mt-2 text-lg text-white">{t(project.title)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">{t(project.body)}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Why Partner */}
      <section id="why-partner" className="relative overflow-hidden border-t border-white/10 px-6 py-24 sm:px-10 sm:py-32 lg:px-16">
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/company-presentation/08-why-green-pi.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-bottom opacity-[0.08]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060a10] from-45% via-[#060a10]/25 via-60% to-transparent" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <SectionKicker>{t('Partnership')}</SectionKicker>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-medium leading-tight text-white sm:text-5xl">
              {t('Why partner with Green Pi Energy')}
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-3">
            {partnerReasons.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 100} className="border-t border-white/15 pt-6">
                <h3 className="font-display text-lg text-white">{t(reason.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{t(reason.body)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="border-t border-white/10 px-6 py-28 sm:px-10 sm:py-36 lg:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <h2 className="font-display text-4xl font-semibold leading-tight text-white sm:text-6xl">
              {t("Let's work together")}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
              {t("Tell us about your projects and supply needs — we'll prepare a tailored offer.")}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/contact-form"
                className="rounded-full bg-emerald-400 px-8 py-3 text-sm font-semibold text-[#060a10] transition hover:bg-emerald-300"
              >
                {t('Get a quote')}
              </Link>
              <a
                href="mailto:info@greenpi.com.tr"
                className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:border-white/40"
              >
                info@greenpi.com.tr
              </a>
            </div>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-16 text-xs uppercase tracking-[0.3em] text-slate-500">
              Green Pi Enerji · Ankara · Türkiye
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default CompanyPresentation
