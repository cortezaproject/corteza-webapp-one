import Vue from 'vue'
import VueRouterMultiView from 'vue-router-multi-view'
import Router from 'vue-router'
import Vuex from 'vuex'

import { plugins } from '@cortezaproject/corteza-vue'

Vue.use(Router)
Vue.use(VueRouterMultiView)
Vue.use(Router)
Vue.use(Vuex)

Vue.use(plugins.CortezaAPI('system'))
Vue.use(plugins.CortezaAPI('messaging'))

Vue.use(plugins.Auth(), { api: Vue.prototype.$SystemAPI })
