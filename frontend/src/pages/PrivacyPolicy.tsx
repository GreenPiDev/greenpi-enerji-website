import { useTranslation } from 'react-i18next'
import PageBackground from '../components/PageBackground'
import Seo from '../components/Seo'

const DOC_TITLE = 'Information Notice on the Protection and Processing of Personal Data'
const DOC_SUBTITLE = 'Green Pi Enerji – Contact Form'
const INTRO_TEXT =
  'As Green Pi Enerji (“Company”), we attach importance to the confidentiality and security of the personal data you share with us through the contact form on our website. Your personal data is processed within the scope of Law No. 6698 on the Protection of Personal Data (“KVKK”) for the purposes and legal grounds explained below.'

const COMPANY_NAME = 'Green Pi Enerji Müh. Elektrik Dan. San. ve Tic. Ltd. Şti.'
const COMPANY_ADDRESS = 'Gümüş Cd. No:40, Konutkent, 06810 Yenimahalle/Ankara'
const COMPANY_EMAIL = 'info@greenpi.com.tr'

const L_COMPANY_NAME = 'Company name:'
const L_ADDRESS = 'Address:'
const L_EMAIL = 'Email:'

const LAST_UPDATED_LABEL = 'Last updated:'
const LAST_UPDATED_DATE = '12.10.2026'

type Section = {
  heading: string
  paragraphs?: string[]
  listIntro?: string
  list?: string[]
  listOutro?: string
}

const SECTIONS: Section[] = [
  {
    heading: '2. Personal Data Processed',
    listIntro: 'If you fill out the contact form, the following personal data of yours may be processed:',
    list: [
      'Identity information: Your name and surname.',
      'Contact information: Your email address and phone number.',
      'Customer and transaction information: Your company name, information regarding the products or services you request, and the content of your message.',
      'Transaction security information: Depending on the technical structure of the website, your IP address and transaction records.',
    ],
    listOutro:
      'Please do not enter any special category personal data that is not required, or personal data belonging to third parties, in the message field of the contact form.',
  },
  {
    heading: '3. Purposes of Processing Personal Data',
    listIntro: 'Your personal data is processed for the following purposes:',
    list: [
      'Receiving and responding to your contact requests,',
      'Evaluating your product, material, and supply requests,',
      'Providing information about product supply for low and medium voltage transformer and panel manufacturing,',
      'Preparing a quotation in line with your request and carrying out commercial processes,',
      'Managing customer relations and business processes,',
      'Ensuring information security and keeping the necessary records in case of possible disputes.',
    ],
  },
  {
    heading: '4. Legal Grounds for Processing Personal Data',
    paragraphs: [
      'Your personal data is processed based on the legal grounds set out in Article 5 of the KVKK. In this context, data processing may be based on the grounds that it is directly related to the establishment of a contract, where this is necessary for the evaluation and conclusion of your request; the fulfillment of legal obligations; and that data processing is mandatory for the establishment, exercise, or protection of a right, or for the legitimate interests of our Company, provided that this does not harm your fundamental rights and freedoms.',
      'Each data processing activity is carried out provided that the relevant legal ground exists in the specific case.',
    ],
  },
  {
    heading: '5. Transfer of Personal Data',
    paragraphs: [
      'To the extent necessary for the fulfillment of the purposes stated above and in accordance with Articles 8 and 9 of the KVKK, your personal data may be transferred to authorized public institutions and organizations, to persons authorized within the scope of legal obligations, and to service providers from whom website, server, e-mail, or information technology services are obtained.',
      'Your personal data is not shared with third parties and is not used for purposes other than those stated above, unless there is a legal obligation or a valid processing condition.',
    ],
  },
  {
    heading: '6. Storage and Security of Personal Data',
    paragraphs: [
      'Your personal data is retained for the period required by the purposes of processing, taking into account the storage periods stipulated in the relevant legislation. When the storage period expires or the reason for processing ceases to exist, your personal data is deleted, destroyed, or anonymized in accordance with the legislation.',
      'Our Company aims to take appropriate technical and administrative measures to prevent the unlawful processing of and access to your personal data and to ensure that the data is securely stored.',
    ],
  },
  {
    heading: '7. Your Rights under the KVKK',
    listIntro: 'Pursuant to Article 11 of the KVKK, by applying to our Company, you have the right to:',
    list: [
      'Learn whether your personal data is being processed,',
      'Request information regarding the processing if it has been processed,',
      'Learn the purpose of processing and whether it is used in accordance with that purpose,',
      'Learn the third parties to whom your personal data has been transferred,',
      'Request the correction of your personal data if it has been processed incompletely or incorrectly,',
      'Request the deletion or destruction of your personal data within the framework of the conditions set out in the Law,',
      'Request that the correction, deletion, or destruction be notified to the third parties to whom the data has been transferred,',
      'Object to a result that is to your detriment arising from the analysis of the data exclusively through automated systems,',
      'Request compensation for damages in case you suffer damage due to the unlawful processing of data.',
    ],
    listOutro:
      'You may submit your requests regarding your rights to our Company via info@greenpi.com.tr or our Company address, in accordance with the procedures and principles set out in the KVKK and relevant legislation.',
  },
]

