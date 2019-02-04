import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/bridge',
      component: view('Bridge'),
      children: [
        { path: 'jitsi', name: 'bridge-jitsi', component: view('Bridge/Jitsi') },
      ],
    },
    {
      path: '/:name',
      component: view('Workspace'),
    },
    {
      path: '/',
      name: 'root',
      component: view('Workspace'),
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
    return require([`./views/${name}`], resolve)
  }
}
