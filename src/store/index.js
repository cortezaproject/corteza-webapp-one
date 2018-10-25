import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import user from './user'
import panes from './panes'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    user,
    panes,
  },
  // plugins: [createLogger()],
})

export default store
