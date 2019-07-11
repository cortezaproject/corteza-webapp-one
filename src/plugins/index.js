import Vue from 'vue'
import VueRouterMultiView from 'vue-router-multi-view'
import Router from 'vue-router'
import Vuex from 'vuex'

import auth from 'corteza-webapp-common/src/plugins/auth'
import system from 'corteza-webapp-common/src/plugins/system'
import messaging from 'corteza-webapp-common/src/plugins/messaging'

Vue.use(Router)
Vue.use(VueRouterMultiView)
Vue.use(Router)
Vue.use(Vuex)
Vue.use(auth)
Vue.use(system)
Vue.use(messaging)
