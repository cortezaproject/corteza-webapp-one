import Vue from 'vue'
import Index from './views/Index.vue'

import './global'
import './plugins'
import './main.scss'

import router from './router'
import i18n from './i18next'
import store from './store'
import logger from './logger'
import * as VueGoogleMaps from 'vue2-google-maps'

/* eslint-disable no-undef */
logger.log(
  `%cUnify, version: ${VERSION}, build time: ${BUILD_TIME}`,
  'background-color: #1397CB; color: white; padding: 3px 10px; border: 1px solid black; font: Courier',
)

if (window.SystemAPI === undefined) {
  alert('Unexisting or invalid configuration. Make sure there is a public/config.js configuration file.')
} else {
  // An uglyhack to get gmaps working
  // this plugin does not allow us to pass key inside the component
  //
  // Since we load gmaps bridge inside an iframe anyway, let's pass
  // the key as GET param (location.search).
  if (window.location.pathname.indexOf('/bridge/google-maps') === 0) {
    const qs = window.location.search
    if (qs.length < 30) {
      console.error('Expecting a valid Google Maps API key in query-string: /bridge/google-maps?{api-key}', { qs })
    } else {
      Vue.use(VueGoogleMaps, {
        load: {
          key: qs.substring(1),
          libraries: 'places', // necessary for places input
        },
      })
    }
  }

  new Vue({
    router,
    i18n,
    store,
    render: h => h(Index),
  }).$mount('#app')
}
