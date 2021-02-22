import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import { plugins } from '@cortezaproject/corteza-vue'

Vue.use(plugins.Auth(), { app: 'unify' })

Vue.use(Router)
Vue.use(Router)
Vue.use(Vuex)

Vue.use(plugins.CortezaAPI('system'))
Vue.use(plugins.CortezaAPI('messaging'))
Vue.use(plugins.Settings, { api: Vue.prototype.$SystemAPI })
