// An uglyhack to get gmaps working
// this plugin does not allow us to pass key inside the component
//
// Since we load gmaps bridge inside an iframe anyway, let's pass
// the key as GET param (location.search).

import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

if (window.location.pathname.indexOf('/bridge/google-maps') === 0) {
  const qs = window.location.search
  if (qs.length < 30) {
    console.error('Expecting a valid Google Maps API key in query-string: /bridge/google-maps?{api-key}', { qs })
  } else {
    Vue.use(VueGoogleMaps, {
      load: {
        key: qs.substring(1),
        libraries: 'places', // necessary for places input
      },
    })
  }
}
