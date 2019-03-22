import Vue from 'vue'
import Vuex from 'vuex'

import user from './user'
import panes from './panes'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    panes,
  },
  // plugins: [createLogger()],
})

export default store
