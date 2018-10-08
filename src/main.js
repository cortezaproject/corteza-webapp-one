import Vue from 'vue'
import Index from './views/Index.vue'
import router from './router'
import Vuex from 'vuex'
// lodash used in tab actions
import _ from 'lodash'

import './global'
import './main.scss'

// load vuex
Vue.use(Vuex)
// create the store
const store = new Vuex.Store({
  state: {
    // all the panels used in the interface
    user: null,
    // demo version : 1 pane, 1 tab, messaging
    // for full specs see below.
    panes:
    {
      disposition:
      {
        type: 'rowfirst',
        itempos: [ [ 0 ] ],
      },
      nextTabId: 1,
      items:
      [
        {
          active: 0,
          showapps: false,
          tabs:
          [
            {
              id: 0,
              title: 'Messaging',
              // src: 'https://www.example.com/',
              src: 'https://latest.rustbucket.io/messaging/',
            },
          ],
        },
      ],
    },
    // This would be the default case :
    // no panels to start with.
    // for demo purpose we use the previous version
    /*
    panes:
    {
      // disposition : null / array
      // how panes are setup
      // null means no panes
      // otherwise it would be a 2 dimensionnal array,
      // first split is vertical if type:colfirst
      // first split is horizontal if type:rowfirst
      // single vue should be :
      // itempos: [ [ 0 ] ],
      // sample vue : itempos: [ [ 0, 1 ], [ 2 ] ],
      disposition: null,

      // nextTabId : int
      // the next id for a tab, will be incremented by 1
      // TabIds should be unique accross the whole structure.
      nextTabId: 0,

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
      items: [],
    },
    /* */
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
  },
  mutations: {
    connectUser: (e, userInfo) => {
      store.state.user = {
        id: '01234567891',
        has_notifications: false,
        username: 'BetaUser',
        avatar: 'data:image/png;base64,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',
      }
    },
    updateTabs: (e, newTabs) => {
      var newTabIs = _.difference(newTabs.tabs, store.state.panes.items[newTabs.paneId].tabs)
      console.log(newTabIs)
      store.state.panes.items[newTabs.paneId].tabs = newTabs.tabs
      if (0 !== newTabIs.length)
      {
        store.state.panes.items[newTabs.paneId].active = newTabIs[0].id
      }
    },
    setFirstTabActive: (e, pane) =>
    {
      store.state.panes.items[pane.paneId].active = store.state.panes.items[pane.paneId].tabs[0].id
    },
    removeTab: (e, tabToDel) => {
      console.log('removing tab')
      console.log(tabToDel)
      var itemIndexToDel = null
      var tabItems = store.state.panes.items[tabToDel.pane].tabs
      console.log('active')
      console.log(store.state.panes.items[tabToDel.pane].active)
      // if this is the last tab, remove the panel
      if (tabItems.length === 1)
      {
        // remove panel
        store.state.panes.items.splice(tabToDel.pane, 1)
        // and in the future we should reorganize if necessary.
      }
      // else remove the tab
      else
      {
        for (var itemIndex = 0; itemIndex < tabItems.length; itemIndex++)
        {
          if (tabItems[itemIndex].id === tabToDel.id)
          {
            itemIndexToDel = itemIndex
          }
        }
        if (null !== itemIndexToDel)
        {
          // if the deleted tab is the active...
          if (store.state.panes.items[tabToDel.pane].active === tabToDel.id)
          {
            // activate the tab before the one we deleted if it exists,
            if ('undefined' !== typeof tabItems[itemIndexToDel - 1])
            {
              store.state.panes.items[tabToDel.pane].active = tabItems[itemIndexToDel - 1].id
            }
            // the one after otherwise.
            else
            {
              store.state.panes.items[tabToDel.pane].active = tabItems[itemIndexToDel + 1].id
            }
          }
          // and delete current tab
          store.state.panes.items[tabToDel.pane].tabs.splice(itemIndexToDel, 1)
        }
      }
    },
    changeActive: (e, newActiveTab) => {
      store.state.panes.items[newActiveTab.pane].active = newActiveTab.id
    },
    addApp: (e, appData) => {
      var sspanes = store.state.panes
      var paneId = appData.paneId
      if (sspanes.items.length === 0)
      {
        sspanes.disposition = {
          type: 'rowfirst',
          itempos: [ [ 0 ] ],
        }
        sspanes.items = [
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
      sspanes.items[paneId].tabs.push({
        id: sspanes.nextTabId,
        title: appData.app.name,
        src: appData.app.path,
      })
      sspanes.items[paneId].showapps = false
      sspanes.items[paneId].active = sspanes.nextTabId
      sspanes.nextTabId++
      /*
      console.log('Vuex adding app')
      console.log(appData)
      var inPane = null
      var newPane = {
        active: store.state.panes.nextTabId,
        showapps: false,
        tabs: [],
      }
      newPane.tabs.push({
        id: store.state.panes.nextTabId,
        title: appData.name,
        src: appData.path,
      })
      inPane = 0
      store.state.panes.items[inPane] = newPane
      store.state.panes.disposition = [[inPane]]
      store.state.panes.nextTabId++
      console.log(store.state.panes)
      */
    /*
     store.state.panes = {
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
    },
  },
})

// implement a Vue with store and router
new Vue({
  router,
  store,
  render: h => h(Index),
}).$mount('#app')
