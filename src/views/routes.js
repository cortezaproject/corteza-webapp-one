import { components } from '@cortezaproject/corteza-vue'

/**
 * Simple route generator
 *
 * @param name {String}
 * @param path {String}
 * @param component {String}
 * @returns {Object}
 */
function r (name, path, component) {
  return {
    path,
    name,
    component: () => import('./' + component + '.vue'),
    props: true,
    // canReuse: false,
  }
}

export default [
  r('layout', '/', 'Layout'),

  {
    ...r('bridge', '/bridge', 'Bridge/index'),
    children: [
      r('bridge-jitsi', 'jitsi', 'Bridge/Jitsi'),
      r('bridge-google-maps', 'google-maps', 'Bridge/GoogleMaps'),
    ],
  },

  // we're stuck with ol'school dev-auth view (no bootstrap)
  { path: '/auth', name: 'auth', component: components.CDevAuthLite },

  r('default', '*', 'NoApp'),
]
