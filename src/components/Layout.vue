<template>
  <div class="layout">
    <!-- first multipane level, either rows or cols function of layout type -->
    <multipane
      class="main"
      v-model="panes"
      v-if="panes.items.length > 0"
      :data-nb-items="panes.disposition.itempos.length"
      :layout="panes.disposition.type==='colfirst'?'vertical':'horizontal'"
      :style="{ height:'100%', width:'100%' }">
      <!-- loop trhough first level -->
      <template
        v-for="(paneset, panesetindex) in panes.disposition.itempos">
        <!-- we always wrap in a div, either direct, or again a multipane -->
        <!-- single content -->
        <div
          v-if="paneset.length === 1"
          class="last pane onepane-wrapper"
          :data-nb-items="paneset.length"
          :data-structure="panes.disposition.type + '-' + panesetindex"
          :style="(paneset.length - 1 === panesetindex)?{ flexGrow:1 }:{
            width: panes.disposition.type==='colfirst'?''+(100/panes.disposition.itempos.length)+'%':'100%',
            height: panes.disposition.type==='colfirst'?'100%':''+(100/panes.disposition.itempos.length)+'%'
          }"
          :key="panesetindex">
          <TabBar
            :data-tabbar-id="paneset[0]"
            :pane_id="paneset[0]"
            :tabs="panes.items[paneset[0]].tabs"
            :active_tab="panes.items[paneset[0]].active"
            top="0"
            left="0"
            :showapps="false"
            v-on:add="panes.items[paneset[0]].showapps=true" />
          <PaneContent
            :data-pane-id="paneset[0]"
            :pane_id="paneset[0]"
            :tabs="panes.items[paneset[0]].tabs"
            :active_tab="panes.items[paneset[0]].active"
            class="pane-content" />
          <app-selector
            :class="'app-selector-' + paneset[0]"
            :data-selector-id="paneset[0]"
            :pane-id="paneset[0]"
            :displayed="panes.items[paneset[0]].showapps"
            v-on:add-app="addTab"
            v-on:close="panes.items[paneset[0]].showapps=false"></app-selector>
        </div>
        <!-- subpanes -->
        <div
          v-else
          class="pane subpane-wrapper"
          :style="(paneset.length - 1 === panesubsetindex)?{ flexGrow:1, height:'50%' }:{
            width: panes.disposition.type==='colfirst'?''+(100/panes.disposition.itempos.length)+'%':'100%',
            height: panes.disposition.type==='colfirst'?'100%':''+(100/panes.disposition.itempos.length)+'%'
          }"
          :data-nb-items="paneset.length"
          :data-structure="panes.disposition.type + '-' + panesetindex"
          :key="panesetindex">
          <multipane
            :style="{ height:'100%', width:'100%' }"
            :layout="panes.disposition.type!=='colfirst'?'vertical':'horizontal'">
            <!-- loop through second level -->
            <template
              v-for="(pane_id, panesubsetindex) in paneset">
              <div
                class="pane"
                :class="[ { last : (paneset.length - 1 === panesubsetindex) } ]"
                :style="(paneset.length - 1 === panesubsetindex)?{ flexGrow:1 }:{
                  width: panes.disposition.type!=='colfirst'?''+(100/paneset.length)+'%':'100%',
                  height: panes.disposition.type!=='colfirst'?'100%':''+(100/paneset.length)+'%'
                }"
                :key="panesubsetindex">
                  <TabBar
                    :data-tabbar-id="pane_id"
                    :pane_id="pane_id"
                    :tabs="panes.items[pane_id].tabs"
                    :active_tab="panes.items[pane_id].active"
                    top="0"
                    left="0"
                    :showapps="false"
                    v-on:add="panes.items[pane_id].showapps=true" />
                  <PaneContent
                    :data-pane-id="pane_id"
                    :pane_id="pane_id"
                    :tabs="panes.items[pane_id].tabs"
                    :active_tab="panes.items[pane_id].active"
                    class="pane-content" />
                  <app-selector
                    :data-selector-id="pane_id"
                    :class="'app-selector-' + pane_id"
                    :pane_id="pane_id"
                    :displayed="panes.items[pane_id].showapps"
                    v-on:add-app="addTab"
                    v-on:close="panes.items[pane_id].showapps=false"></app-selector>
              </div>
              <cMultipaneResizer
                v-if="paneset.length - 1 !== panesubsetindex"
                :key="'r'+panesubsetindex"
                :dir="panes.disposition.type==='colfirst'?'h':'v'" />
            </template>
          </multipane>
        </div>
        <!-- if not last paneset add resiser between elements -->
        <cMultipaneResizer
          v-if="panes.disposition.itempos.length - 1 !== panesetindex"
          :dir="panes.disposition.type==='colfirst'?'v':'h'"
          :key="'r'+panesetindex" />
      </template>
    </multipane>
  </div>
</template>

<script>
import { Multipane } from 'vue-multipane'
import cMultipaneResizer from '@/components/cMultipaneResizer.vue'
import TabBar from '@/components/TabBar.vue'
import PaneContent from '@/components/PaneContent.vue'
import AppSelector from '@/components/AppSelector.vue'
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
    Multipane,
    cMultipaneResizer,
    TabBar,
    PaneContent,
    AppSelector,
  },
  data ()
  {
    return {
      // layoutpanes: null,
    }
  },
  // on create init pane data in store
  created: function ()
  {
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
  },
  props:
  {
  },
  methods:
  {
    addTab (appData) {
      console.log('Adding a app from layout')
      console.log(appData)
      this.$store.commit('panes/addApp', appData)
    },
  },
}
</script>

<!-- don't scope this ! -->
<style lang="scss">
@import '@/assets/sass/_0.declare.scss';
.layout
{
  font-size:10px;
  position:absolute;
  top:6em;
  height:calc(100vh - 6em);
  max-height:100vh;
  width:100vw;
  overflow:hidden;
  background-color:#fefefe;
  .is-resizing
  {
    .iFrameContainer
    {
      border:solid 2px $appblue;
      iframe
      {
        pointer-events:none;
      }
    }
  }
}
.pane.last
{
  flex-grow:1;
  flex:1;
}
.layout-h > .pane
{
  width:100% !important;
}
.layout-v > .pane
{
  height:100% !important;
  &.last
  {
    width:auto!important;
  }
}
</style>
