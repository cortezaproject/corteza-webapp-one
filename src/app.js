import Vue from 'vue'

import './config-check'
import './console-splash'

import './plugins'
import './mixins'
import './components'
import store from './store'
import router from './router'

import { i18n } from '@cortezaproject/corteza-vue'

export default (options = {}) => {
  options = {
    el: '#app',
    name: 'one',
    template: '<div v-if="loaded && i18nLoaded"><router-view/></div>',

    data: () => ({
      loaded: false,
      i18nLoaded: false,
    }),

    async created () {
      this.$i18n.i18next.on('loaded', () => {
        this.i18nLoaded = true
      })

      return this.$auth.vue(this).handle().then(({ user }) => {
        this.loaded = true
      }).catch((err) => {
        if (err instanceof Error && err.message === 'Unauthenticated') {
          // user not logged-in,
          // start with authentication flow
          this.$auth.startAuthenticationFlow()
          return
        }

        throw err
      })
    },

    router,
    store,
    i18n: i18n(Vue,
      'one',
    ),

    // Any additional options we want to merge
    ...options,
  }

  return new Vue(options)
}
