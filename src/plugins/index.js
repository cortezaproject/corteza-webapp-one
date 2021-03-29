import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import { plugins } from '@cortezaproject/corteza-vue'

Vue.use(plugins.Auth(), {
  app: 'unify',
  // A tiny exception we need to
  callbackURL: `${location.protocol}//${location.host}/auth/callback`,
})

Vue.use(Router)
Vue.use(Vuex)

Vue.use(plugins.CortezaAPI('system'))
Vue.use(plugins.Settings, { api: Vue.prototype.$SystemAPI })
