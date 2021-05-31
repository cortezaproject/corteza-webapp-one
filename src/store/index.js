import Vue from 'vue'
import Vuex from 'vuex'

import applications from './applications'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    applications: applications({ api: Vue.prototype.$SystemAPI }),
  },
})

export default store
