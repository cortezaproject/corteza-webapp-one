import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/auth', name: 'auth', component: view('Auth') },

    {
      path: '/',
      name: 'root',
      component: view('Workspace'),
    },

    {
      path: '/bridge',
      component: view('Bridge'),
      children: [
        { path: 'jitsi', name: 'bridge-jitsi', component: view('Bridge/Jitsi') },
        { path: 'google-maps', name: 'bridge-google-maps', component: view('Bridge/GoogleMaps') },
      ],
    },

    { path: '*', component: view('NoApp') },
  ],
})

function view (name, resolve) {
  return function (resolve) {
    return require([`./views/${name}`], resolve)
  }
}
