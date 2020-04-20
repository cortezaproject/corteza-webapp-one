import Vue from 'vue'
import Vuex from 'vuex'

import layout from './layout'
import applications from './applications'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    layout: layout({
      localStorage: window.localStorage,
    }),
    applications: applications({ api: Vue.prototype.$SystemAPI }),
  },
})

export default store
