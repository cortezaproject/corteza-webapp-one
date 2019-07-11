<template>
  <div ref="layout" class="layout" :class="{'layout-rowfirst': rowFirst, 'layout-colfirst': !rowFirst}">
    <template v-if="!mobile">
      <div v-for="levelOne in 2" :key="levelOne" class="desktop"
          :class="{'layout-autosized': levelOne === 2 ? !autosizeFirstSplit : autosizeFirstSplit,
            'layout-colfirst': rowFirst, 'layout-rowfirst': !rowFirst}"
          :style="adjustHeight(levelOne)"
      >
        <VueResize v-for="levelTwo in 2" :key="levelTwo" :active="shouldResize(levelOne,levelTwo)"
                  :class="{'static-panel-container': !shouldResize(levelOne,levelTwo)}" :style="adjustWidth(levelOne,levelTwo)"
                  v-show="panels[(levelOne-1)*2+(levelTwo-1)].visible" :width="width" :height="height" :sticks="sticks"
                  @resize="onResize" @stopresize="onStopResize" @activated="onActivation">
          <TabBar
            :pane_id="(levelOne-1)*2+(levelTwo-1)"
            :tabs="panels[(levelOne-1)*2+(levelTwo-1)].tabs"
            :active_tab="panels[(levelOne-1)*2+(levelTwo-1)].active"
            :showapps="false"
            @add="tryAddTab((levelOne-1)*2+(levelTwo-1))" />
          <PaneContent
            :pane_id="(levelOne-1)*2+(levelTwo-1)"
            :tabs="panels[(levelOne-1)*2+(levelTwo-1)].tabs"
            :active_tab="panels[(levelOne-1)*2+(levelTwo-1)].active"
            class="pane-content" />
          <app-selector
            :class="'app-selector-' + (levelOne-1)*2+(levelTwo-1)"
            :paneId="(levelOne-1)*2+(levelTwo-1)"
            :displayed="panels[(levelOne-1)*2+(levelTwo-1)].showapps"
            @add-app="addTab"
            @close="panels[(levelOne-1)*2+(levelTwo-1)].showapps=false"></app-selector>
        </VueResize>
      </div>
    </template>
    <div
      v-else
      class="static-panel-container mobile">

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
      <h3 slot="header">{{ $t('general.labelwarning') }}</h3>
      <div class="cant-add-tab">{{ $t('notification.panel.cantAddTab') }}</div>
    </modal>
  </div>
</template>

<script>
import TabBar from 'corteza-webapp-one/src/components/TabBar.vue'
import PaneContent from 'corteza-webapp-one/src/components/PaneContent.vue'
import AppSelector from 'corteza-webapp-one/src/components/AppSelector.vue'
import Modal from 'corteza-webapp-one/src/components/Modal'
import VueResize from 'corteza-webapp-one/src/components/VueResize.vue'

