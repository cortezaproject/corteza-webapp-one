import Vue from 'vue'
import Vuex from 'vuex'
// lodash used in tab actions
import _ from 'lodash'

// init vuex
Vue.use(Vuex)

// defines the current status of the different panes of the workspace
// initial state and default value
// Important:
// itempos must can only have the values 0 and 1 in the first array and 2 and 3 in the second array,
// and both array must always be present.
// items must always be an array of 4 items (the position is mapped to the numbers in itempos)
const state = {
  // for full specs see below.
  nextTabId: 1,
  maxNumberOfTabsInPanel: 8,
  nowResizing: false,
  activeMobileTab: 0,
  mobileShowApps: false,

  disposition: 'colfirst',
  items:
    [
      {
        visible: true,
        active: 0,
        showapps: false,
        tabs:
          [
            {
              id: 0,
              title: 'Messaging',
              src: '/messaging/',
              logo: '/applications/crust.jpg',
              icon: '/applications/crust_favicon.png',
            },
          ],
      },
      {
        visible: false,
        active: null,
        showapps: false,
        tabs: [],
      },
      {
        visible: false,
        active: null,
        showapps: false,
        tabs: [],
      },
      {
        visible: false,
        active: null,
        showapps: false,
        tabs: [],
      },
    ],
}

// Below would be the default case : no panels to start with.
// we could load or have the adminitrator initialise it
/*
const state = {
    // nextTabId : int
    // the next id for a tab, will be incremented by 1
    // TabIds should be unique accross the whole structure.
    nextTabId: 0,

    //maxNumberOfTabsInPanel: int
    //Maximum number of tabs per panel. The minimal number is 0.
    //There is no maximal number, but if we want to give an experience
    //of unlimited tabs we can use the number 99999

    // disposition : null / struct
    // how panes are setup
    // null means no panes
    // otherwise struct should have 2 values :
    // . type: string,
    //   first split is vertical if type:colfirst
    //   first split is horizontal if type:rowfirst
    // . itempos: array of array,
    //   2 dimensionnal array, specifying where panes are to be put
    //   single vue should be :
    //   disposition :
    //   {
    //     type: rowfirst,
    //     itempos: [ [ 0 ] ],
    //   }
    //   sample vue left col 2 panes, right 1 pane :
    //   disposition :
    //   {
    //     type: colfirst,
    //     itempos: [ [ 0, 1 ], [ 2 ] ],
    //   }

    // items : array
    // on array entry per pane item
    // each pane is :
    // - active : integer
    //   id of the active tab in the pane.
    // - showapps :
    //   boolean show or not the apps available in the context
    // - tabs: array of objects
    //   each tab is (for now)
    //   . id : integrer
    //     id of the tab, unique accross the structure
    //   . title : string
    //     label of the tab
    //   . src : string (url)
    //     url to load in the iframe.
    // sample items struct with 1 item :
    // items:
    // [
    //   {
    //     active: 0,
    //     showapps: false,
    //     tabs:
    //     [
    //       {
    //         id: 0,
    //         title: 'Messaging',
    //         // src: 'https://www.example.com/',
    //         src: '/messaging/',
    //       },
    //     ],
    //   },
    // ],
    items: [],
  },
};
/* */

const mutations =
{
  updateTabs: (state, newTabs) => {
    var newTabIs = _.difference(newTabs.tabs, state.items[newTabs.paneId].tabs)
    state.items[newTabs.paneId].tabs = newTabs.tabs
    if (newTabIs.length !== 0) {
      state.items[newTabs.paneId].active = newTabIs[0].id
    }
  },
  setFirstTabActive: (state, pane) => {
    state.items[pane.paneId].active = state.items[pane.paneId].tabs[0].id
  },
  removeTab: (state, tabID) => {
    let pane, itemIndexToDel, tabItems
    state.items.every(curPanel => {
      itemIndexToDel = curPanel.tabs.findIndex(item => item.id === tabID)
      if (itemIndexToDel !== -1) {
        pane = curPanel
        tabItems = pane.tabs
        return false
      }
      return true
    })
    if (itemIndexToDel !== -1) {
      const allTabs = state.items.reduce((acc, panel) => {
        return acc.concat(panel.tabs)
      }, [])
      const itemIndex = allTabs.findIndex(item => item.id === tabID)
      // delete current tab
      tabItems.splice(itemIndexToDel, 1)
      // if the deleted tab is the active...
      if (pane.active === tabID) {
        const len = tabItems.length
        if (itemIndexToDel < len) pane.active = tabItems[itemIndexToDel].id
        else {
          if (len) pane.active = tabItems[len - 1].id
          else pane.active = null
        }
      }
      if (pane.active) state.activeMobileTab = pane.active
      else {
        if (itemIndex) state.activeMobileTab = allTabs[itemIndex - 1].id
        else if (allTabs.length > 1) state.activeMobileTab = allTabs[itemIndex + 1].id
        else state.activeMobileTab = null
      }
      if (tabItems.length === 0) {
        // hide the panel - no more tabs
        pane.visible = false
      }
    }
  },
  changeActive: (state, tabID) => {
    let pane, tabIndex
    state.items.every(curPanel => {
      tabIndex = curPanel.tabs.findIndex(item => item.id === tabID)
      if (tabIndex !== -1) {
        pane = curPanel
        return false
      }
      return true
    })
    pane.active = tabID
  },
  changeActiveMobile (state, tabID) {
    state.activeMobileTab = tabID
  },
  addApp: (state, appData) => {
    var paneId = appData.paneId
    // add tab to the current pane
    state.items[paneId].tabs.push({
      id: state.nextTabId,
      title: appData.app.name,
      src: appData.app.url,
      logo: appData.app.logo,
      icon: appData.app.icon,
    })
    state.items[paneId].showapps = false
    state.mobileShowApps = false
    state.items[paneId].active = state.nextTabId
    state.activeMobileTab = state.nextTabId
    state.nextTabId++
  },
  togglePanel (state, paneID) {
    state.items[paneID].visible = !state.items[paneID].visible
  },
  setResizing (state, resizing) {
    state.nowResizing = resizing
  },
}

// export created elements
export default {
  namespaced: true,
  state,
  mutations,
}
