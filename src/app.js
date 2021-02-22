import Vue from 'vue'

import './config-check'
import './console-splash'

import './google-maps'

import './plugins'
import './mixins'
import './components'

import i18n, { options as i18nOptions } from './i18n'
import store from './store'
import router from './router'

export default (options = {}) => {
  options = {
    el: '#app',
    name: 'one',
    template: '<div v-if="loaded"><router-view/></div>',

    data: () => ({ loaded: false }),
    async created () {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.getAll('code')[0]

      if (code) {
        await this.$auth.useCode(code)
          .then(async () => {
            await this.$auth.check()
            // In case the api client jwt hasn't been set yet
            this.$SystemAPI.setJWT(this.$auth.JWT)
          })
          .catch(() => {
            this.$auth.open()
          })
          .finally(() => {
            this.loaded = true
            this.$router.push({ name: 'layout' })
          })
      } else {
        this.loaded = true
      }
    },

    router,
    store,
    i18n: i18n(options.i18nOptions || i18nOptions),

    // Any additional options we want to merge
    ...options,
  }

  return new Vue(options)
}
