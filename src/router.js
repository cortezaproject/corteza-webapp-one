import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/form-elements', component: () => import('./views/form-elements.vue') },
    { path: '/:name', component: () => import('./views/Workspace.vue') },
    { path: '/', component: () => import('./views/Workspace.vue') },
  ],
})
