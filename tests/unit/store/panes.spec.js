import { expect } from 'chai'
import panes from '@/store/panes'

describe('store/panes.js', () => {
  describe('mutations', () => {
    let state

    describe('updateTabs', () => {
      beforeEach(() => {
        state = {
          items: [{ visible: true, active: 0, showapps: false, tabs: [] }],
        }
      })

      it('newTabs.add', () => {
        // First added
        let newTabs = { paneId: 0, tabs: [{ id: 't1' }] }
        panes.mutations.updateTabs(state, newTabs)
        expect(state.items[0].tabs).to.deep.eq([{ id: 't1' }])
        expect(state.items[0].active).to.eq('t1')

        // second added
        newTabs = { paneId: 0, tabs: [{ id: 't1' }, { id: 't2' }] }
        panes.mutations.updateTabs(state, newTabs)
        expect(state.items[0].tabs).to.deep.eq([{ id: 't1' }, { id: 't2' }])
        expect(state.items[0].active).to.eq('t2')

        // same added
        newTabs = { paneId: 0, tabs: [{ id: 't1' }, { id: 't2' }] }
        panes.mutations.updateTabs(state, newTabs)
        expect(state.items[0].tabs).to.deep.eq([{ id: 't1' }, { id: 't2' }])
        // t2 kept from before
        expect(state.items[0].active).to.eq('t2')

        // multiple added
        newTabs = { paneId: 0, tabs: [{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }] }
        panes.mutations.updateTabs(state, newTabs)
        expect(state.items[0].tabs).to.deep.eq([{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }])
        // t3 -- first changed
        expect(state.items[0].active).to.eq('t3')
      })

      it('newTabs.remove', () => {
        state.items[0].tabs = [{ id: 't1' }, { id: 't2' }, { id: 't3' }, { id: 't4' }]

        // one removed
        let newTabs = { paneId: 0, tabs: [{ id: 't1' }, { id: 't2' }, { id: 't3' }] }
        panes.mutations.updateTabs(state, newTabs)
        expect(state.items[0].tabs).to.deep.eq([{ id: 't1' }, { id: 't2' }, { id: 't3' }])

        // same removed
        newTabs = { paneId: 0, tabs: [{ id: 't1' }, { id: 't2' }, { id: 't3' }] }
        panes.mutations.updateTabs(state, newTabs)
        expect(state.items[0].tabs).to.deep.eq([{ id: 't1' }, { id: 't2' }, { id: 't3' }])

        // all removed
        newTabs = { paneId: 0, tabs: [] }
        panes.mutations.updateTabs(state, newTabs)
        expect(state.items[0].tabs).to.deep.eq([])
      })
    })

    it('setFirstTabActive', () => {
      // No tab
      state = { items: [ { visible: true, active: 0, showapps: false, tabs: [] } ] }
      let pane = { paneId: 0 }
      panes.mutations.setFirstTabActive(state, pane)
      expect(state.items[0].active).to.eq(undefined)

      // one tab
      state = { items: [ { visible: true, active: 0, showapps: false, tabs: [{ id: 't1' }] } ] }
      pane = { paneId: 0 }
      panes.mutations.setFirstTabActive(state, pane)
      expect(state.items[0].active).to.eq('t1')

      // n tabs
      state = { items: [ { visible: true, active: 0, showapps: false, tabs: [{ id: 't3' }, { id: 't1' }, { id: 't2' }] } ] }
      pane = { paneId: 0 }
      panes.mutations.setFirstTabActive(state, pane)
      // @note above tabs not ordered; t3, t1, t2
      expect(state.items[0].active).to.eq('t3')
    })

    it('removeTab')
    it('changeActive')

    it('changeActiveMobile', () => {
      state = { activeMobileTab: undefined }
      panes.mutations.changeActiveMobile(state, 0)
      expect(state.activeMobileTab).to.eq(0)

      panes.mutations.changeActiveMobile(state, 5)
      expect(state.activeMobileTab).to.eq(5)
    })

    it('addApp', () => {
      state = { mobileShowApps: true, activeMobileTab: undefined, nextTabId: 1, items: [ { visible: true, active: 0, showapps: true, tabs: [] } ] }
      let appData = { paneId: 0, app: { name: 'name', url: 'url', logo: 'logo', icon: 'icon' } }
      panes.mutations.addApp(state, appData)

      expect(state.items[0].tabs).to.deep.eq([{ id: 1, title: 'name', src: 'url', logo: 'logo', icon: 'icon' }])
      expect(state.items[0].showapps).to.eq(false)
      expect(state.items[0].active).to.eq(1)
      expect(state.mobileShowApps).to.eq(false)
      expect(state.activeMobileTab).to.eq(1)
      expect(state.nextTabId).to.eq(2)
    })

    it('togglePanel', () => {
      state = { items: [ { visible: true } ] }
      panes.mutations.togglePanel(state, 0)
      expect(state.items[0].visible).to.eq(false)

      panes.mutations.togglePanel(state, 0)
      expect(state.items[0].visible).to.eq(true)
    })

    it('setResizing', () => {
      state = { nowResizing: false }
      panes.mutations.setResizing(state, false)
      expect(state.nowResizing).to.eq(false)

      panes.mutations.setResizing(state, true)
      expect(state.nowResizing).to.eq(true)

      panes.mutations.setResizing(state, false)
      expect(state.nowResizing).to.eq(false)
    })
  })
})
