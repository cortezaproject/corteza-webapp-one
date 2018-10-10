import Vue from 'vue'
import Index from './views/Index.vue'
import router from './router'
import './global'
import './main.scss'
import store from './store'
console.log('main')
// implement a Vue with store and router
new Vue({
  router,
  store,
  render: h => h(Index),
}).$mount('#app')
