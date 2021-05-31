import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import { plugins } from '@cortezaproject/corteza-vue'

Vue.use(plugins.Auth(), {
  app: 'unify',
  rootApp: true,
})

Vue.use(Router)
Vue.use(Vuex)
Vue.use(BootstrapVue)
Vue.use(plugins.CortezaAPI('system'))
Vue.use(plugins.Settings, { api: Vue.prototype.$SystemAPI })
