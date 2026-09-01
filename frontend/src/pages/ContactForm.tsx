import { useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import PageBackground from '../components/PageBackground'

const TITLE = 'Green Pi Quote Center'
const SUBTITLE = 'Get a quote for the right product and technical solution for your project'
const INTRO_TEXT =
  'Share your requirements in a few steps. Your request will be reviewed directly by the relevant team.'

const SECTION_1_TITLE = 'Your Contact Information'
const SECTION_1_SUBTITLE = 'Fill in the basic details so we can get back to you.'
const SECTION_2_TITLE = 'Project and Product Details'
const SECTION_2_SUBTITLE = 'Tell us about your needs so we can recommend the right product and solution.'

const CONSENT_TEXT =
  'I consent to the processing of the information I provide so that my request can be evaluated and I can be contacted.'
const CONSENT_ERROR = 'You must check this box to continue.'
const REQUIRED_NOTE = 'Fields marked with an asterisk (*) are required.'

const DIRECT_TITLE = 'Direct Contact'
const DIRECT_SUBTITLE = 'Our technical team is here for you'
const DIRECT_TEXT =
  'You can reach our technical team for product selection, project consultancy, pricing, and delivery timelines.'

const EMPTY = {
  adSoyad: '',
  firma: '',
  telefon: '',
  eposta: '',
  sehir: '',
  sektor: '',
  projeAdi: '',
  miktar: '',
  detay: '',
  website: '',
  onay: false,
}

const inputClass =
  'w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder-white/40 outline-none backdrop-blur-md transition focus:border-emerald-400/50'

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-white/70">{label}</span>
      {children}
    </label>
  )
}

function FormSection({
  title,
  subtitle,
  note,
  children,
}: {
  title: string
  subtitle: string
  note?: string
  children: ReactNode
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold text-white">{title}</h2>
      <p className="text-white/70">{subtitle}</p>
      {note && <p className="mb-6 mt-1 text-xs text-white/50">{note}</p>}
      {!note && <div className="mb-6" />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

function ContactForm() {
  const { t } = useTranslation()
  const [form, setForm] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [consentError, setConsentError] = useState(false)

  function set<K extends keyof typeof EMPTY>(key: K, value: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.onay) {
      setConsentError(true)
      return
    }
    setConsentError(false)
    setSubmitted(true)
  }

  return (
    <PageBackground>
      <div className="min-h-screen w-full px-6 pb-20 pt-32 md:px-10">
        <div className="mx-auto w-full">
          <h1 className="mb-3 text-3xl font-semibold text-white">{t(TITLE)}</h1>
          <p className="mb-2 text-lg text-white">{t(SUBTITLE)}</p>
          <p className="mb-10 leading-relaxed text-emerald-300">{t(INTRO_TEXT)}</p>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-900/85 p-8 shadow-2xl lg:order-2 lg:col-span-1">
            <div
              className="pointer-events-none absolute left-0 top-0 h-24 w-24 bg-emerald-400/20"
              style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            />
            <div className="relative">
              <h2 className="mb-1 text-xl font-semibold text-white">{t(DIRECT_TITLE)}</h2>
              <p className="mb-3 text-white/85">{t(DIRECT_SUBTITLE)}</p>
              <p className="mb-6 leading-relaxed text-white/75">{t(DIRECT_TEXT)}</p>
              <div className="space-y-2 text-white/85">
                <span className="block">{t('Ankara')}</span>
                <a href="tel:+903128701260" className="block hover:text-emerald-300">
                  +90 312 870 12 60
                </a>
                <a href="mailto:info@greenpi.com.tr" className="block hover:text-emerald-300">
                  info@greenpi.com.tr
                </a>
              </div>
              <Link
                to="/contact"
                className="mt-6 inline-block rounded-full border border-sky-400/30 bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500 hover:text-emerald-300"
              >
                {t('Contact Information')}
              </Link>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-900/85 p-8 shadow-2xl lg:order-1 lg:col-span-2"
          >
            <div
              className="pointer-events-none absolute left-0 top-0 h-24 w-24 bg-emerald-400/20"
              style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
            />
            <div className="relative space-y-8">
              {/* Bot'lar dolduracak, gerçek kullanıcılar görmeyecek. */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => set('website', e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              <FormSection title={t(SECTION_1_TITLE)} subtitle={t(SECTION_1_SUBTITLE)} note={t(REQUIRED_NOTE)}>
                <Field label={`${t('Full Name')} *`}>
                  <input
                    required
                    value={form.adSoyad}
                    onChange={(e) => set('adSoyad', e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('Company / Organization')}>
                  <input value={form.firma} onChange={(e) => set('firma', e.target.value)} className={inputClass} />
                </Field>
                <Field label={`${t('Phone')} *`}>
                  <input
                    required
                    type="tel"
                    value={form.telefon}
                    onChange={(e) => set('telefon', e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label={`${t('Email')} *`}>
                  <input
                    required
                    type="email"
                    value={form.eposta}
                    onChange={(e) => set('eposta', e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label={t('City')}>
                  <input value={form.sehir} onChange={(e) => set('sehir', e.target.value)} className={inputClass} />
                </Field>
                <Field label={t('Sector / Application Area')}>
                  <input
                    value={form.sektor}
                    onChange={(e) => set('sektor', e.target.value)}
                    placeholder={t('Solar plant, wind plant, factory, data center...')}
                    className={inputClass}
                  />
                </Field>
              </FormSection>

              <FormSection title={t(SECTION_2_TITLE)} subtitle={t(SECTION_2_SUBTITLE)}>
                <Field label={t('Project Name')}>
                  <input value={form.projeAdi} onChange={(e) => set('projeAdi', e.target.value)} className={inputClass} />
                </Field>
                <Field label={t('Quantity / Estimated Amount')}>
                  <input
                    value={form.miktar}
                    onChange={(e) => set('miktar', e.target.value)}
                    placeholder={t('E.g. 12 units')}
                    className={inputClass}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label={`${t('Request Details')} *`}>
                    <textarea
                      required
                      rows={4}
                      value={form.detay}
                      onChange={(e) => set('detay', e.target.value)}
                      placeholder={t('Describe your technical needs, delivery expectations, project scope, or alternative product request.')}
                      className={`${inputClass} resize-none`}
                    />
                  </Field>
                </div>
              </FormSection>

              <div>
                <label className="flex items-start gap-3 text-sm text-white/80">
                  <input
                    type="checkbox"
                    checked={form.onay}
                    onChange={(e) => {
                      set('onay', e.target.checked)
                      if (e.target.checked) setConsentError(false)
                    }}
                    className="mt-1"
                  />
                  {t(CONSENT_TEXT)} *
                </label>
                {consentError && <p className="mt-1.5 text-sm text-red-400">{t(CONSENT_ERROR)}</p>}
              </div>

              {submitted ? (
                <p className="text-emerald-300">{t('Your request has been received, thank you.')}</p>
              ) : (
                <button
                  type="submit"
                  className="cursor-pointer rounded-full border border-sky-400/30 bg-sky-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-500 hover:text-emerald-300"
                >
                  {t('Submit Quote Request')}
                </button>
              )}
            </div>
          </form>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

export default ContactForm
