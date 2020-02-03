import { components } from '@cortezaproject/corteza-vue'

function view (name, resolve) {
  return function (resolve) {
    return require([`./${name}`], resolve)
  }
}

export default [
  // we're stuck with ol'school dev-auth view (no bootstrap)
  { path: '/auth', name: 'auth', component: components.CDevAuthLite },

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
]
