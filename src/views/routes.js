function view (name, resolve) {
  return function (resolve) {
    return require([`./${name}`], resolve)
  }
}

export default [
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
]
