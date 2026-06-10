import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import viCommon from './locales/vi/common.json'
import viPublic from './locales/vi/public.json'
import viAdmin from './locales/vi/admin.json'

import enCommon from './locales/en/common.json'
import enPublic from './locales/en/public.json'
import enAdmin from './locales/en/admin.json'

import jaCommon from './locales/ja/common.json'
import jaPublic from './locales/ja/public.json'
import jaAdmin from './locales/ja/admin.json'

export const LOCALE_STORAGE_KEY = 'plt-locale'
export const SUPPORTED_LOCALES = ['vi', 'en', 'ja']
export const DEFAULT_LOCALE = 'vi'

function getStoredLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  return SUPPORTED_LOCALES.includes(stored) ? stored : DEFAULT_LOCALE
}

function applyDocumentLang(lng) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng
  }
}

i18n.use(initReactI18next).init({
  resources: {
    vi: { common: viCommon, public: viPublic, admin: viAdmin },
    en: { common: enCommon, public: enPublic, admin: enAdmin },
    ja: { common: jaCommon, public: jaPublic, admin: jaAdmin },
  },
  lng: getStoredLocale(),
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: SUPPORTED_LOCALES,
  ns: ['common', 'public', 'admin'],
  defaultNS: 'common',
  load: 'languageOnly',
  interpolation: { escapeValue: false },
})

applyDocumentLang(i18n.language)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LOCALE_STORAGE_KEY, lng)
  applyDocumentLang(lng)
})

export default i18n
