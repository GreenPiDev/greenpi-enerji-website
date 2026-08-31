import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import tr from "./locales/tr.json";
import en from "./locales/en.json";

// Çeviri anahtarları semantik id değil, kaynak (İngilizce) metnin kendisidir.
// Örn: t("Close") -> tr: "Kapat", en: "Close".
// Bu yüzden nokta/boşluk içeren key'lerin nested path sanılmaması için
// keySeparator ve nsSeparator kapatılıyor.
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { translation: tr },
      en: { translation: en },
    },
    fallbackLng: "tr",
    supportedLngs: ["tr", "en"],
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
  });

export default i18n;