const wideMinWidth = 768
/*
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
*/
export default {
  name: 'Layout',

  components: {
    TabBar,
    PaneContent,
    AppSelector,
    Modal,
    VueResize,
  },

  data () {
    return {
      cantAddTab: false,
      width: 500,
      height: 500,
      mobile: false,
    }
  },

  computed: {
    panes: {
      get () {
        return this.$store.state.panes
      },
      /*
      set (tabs) {
        this.$store.commit('panes/updateTabs', tabs);
      }
      */
    },

    panels () {
      return this.panes.items
    },

    allTabs () {
      return this.panes.items.reduce((acc, panel) => {
        return acc.concat(panel.tabs)
      }, [])
    },

    rowFirst () {
      return this.panes.disposition === 'rowfirst'
    },

    typeLayout () {
      // 0 = no panels
      // 1/2/4/8 = 1 panel [1/4]
      // 3/12 = 2 columns by 1 panel (rowfirst), 2 rows by 1 panel (colfirst) [2/8]
      // 5/6/9/10 = 2 rows by 1 panel (rowfirst), 2 cols by 1 panel (colfirst) [5]
      // 7/11 = 2 on top, 1 on bottom (rowfirst), 2 on left + 1 on right (colfirst) [6]
      // 13/14 = 1 on top, 2 on bottom (rowfirst), 1 on left + 2 on right (colfirst) [9]
      // 15 = 4 panels [10]
      const layout = this.panels
      return layout[0].visible + 2 * layout[1].visible + 4 * layout[2].visible + 8 * layout[3].visible
    },

    autosizeFirstSplit () {
      return [1, 2, 3, 13, 14].includes(this.typeLayout)
    },

    sticks () {
      switch (this.typeLayout) {
        case 0:
        case 1:
        case 2:
        case 4:
        case 8: return ''
        case 3:
        case 12: return this.rowFirst ? 'mr' : 'bm'
        case 7:
        case 11:
        case 15: return 'br'
        case 5:
        case 6:
        case 9:
        case 10: return this.rowFirst ? 'bm' : 'mr'
        case 13:
        case 14: return this.rowFirst ? 'tr' : 'bl'
      }
      return ''
    },
  },

  watch: {
    'typeLayout': 'computeSize',
  },

  mounted () {
    this.computeSize()

    // Check if on mobile or not
    // @note this is temporary until the entire layout is reworked.
    const onResize = () => {
      const { innerWidth } = window
      this.mobile = !isNaN(innerWidth) && innerWidth < wideMinWidth
    }

    window.onresize = onResize
    setTimeout(onResize, 1)
  },

  methods: {
    addTab (appData) {
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

    onActivation () {
      this.$root.$emit('panelresized') // to notify TabBar so that it can check whether to show PREV/NEXT buttons on overflow
    },

    adjustWidth (idx, idx2) {
      switch (this.typeLayout) {
        case 3:
        case 12: return idx2 === 1 ? {} : { flex: '1 1 0' }
        case 5:
        case 6:
        case 9:
        case 10: return idx === 1 ? {} : { flex: '1 1 0' }
        case 13:
        case 14: return idx !== 1 && idx2 === 1 ? {} : { flex: '1 1 0' }
        case 7:
        case 11: return idx === 1 && idx2 === 1 ? {} : { flex: '1 1 0' }
        case 15: return idx === 1 && idx2 === 1 ? {} : idx !== 1 && idx2 === 1 ? { flex: '0 0 ' + (this.rowFirst ? this.width : this.height) + 'px' } : {}
        default: return { flex: '1 1 0' }
      }
    },

    adjustHeight (idx) {
      if (idx === 2 ? !this.autosizeFirstSplit : this.autosizeFirstSplit) return {}
      else if (this.rowFirst) return this.typeLayout === 3 ? { height: this.height + 'px' } : {}
      else return this.typeLayout === 3 ? { width: this.width + 'px' } : {}
    },

    shouldResize (idx, idx2) {
      switch (this.typeLayout) {
        case 3:
        case 12: return idx2 === 1
        case 5:
        case 6:
        case 9:
        case 10: return idx === 1
        case 13:
        case 14: return idx !== 1 && idx2 === 1
        case 7:
        case 11:
        case 15: return idx === 1 && idx2 === 1
        default: return false
      }
    },

    computeSize () {
      let rect = this.$refs.layout.getBoundingClientRect()
      this.width = rect.width / ((this.rowFirst ? [5, 6, 9, 10].includes(this.typeLayout) : [3, 12].includes(this.typeLayout)) ? 1 : 2)
      this.height = rect.height / ((!this.rowFirst ? [5, 6, 9, 10].includes(this.typeLayout) : [3, 12].includes(this.typeLayout)) ? 1 : 2)
    },
  },
}
</script>

<style lang="scss">
  .layout {
    flex: 1 1 0;
    font-size: 10px;
    overflow: hidden;
    background-color: #FEFEFE;
  }

  .layout-colfirst {
    display: flex;
    flex-direction: row;
  }

  .layout-rowfirst {
    display: flex;
    flex-direction: column;
  }

  .layout-autosized {
    flex: 1 1 0;
  }

  .static-panel-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
  }

  .static-panel-container > *:nth-child(2) {
    flex: 1 1 0;
  }

  .cant-add-tab {
    font-size: 16px;
    font-weight: bold;
    color: red;
  }
</style>
