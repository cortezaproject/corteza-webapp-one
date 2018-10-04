import Vue from 'vue'
import Vuex from 'vuex'
import Index from './views/Index.vue'
import router from './router'
import _ from 'lodash'

import './global'
import './main.scss'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    // all the panels used in the interface
    panes:
    {
      // how panels are positionnned
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
        // TabIds should be unique accross the whole structure.
      },
      // items
      items:
      [
        {
          active: 1,
          showapps: false,
          nextTabId: 11,
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
              title: 'Chat',
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
  },
  mutations: {
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
    changeActive: (e, newActiveTab) => {
      store.state.panes.items[newActiveTab.pane].active = newActiveTab.id
    },
  },
})

// implement a Vue with store and router
new Vue({
  router,
  store,
  render: h => h(Index),
}).$mount('#app')
