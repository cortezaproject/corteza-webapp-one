import { expect, assert } from 'chai'
import { mount } from 'crust-common.vue/src/lib/testHelpers'
import { createLocalVue } from '@vue/test-utils'
import Header from '@/components/Header'
import sinon from 'sinon'

let localVue = createLocalVue()
let wrapper

describe('components/Header.vue', () => {
  let $store = { state: { panes: { items: [] } } }
  let mocks = { $t: (t) => t, $store }
  let common = { localVue, mocks, propsData: { user: {} } }

  describe('computed', () => {
    it('allTabs', () => {
      let local = { $store: { state: { panes: { items: [] } } } }
      expect(Header.computed.allTabs.call(local)).to.deep.eq([])

      local = { $store: { state: { panes: { items: [{ tabs: [{}, {}] }, {}] } } } }
      expect(Header.computed.allTabs.call(local)).to.deep.eq([{}, {}])
    })

    it('activeTab', () => {
      let local = { allTabs: [{ id: 'id1' }], $store: { state: { panes: { activeMobileTab: undefined } } } }
      expect(Header.computed.activeTab.call(local)).to.eq(undefined)

      local = { allTabs: [{ id: 'id1' }], $store: { state: { panes: { activeMobileTab: 'id2' } } } }
      expect(Header.computed.activeTab.call(local)).to.eq(undefined)

      local = { allTabs: [{ id: 'id1' }], $store: { state: { panes: { activeMobileTab: 'id1' } } } }
      expect(Header.computed.activeTab.call(local)).to.deep.eq({ id: 'id1' })
    })

    it('rowFirst', () => {
      let local = { $store: { state: { panes: { disposition: 'rowfirst' } } } }
      expect(Header.computed.rowFirst.call(local)).to.eq(true)

      local = { $store: { state: { panes: { disposition: 'notrowfirst' } } } }
      expect(Header.computed.rowFirst.call(local)).to.eq(false)
    })

    it('panels', () => {
      let local = { $store: { state: { panes: { items: [{}, {}, {}] } } } }
      expect(Header.computed.panels.call(local)).to.deep.eq([{}, {}, {}])
    })
  })

  describe('created', () => {
    it('events.on')
  })

  describe('beforeDestroy', () => {
    it('events.off')
  })

  describe('methods', () => {
    it('onCloseMobile', () => {
      wrapper = mount(Header, common)
      expect(wrapper.vm.mobileMenuOpen).to.eq(false)
      wrapper.vm.onCloseMobile()
      expect(wrapper.vm.mobileMenuOpen).to.eq(false)

      wrapper.setData({ mobileMenuOpen: true })
      wrapper.vm.onCloseMobile()
      expect(wrapper.vm.mobileMenuOpen).to.eq(false)
    })

    it('updPanels', () => {
      let commit = sinon.fake()
      let pane = { visible: false, tabs: [] }
      let panels = [pane, { visible: false, tabs: [] }, { visible: false, tabs: [] }, { visible: false, tabs: [] }]
      let evt = { target: { value: '0' } }

      wrapper = mount(Header, { ...common, data: () => ({ optionsMenuOpen: true }), mocks: { ...mocks, $store: { ...$store, commit } }, computed: { panels: () => panels } })
      wrapper.vm.updPanels(evt)
      assert(commit.calledOnceWith('panes/togglePanel', 0))
      expect(wrapper.vm.optionsMenuOpen).to.eq(true)
      expect(pane.showapps).to.eq(undefined)

      wrapper = mount(Header, { ...common, data: () => ({ optionsMenuOpen: true }), mocks: { ...mocks, $store: { ...$store, commit } }, computed: { panels: () => panels } })
      commit.resetHistory()
      pane.visible = true
      wrapper.vm.updPanels(evt)
      assert(commit.calledOnceWith('panes/togglePanel', 0))
      expect(wrapper.vm.optionsMenuOpen).to.eq(false)
      expect(pane.showapps).to.eq(true)

      wrapper = mount(Header, { ...common, data: () => ({ optionsMenuOpen: true }), mocks: { ...mocks, $store: { ...$store, commit } }, computed: { panels: () => panels } })
      commit.resetHistory()
      pane.visible = true
      pane.showapps = false
      pane.tabs = [{}]
      wrapper.vm.updPanels(evt)
      assert(commit.calledOnceWith('panes/togglePanel', 0))
      expect(wrapper.vm.optionsMenuOpen).to.eq(false)
      expect(pane.showapps).to.eq(false)
    })

    it('clickMenuMobile', () => {
      wrapper = mount(Header, common)
      expect(wrapper.vm.mobileMenuOpen).to.eq(false)

      wrapper.vm.clickMenuMobile()
      expect(wrapper.vm.mobileMenuOpen).to.eq(true)

      wrapper.vm.clickMenuMobile()
      expect(wrapper.vm.mobileMenuOpen).to.eq(false)
    })
  })
})