function PrivacyPolicy() {
  const { t } = useTranslation()
  return (
    <PageBackground>
      <Seo title={t('Privacy Policy')} description={t('Green Pi Enerji privacy policy.')} />
      <div className="min-h-screen w-full px-6 pb-20 pt-32 md:px-10">
        <h1 className="mb-10 text-3xl font-semibold text-white">{t('Privacy Policy')}</h1>
        <div className="relative w-full overflow-hidden rounded-2xl border border-emerald-400/15 bg-slate-900/85 p-8 shadow-2xl">
          <div
            className="pointer-events-none absolute left-0 top-0 h-32 w-32 bg-emerald-400/20"
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          />
          <div className="relative space-y-8 text-white/85">
            <div>
              <h2 className="text-xl font-semibold text-white">{t(DOC_TITLE)}</h2>
              <p className="mt-1 text-sm text-white/60">{t(DOC_SUBTITLE)}</p>
              <p className="mt-4 text-justify leading-relaxed">{t(INTRO_TEXT)}</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold text-emerald-300">{t('1. Data Controller')}</h2>
              <p className="text-justify leading-relaxed">
                {t('Under the KVKK, your personal data is processed by the following company acting as the data controller:')}
              </p>
              <ul className="mt-3 space-y-1">
                <li>
                  <span className="text-white/60">{t(L_COMPANY_NAME)}</span> {COMPANY_NAME}
                </li>
                <li>
                  <span className="text-white/60">{t(L_ADDRESS)}</span> {COMPANY_ADDRESS}
                </li>
                <li>
                  <span className="text-white/60">{t(L_EMAIL)}</span> {COMPANY_EMAIL}
                </li>
              </ul>
            </div>

            {SECTIONS.map((section) => (
              <div key={section.heading}>
                <h2 className="mb-2 text-lg font-semibold text-emerald-300">{t(section.heading)}</h2>
                {section.paragraphs?.map((p) => (
                  <p key={p} className="mb-3 text-justify leading-relaxed last:mb-0">
                    {t(p)}
                  </p>
                ))}
                {section.listIntro && <p className="mb-3 text-justify leading-relaxed">{t(section.listIntro)}</p>}
                {section.list && (
                  <ul className="mb-3 list-disc space-y-1.5 pl-5">
                    {section.list.map((item) => (
                      <li key={item} className="text-justify leading-relaxed">
                        {t(item)}
                      </li>
                    ))}
                  </ul>
                )}
                {section.listOutro && <p className="text-justify leading-relaxed">{t(section.listOutro)}</p>}
              </div>
            ))}

            <p className="text-sm text-white/60">
              {t(LAST_UPDATED_LABEL)} {LAST_UPDATED_DATE}
            </p>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

export default PrivacyPolicy
