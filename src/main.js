import Vue from 'vue'
import Index from './views/Index.vue'

import './global'
import './plugins'
import './assets/main.scss'

import router from './router'
import store from './store'

window.$ = window.jQuery = require('jquery'); 

// implement a Vue with store and router
new Vue({
  router,
  store,
  render: h => h(Index),
}).$mount('#app')
