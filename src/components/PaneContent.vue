<template>
  <div class="iFrameWrap">
    <div class="iFrameContainer">
      <!-- div
        v-for="(tab, index) in tabs" :key="index"
        style="width: 100%; height:100%; overflow-x: hidden; overflow-y: auto;"
        :class="[ { active : active_tab === tab.id } ]"
        class="iframeContent"
      >
      <br /><br /><h1> tab : {{ index }} </h1>

      contenu : {{ tab.src }}
      </div -->
      <iframe
      v-for="(tab, index) in tabs" :key="index"
      style=""
      class="iframeContent"
      :class="[ { active : active_tab === tab.id } ]"
      :style="{pointerEvents: isResizing ? 'none' : 'auto'}"
      frameborder="0"
      :src="tab.src" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaneContent',
  computed: {
    tabs: {
      get () {
        return this.$store.state.panes.items[this.pane_id].tabs
      },
      /* npo reason to set here ?
      set (tabs) {
        console.log('setting tabs')
        console.log(tabs)
        this.$store.commit('panes/updateTabs', { tabs: tabs, paneId: this.pane_id })
      },
      */
    },
    isResizing () {
      return this.$store.state.panes.nowResizing
    },
  },
  props:
  {
    pane_id:
    {
      required: true,
      type: Number,
    },
    top:
    {
      required: false,
      type: String,
      default: '',
    },
    left:
    {
      required: false,
      type: String,
      default: '',
    },
    active_tab:
    {
      type: Number,
      required: false,
      default: 0,
    },
  },
}
</script>

<style lang="scss">
  .iFrameWrap
  {
    display: flex;
    flex-direction: column;

    *
    {
      box-sizing: border-box;
    }

    .iFrameContainer
    {
      display: flex;
      flex: 1 1 0;
      min-height: 0;
      background-color: aliceblue;
    }

    .iframeContent
    {
      display: none;
      flex: 1 1 0;
      overflow-x: hidden;
      overflow-y: scroll;
      background: #CCC;

      &.active
      {
        display: block;
      }
    }
  }
</style>
