import Vue from 'vue'
import i18next from 'i18next'
import lngDetector from 'i18next-browser-languagedetector'
import VueI18Next from '@panter/vue-i18next'
import Pseudo from 'i18next-pseudo'

import en from './en'

export const options = {
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'one',
  ns: ['one'],
  debug: process.env.NODE_ENV !== 'production',
  detection: {
    // to overwrite, to use user defined, to guess user's lang
    order: ['querystring', 'localStorage', 'cookie', 'navigator'],
    caches: [/* 'localStorage', 'cookie' */],
  },
  resources: {
    en,
  },
}

// Initializes i18n options, registers
// plugin on a given Vue instance and returns the options (to be used in new Vue({ i18n: ... })
export default (options) => {
  i18next.use(lngDetector).init(options)

  i18next
    .use(new Pseudo({
      enabled: process.env.NODE_ENV !== 'production',
    }))
    .init({
      postProcess: ['pseudo'],
    })

  Vue.use(VueI18Next)
  return new VueI18Next(i18next)
}
