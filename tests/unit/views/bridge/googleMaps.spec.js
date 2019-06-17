import { expect } from 'chai'
import { mount } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import GoogleMaps from '@/views/Bridge/GoogleMaps'

let localVue = createLocalVue()
let wrapper

describe('views/Bridge/GoogleMaps.vue', () => {
  let mocks = { $t: (t) => t }
  let common = { localVue, mocks, stubs: [ 'gmap-autocomplete', 'gmap-map', 'gmap-marker' ] }

  describe('methods', () => {
    it('setPlace', () => {
      let place = { id: 'pid' }
      wrapper = mount(GoogleMaps, { ...common })

      expect(wrapper.vm.currentPlace).to.eq(null)
      wrapper.vm.setPlace(place)
      expect(wrapper.vm.currentPlace).to.deep.eq(place)
    })

    describe('addMarker', () => {
      it('currentPlace.defined', () => {
        let currentPlace = {
          geometry: { location: { lat: () => 'lat', lng: () => 'lng' } },
        }
        wrapper = mount(GoogleMaps, { ...common })
        wrapper.setData({ currentPlace })

        expect(wrapper.vm.currentPlace).to.not.eq(null)
        expect(wrapper.vm.markers).to.have.length(0)
        expect(wrapper.vm.places).to.have.length(0)

        wrapper.vm.addMarker()
        expect(wrapper.vm.currentPlace).to.eq(null)
        expect(wrapper.vm.markers).to.have.length(1)
        expect(wrapper.vm.markers).to.deep.eq([ { position: { lat: 'lat', lng: 'lng' } } ])
        expect(wrapper.vm.places).to.have.length(1)
        expect(wrapper.vm.places).to.deep.eq([ currentPlace ])
      })

      it('currentPlace.undefined', () => {
        wrapper = mount(GoogleMaps, { ...common })

        expect(wrapper.vm.currentPlace).to.eq(null)
        expect(wrapper.vm.markers).to.have.length(0)
        expect(wrapper.vm.places).to.have.length(0)

        wrapper.vm.addMarker()
        expect(wrapper.vm.currentPlace).to.eq(null)
        expect(wrapper.vm.markers).to.have.length(0)
        expect(wrapper.vm.places).to.have.length(0)
      })
    })

    it('geolocate')
  })
})
