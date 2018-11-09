import store from '@/store'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function protect (to, from, next) {
  next(store.getters['auth/isAuthenticated'] ? true : '/auth/signin')
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/form-elements',
      component: view('form-elements'),
    },
    {
      path: '/:name',
      component: view('Workspace'),
      beforeEnter: protect,
    },
    {
      path: '/',
      name: 'root',
      component: view('Workspace'),
      beforeEnter: protect,
    },
    {
      path: '/auth',
      component: view('IndexNested'),
      redirect: '/auth/signin',
      children: [
        {
          path: 'signin',
          name: 'signin',
          component: view('Auth/SignIn'),
        },
        {
          path: 'signout',
          name: 'signout',
          component: view('Auth/SignOut'),
        },
      ],
    },
    {
      path: '*',
      redirect: {
        name: 'root',
      },
    },
  ],
})

function view (name, resolve) {
  return function (resolve) {
    return require([`./views/${name}.vue`], resolve)
  }
}
