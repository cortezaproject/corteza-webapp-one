<template>
  <div ref="layout" class="layout layout-rowfirst">
    <div v-for="(levelOne,index) in panes.disposition.itempos" :key="index" class="layout-colfirst desktop"
         :class="{'layout-autosized': index ? [2,5,6,8,10].includes(typeLayout) : [1,4,9].includes(typeLayout) }"
         :style="adjustHeight(index,levelOne.length)"
    >
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
    <div class="static-panel-container mobile">
      <TabBar
        mobile
        :pane_id="0"
        :tabs="allTabs"
        :active_tab="panes.activeMobileTab"
        :showapps="false"
        @add="tryAddTabMobile" />
      <PaneContent
        :pane_id="0"
        :tabs="allTabs"
        :active_tab="panes.activeMobileTab"
        class="pane-content" />
      <app-selector
        class="app-selector-mobile"
        :paneId="0"
        :displayed="panes.mobileShowApps"
        @add-app="addTab"
        @close="panes.mobileShowApps = false"/>
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
    allTabs () {
      return this.panes.items.reduce((acc, panel) => {
        return acc.concat(panel.tabs)
      }, [])
    },
    typeLayout () {
      // bits 1,0 = number of panels in row 1
      // bits 3,2 = number of panels in row 2
      // 0 = no panels
      // 1/4 = 1 panel
      // 2/8 = 2 columns by 1 panel
      // 5 = 2 rows by 1 panel
      // 6 = 2 on top, 1 on bottom
      // 9 = 1 on top, 2 on bottom
      // 10 = 4 panels
      const layout = this.panes.disposition.itempos
      return layout[0].length + 4 * layout[1].length
    },
    sticks () {
      switch (this.typeLayout) {
        case 0:
        case 1:
        case 4: return ''
        case 2:
        case 8: return 'mr'
        case 6:
        case 10: return 'br'
        case 5: return 'bm'
        case 9: return 'tr'
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
      console.log('Adding app from layout')
      console.log(appData)
      this.$store.commit('panes/addApp', appData)
    },
    tryAddTab (paneID) {
      const maxNum = this.panes.maxNumberOfTabsInPanel
      const pane = this.panes.items[paneID]
      if (pane.tabs.length < maxNum) pane.showapps = true
      else this.cantAddTab = true
    },
    tryAddTabMobile () {
      const maxNum = this.panes.maxNumberOfTabsInPanel
      const pane = this.panes.items[0]
      if (pane.tabs.length < maxNum) this.panes.mobileShowApps = true
      else this.cantAddTab = true
    },
    onResize (newRect) {
      // in order to sync the width of the 1st panel on the 2nd row
      this.width = isNaN(newRect.width) ? 0 : newRect.width
      this.height = isNaN(newRect.height) ? 0 : newRect.height
      this.$root.$emit('panelresized') // to notify TabBar so that it can check whether to show PREV/NEXT buttons on overflow
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
        case 8: return idx2 === 0 ? {} : { flex: '1 1 0' }
        case 5: return idx === 0 ? {} : { flex: '1 1 0' }
        case 9: return idx !== 0 && idx2 === 0 ? {} : { flex: '1 1 0' }
        case 6: return idx === 0 && idx2 === 0 ? {} : { flex: '1 1 0' }
        case 10: return idx === 0 && idx2 === 0 ? {} : idx !== 0 && idx2 === 0 ? { flex: '0 0 ' + this.width + 'px' } : {}
        default: return { flex: '1 1 0' }
      }
    },
    adjustHeight (idx, len) {
      if (idx ? [2, 5, 6, 8, 10].includes(this.typeLayout) : [1, 4, 9].includes(this.typeLayout)) return {}
      else return len ? { height: this.height + 'px' } : {}
    },
    shouldResize (idx, idx2) {
      switch (this.typeLayout) {
        case 2:
        case 8: return idx2 === 0
        case 5: return idx === 0
        case 9: return idx !== 0 && idx2 === 0
        case 6:
        case 10: return idx === 0 && idx2 === 0
        default: return false
      }
    },
    computeSize () {
      let rect = this.$refs.layout.getBoundingClientRect()
      switch (this.typeLayout) {
        case 2:
        case 8: // 2 cols by 1 panel
          this.width = rect.width / 2
          this.height = rect.height
          break
        case 5: // 2 rows by 1 panel
          this.width = rect.width
          this.height = rect.height / 2
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
    flex: 1 1 0;
    font-size: 10px;
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
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
  }

  .static-panel-container > *:nth-child(2)
  {
    flex: 1 1 0;
  }

  .cant-add-tab
  {
    font-size: 16px;
    font-weight: bold;
    color: red;
  }

  @media (max-width: $wideminwidth - 1px)
  {
    .layout .desktop
    {
      display: none;
    }
  }

  @media (min-width: $wideminwidth)
  {
    .layout .mobile
    {
      display: none;
    }
  }
</style>
