<template>
  <div ref="layout" class="layout" :class="{'layout-rowfirst': panes.disposition.type === 'rowfirst', 'layout-colfirst': panes.disposition.type === 'colfirst'}">
    <div v-for="(levelOne,index) in panes.disposition.itempos" :key="index"
         :class="{'layout-colfirst': panes.disposition.type === 'rowfirst',
         'layout-rowfirst': panes.disposition.type === 'colfirst',
         'layout-autosized': index ? [2,3,5,7,8].includes(typeLayout) : [4,6].includes(typeLayout) }">
      <component v-for="(levelTwo,index_2) in levelOne" :key="index_2" :is="shouldResize(index,index_2) ? 'VueResize' : 'NormalPanel'"
                 :class="{'static-panel-container': !shouldResize(index,index_2)}" :style="adjustWidth(index,index_2)"
                 :width="width" :height="height" :sticks="sticks" @resize="onResize" @stopresize="onStopResize">
        <TabBar
          :pane_id="levelTwo"
          :tabs="panes.items[levelTwo].tabs"
          :active_tab="panes.items[levelTwo].active"
          :showapps="false"
          @add="tryAddTab(levelTwo)" />
        <PaneContent
          :pane_id="levelTwo"
          :tabs="panes.items[levelTwo].tabs"
          :active_tab="panes.items[levelTwo].active"
          class="pane-content" />
        <app-selector
          :class="'app-selector-' + levelTwo"
          :paneId="levelTwo"
          :displayed="panes.items[levelTwo].showapps"
          @add-app="addTab"
          @close="panes.items[levelTwo].showapps=false"></app-selector>
      </component>
    </div>
    <modal v-if="cantAddTab" @close="cantAddTab = false">
      <h3 slot="header">Warning</h3>
      <div class="cant-add-tab">You cannot add more tabs to this panel</div>
    </modal>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar.vue'
import PaneContent from '@/components/PaneContent.vue'
import AppSelector from '@/components/AppSelector.vue'
import Modal from '@/components/Modal'
import VueResize from '@/components/VueResize.vue'
import NormalPanel from '@/components/NormalPanel'
/*
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
*/
export default
{
  name: 'Layout',
  components:
  {
    TabBar,
    PaneContent,
    AppSelector,
    Modal,
    VueResize,
    NormalPanel,
  },
  data () {
    return {
      cantAddTab: false,
      width: 500,
      height: 500,
    }
  },
  // on create init pane data in store
  created: function () {
    console.log('created')
  },
  computed:
  {
    panes: {
      get () {
        console.log('layout getting panes')
        return this.$store.state.panes
      },
      /*
      set (tabs) {
        this.$store.commit('panes/updateTabs', tabs);
      }
      */
    },
    itempos () {
      return this.panes.disposition.itempos
    },
    typeLayout () {
      // 0 = no panels
      // 1 = 1 panel
      // 2 = 2 rows by 1 panel
      // 3 = 2 cols by 1 panel
      // 4 = 2 rows (1 top, 2 bottom)
      // 5 = 2 rows (2 top, 1 bottom)
      // 6 = 2 cols (1 left, 2 right)
      // 7 = 2 cols (2 left, 1 right)
      // 8 = 4 panels
      const kind = this.panes.disposition.type
      const layout = this.panes.disposition.itempos
      switch (layout.length) {
        default: return 0
        case 1:
          switch (layout[0].length) {
            default: return 0
            case 1: return 1
            case 2: return kind === 'rowfirst' ? 2 : 3
          }
        case 2:
          switch (layout[0].length) {
            default:
              switch (layout[1].length) {
                default: return 0
                case 1: return 1
                case 2: return kind === 'rowfirst' ? 2 : 3
              }
            case 1:
              switch (layout[1].length) {
                default: return 1
                case 1: return kind === 'rowfirst' ? 2 : 3
                case 2: return kind === 'rowfirst' ? 4 : 6
              }
            case 2:
              switch (layout[1].length) {
                default: return kind === 'rowfirst' ? 2 : 3
                case 1: return kind === 'rowfirst' ? 5 : 7
                case 2: return 8
              }
          }
      }
    },
    sticks () {
      switch (this.typeLayout) {
        case 0:
        case 1: return ''
        case 2: return 'bm'
        case 3: return 'mr'
        case 4: return 'tr'
        case 5: return 'br'
        case 6: return 'bl'
        case 7: return 'br'
        case 8: return 'br'
      }
    },
  },
  watch:
    {
      'itempos': 'computeSize',
    },
  mounted () {
    this.computeSize()
  },
  methods:
  {
    addTab (appData) {
      console.log('Adding a app from layout')
      console.log(appData)
      this.$store.commit('panes/addApp', appData)
    },
    tryAddTab (paneID) {
      const maxNum = this.panes.maxNumberOfTabsInPanel
      const pane = this.panes.items[paneID]
      if (pane.tabs.length < maxNum) pane.showapps = true
      else this.cantAddTab = true
    },
    onResize (rect) {
      // in order to sync the width of the 1st panel on the 2nd row
      this.width = rect.width
      this.height = rect.height
    },
    onStopResize () {
      // otherwise the stick can go outside of the screen (because of the specific layout - markup + styling)
      let rect = this.$refs.layout.getBoundingClientRect()
      if (this.width > rect.width) this.width = rect.width
      if (this.height > rect.height) this.height = rect.height
    },
    adjustWidth (idx, idx2) {
      switch (this.typeLayout) {
        case 2:
        case 3:
        case 5:
        case 7: return idx === 0 && idx2 === 0 ? {} : { flex: '1 1 0' }
        case 4:
        case 6: return idx > 0 && idx2 === 0 ? {} : { flex: '1 1 0' }
        case 8: return idx > 0 && idx2 === 0 ? { flex: '0 0 ' + this.width + 'px' } : {}
        default: return { flex: '1 1 0' }
      }
    },
    shouldResize (idx, idx2) {
      switch (this.typeLayout) {
        case 2:
        case 3:
        case 5:
        case 7:
        case 8: return idx === 0 && idx2 === 0
        case 4:
        case 6: return idx > 0 && idx2 === 0
        default: return false
      }
    },
    computeSize () {
      let rect = this.$refs.layout.getBoundingClientRect()
      switch (this.typeLayout) {
        case 2: // 2 rows by 1 panel
          this.width = rect.width
          this.height = rect.height / 2
          break
        case 3: // 2 cols by 1 panel
          this.width = rect.width / 2
          this.height = rect.height
          break
        default:
          this.width = rect.width / 2
          this.height = rect.height / 2
      }
    },
  },
}
</script>

<!-- don't scope this ! -->
<style lang="scss">
  @import '@/assets/sass/_0.declare.scss';

  .layout
  {
    font-size: 10px;
    position: absolute;
    top: 6em;
    height: calc(100vh - 6em);
    max-height: calc(100vh - 6em);
    width: 100vw;
    overflow: hidden;
    background-color: #FEFEFE;
  }

  .layout-colfirst
  {
    display: flex;
    flex-direction: row;
  }

  .layout-rowfirst
  {
    display: flex;
    flex-direction: column;
  }

  .layout-autosized
  {
    flex: 1 1 0;
  }

  .static-panel-container
  {
    flex: 1 1 0;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
    position: relative;
  }

  .cant-add-tab
  {
    font-size: 16px;
    font-weight: bold;
    color: red;
  }
</style>
