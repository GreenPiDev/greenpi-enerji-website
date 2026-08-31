import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import tr from "./locales/tr.json";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import ar from "./locales/ar.json";
import az from "./locales/az.json";

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
      ru: { translation: ru },
      ar: { translation: ar },
      az: { translation: az },
    },
    fallbackLng: "tr",
    supportedLngs: ["tr", "en", "ru", "ar", "az"],
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
  });

// Layout bilinçli olarak her zaman LTR: Arapça seçilse bile sadece metin
// çevriliyor, header/menü yerleşimi sabit kalıyor (kullanıcı tercihi).
function applyLang(lng: string) {
  document.documentElement.lang = lng;
}

applyLang(i18n.resolvedLanguage ?? "tr");
i18n.on("languageChanged", applyLang);

export default i18n;
