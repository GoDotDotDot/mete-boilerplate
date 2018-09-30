/**
 * i18n.js
 *
 * This will setup the i18n language files and locale data for your app.
 *
 */
import { addLocaleData } from 'react-intl'
import enLocaleData from 'react-intl/locale-data/en'
import zhCnLocaleData from 'react-intl/locale-data/zh'

// import { DEFAULT_LOCALE } from '../app/containers/App/constants'

import enTranslationMessages from './translations/en.json'
import zhCnTranslationMessages from './translations/zh-cn.json'

addLocaleData(enLocaleData)
addLocaleData(zhCnLocaleData)

const DEFAULT_LOCALE = 'en'

export const appLocales = [
  'en',
  'zh-cn'
]

export const formatTranslationMessages = (locale, messages) => {
  const defaultFormattedMessages = locale !== DEFAULT_LOCALE
    ? formatTranslationMessages(DEFAULT_LOCALE, enTranslationMessages)
    : {}
  return Object.keys(messages).reduce((formattedMessages, key) => {
    const formattedMessage = !messages[key] && locale !== DEFAULT_LOCALE
      ? defaultFormattedMessages[key]
      : messages[key]
    return Object.assign(formattedMessages, { [key]: formattedMessage })
  }, {})
}

export const translationMessages = {
  en: formatTranslationMessages('en', enTranslationMessages),
  'zh-cn': formatTranslationMessages('zh-cn', zhCnTranslationMessages)
}
