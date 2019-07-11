import Vue from 'vue'

import './config-check'
import './console-splash'

import './google-maps'

import './plugins'
import './mixins'
import './components'

import i18n from './i18n'
import store from './store'
import router from './router'

import Index from './views/Index'

export default (options = {}) => {
  options = {
    el: '#app',
    name: 'one',
    render: h => h(Index),

    router,
    store,
    i18n: i18n(),

    // Any additional options we want to merge
    ...options,
  }

  return new Vue(options)
}
