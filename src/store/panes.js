import Vue from 'vue'
import Vuex from 'vuex'
// lodash used in tab actions
import _ from 'lodash'

// init vuex
Vue.use(Vuex)

// defines the current status of the different panes of the workspace
// initial state and default value
const state = {
  // demo version : 4 panes
  // for full specs see below.
  nextTabId: 3,
  maxNumberOfTabsInPanel: 8,
  nowResizing: false,
  activeMobileTab: 0,
  mobileShowApps: false,

  disposition:
    {
      type: 'rowfirst',
      itempos: [ [ 0 ], [ ] ],
    },
  items:
    [
      {
        active: 0,
        showapps: false,
        tabs:
          [
            {
              id: 0,
              title: 'Temp1',
              src: '/messaging/',
              logo: require('@/assets/logos/crust.jpg'),
            },
          ],
      },
      /*{
        active: 1,
        showapps: false,
        tabs:
          [
            {
              id: 1,
              title: 'Temp2',
              src: 'https://www.example.com/',
              logo: '/img/jira.c6266a81.png',
            },
          ],
      },
      {
        active: 2,
        showapps: false,
        tabs:
          [
            {
              id: 2,
              title: 'Temp3',
              src: 'https://www.example.com/',
              logo: '/img/jira.c6266a81.png',
            },
          ],
      },*/
    ],

  /*
  disposition:
  {
    type: 'rowfirst',
    itempos: [ [ 0, 1 ], [ 2, 3 ] ],
  },
  items:
  [
    {
      active: 0,
      showapps: false,
      tabs:
      [
        {
          id: 0,
          title: 'Temp1',
          src: 'https://www.example.com/',
        },
      ],
    },
    {
      active: 1,
      showapps: false,
      tabs:
      [
        {
          id: 1,
          title: 'Temp2',
          src: 'https://www.example.com/',
        },
      ],
    },
    {
      active: 2,
      showapps: false,
      tabs:
      [
        {
          id: 2,
          title: 'Temp3',
          src: 'https://www.example.com/',
        },
      ],
    },
    {
      active: 3,
      showapps: false,
      tabs:
      [
        {
          id: 3,
          title: 'Temp4',
          src: 'https://www.example.com/',
        },
      ],
    },
  ],
  */
  /* items:
  [
    {
      active: 0,
      showapps: false,
      tabs:
      [
        {
          id: 0,
          title: 'Messaging',
          src: 'https://beta.rustbucket.io/messaging/',
        },
      ],
    },
    {
      active: 1,
      showapps: false,
      tabs:
      [
        {
          id: 1,
          title: 'Temp4',
          src: 'https://www.example.com/',
        },
        {
          id: 2,
          title: 'Temp5',
          src: 'https://www.example.com/',
        },
        {
          id: 3,
          title: 'Temp6',
          src: 'https://www.example.com/',
        },
      ],
    },
    {
      active: 0,
      showapps: true,
      tabs:
      [
      ],
    },
    {
      active: 0,
      showapps: false,
      tabs:
      [
      ],
    },
  ], */
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
    //         src: 'https://latest.rustbucket.io/messaging/',
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
    console.log(newTabIs)
    state.items[newTabs.paneId].tabs = newTabs.tabs
    if (newTabIs.length !== 0) {
      state.items[newTabs.paneId].active = newTabIs[0].id
    }
  },
  setFirstTabActive: (state, pane) => {
    state.items[pane.paneId].active = state.items[pane.paneId].tabs[0].id
  },
  removeTab: (state, tabID) => {
    console.log('removing tab = ' + tabID)
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
    console.log('active')
    console.log(pane.active)
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
    if (state.items.length === 0) {
      state.disposition = {
        type: 'rowfirst',
        itempos: [ [ 0 ] ],
      }
      state.items = [
        {
          active: 0,
          tabs: [],
          showapps: false,
        },
      ]
      // current pane is the one we just created
      paneId = 0
    }
    // add tab to the current pane
    state.items[paneId].tabs.push({
      id: state.nextTabId,
      title: appData.app.name,
      src: appData.app.path,
      logo: appData.app.logo,
    })
    state.items[paneId].showapps = false
    state.mobileShowApps = false
    state.items[paneId].active = state.nextTabId
    state.activeMobileTab = state.nextTabId
    state.nextTabId++
  },
  changeDisposition (state, payload) {
    let maxPane = 0
    payload.forEach(levelOne => {
      levelOne.forEach(levelTwo => {
        if (levelTwo > maxPane) maxPane = levelTwo
      })
    })
    while (maxPane >= state.items.length) {
      // create the missing panel(s)
      state.items.push({
        active: null,
        showapps: false,
        tabs: [],
      })
    }
    state.disposition.itempos = payload
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

/*
console.log('Vuex adding app')
console.log(appData)
var inPane = null
var newPane = {
active: state.nextTabId,
showapps: false,
tabs: [],
}
newPane.tabs.push({
id: state.nextTabId,
title: appData.name,
src: appData.path,
})
inPane = 0
state.items[inPane] = newPane
state.disposition = [[inPane]]
state.nextTabId++
console.log(state)
*/
/*
state = {
disposition:
{
type: 'rowfirst',
nextTabId: 1,
itempos: [ [ 0 ] ],
},
items:
[
{
  active: 0,
  showapps: false,
  tabs:
  [
    {
      id: 0,
      title: appData.name,
      src: appData.path,
      // src: 'https://www.blogdumoderateur.com/',
    },
  ]
},
],
}
*/

// all the panels used in the interface
/*
panes:
{
disposition:
{
type: 'rowfirst',
nextTabId: 1,
itempos: [ [ 0 ] ],
},
items:
[
{
  active: 0,
  showapps: false,
  tabs:
  [
    {
      id: 0,
      title: 'BDM',
      src: 'https://www.example.com/',
      // src: 'https://www.blogdumoderateur.com/',
    },
  ]
},
],
},
*/
/* sample test panes
panes:
{
disposition:
{
type: 'rowfirst',
// 2 dimensionnal array,
// first split is vertical if type:colfirst
// first split is horizontal if type:rowfirst
// itempos: [ [ 0, 1 ], [ 2 ] ],
itempos: [ [ 0, 1 ], [ 2 ] ],
// single vue should be :
// itempos: [ [ 0 ] ],
},
// items
items:
[
{
  active: 1,
  showapps: false,
  tabs:
  [
    {
      id: 0,
      title: 'BDM',
      src: 'https://www.example.com/',
      // src: 'https://www.blogdumoderateur.com/',
    },
    {
      id: 1,
      title: 'Neuromancer',
      // src: 'https://www.example.com/',
      src: 'https://www.youtube.com/embed/2bjyw1Swr9A',
    },
    {
      id: 2,
      title: 'Holidays',
      // src: 'https://www.example.com/',
      src: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d5548694.956216767!2d1.9195935488340492!3d47.2298136496854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x476531f5969886d1%3A0x400f81c823fec20!2sLjubljana%2C+Slovenia!3m2!1d46.056946499999995!2d14.505751499999999!4m5!1s0x480ede2fa7d69085%3A0x40ca5cd36e4ab30!2sRennes!3m2!1d48.117266!2d-1.6777925999999999!5e0!3m2!1sen!2sfr!4v1537822098803',
    },
  ],
},
{
  active: 5,
  showapps: false,
  tabs:
  [
    {
      id: 5,
      title: 'Phone',
      // src: 'https://www.example.com/',
      src: 'https://appear.in/crust',
    },
    {
      id: 6,
      title: 'Messaging',
      // src: 'https://www.example.com/',
      src: 'https://latest.rustbucket.io/messaging/',
    },
  ],
},
{
  active: 7,
  showapps: false,
  tabs:
  [
    {
      id: 7,
      title: 'Example 1',
      src: 'https://www.example.com/',
    },
    {
      id: 8,
      title: 'Example 2',
      src: 'https://www.example.com/',
    },
    {
      id: 9,
      title: 'BDM2',
      src: 'https://www.blogdumoderateur.com/',
    },
  ],
},
],
},
/* */
