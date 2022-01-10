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
        // switch the page directionality on body based on language
        document.body.setAttribute('dir', this.textDirectionality)

        if (user.meta.preferredLanguage) {
          // After user is authenticated, get his preferred language
          // and instruct i18next to change it
          this.$i18n.i18next.changeLanguage(user.meta.preferredLanguage)
        }

        this.$Settings.init({ api: this.$SystemAPI }).finally(() => {
          this.loaded = true
        })
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
      { app: 'corteza-webapp-one' },
      'app',
      'layout',
      'navigation',
    ),

    // Any additional options we want to merge
    ...options,
  }

  return new Vue(options)
}
