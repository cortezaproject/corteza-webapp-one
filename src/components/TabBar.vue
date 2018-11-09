<template>
  <div
    class="tab_list_wrapper"
    :style="(top === ''?'':'top:' + top) + ';' + (left ==='' ? '' : 'left:calc('+left+' - 5px)')"
    :class="[ { 'mobile-shown' : mobileListShown  } ]">
    <div
      class="mobile mobile-switch"
      @click="mobileListShown=!mobileListShown">
        <i v-if="!mobileListShown" class="icon-tabs"></i>
        <i v-else class="icon-x"></i>
      </div>
    <div class="mobile title">
      <span>All Tabs</span>
      <div class="tab-plus add" @click="$emit('add')">
        <label for="show-apps"><i class="icon-plus"></i></label>
      </div>
    </div>
    <draggable
      v-model="tabs"
      :options="{ group:'tabs' }"
      class="tab_list"
      :id="'tabs_in_pane_'+pane_id"
      :data-paneid="pane_id"
      @start="drag=true"
      @end="endDrag">
      <!-- we don't want the close button to propagate the click to span an parent, so we double event but limit to span and div "self" -->
      <div
        class="tab_item item"
        :class="[ { active : active_tab === tab.id } ]"
        v-for="(tab, index) in tabs" :key="index"
        @touch.self="switchActive({id:tab.id, pane:pane_id})"
        @mousedown.self="switchActive({id:tab.id, pane:pane_id})">
        <i class="active-indicator icon-play3" v-if="mobileListShown && active_tab === tab.id"></i>
        <span
          @touch.self="switchActive({id:tab.id, pane:pane_id})"
          @mousedown.self="switchActive({id:tab.id, pane:pane_id})">{{ tab.title }}</span>
        <i class="icon-close" @click="removeTab({id:tab.id, pane:pane_id})"></i>
      </div>
      <div class="tab-plus add" @click="$emit('add')">
        <label for="show-apps"><span  arial-label="Add tab" title="Add tab">+</span></label>
      </div>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'TabBar',
  components:
  {
    draggable,
  },
  props: {
    showapps: {
      required: true,
      type: Boolean,
    },
    pane_id: {
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
    /*
    tabs: {
      required: true,
      type: Array,
    },
    */
    active_tab:
    {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data () {
    return {
      // create a local instance of tabs
      paneTabs: null,
      mobileListShown: false,
    }
  },
  // run at component first creation
  created: function () {
    // this.paneTabs = this.tabs
  },
  methods:
  {
    switchActive: function (newActiveTab) {
      // console.log('TabBar says : newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.$store.commit('panes/changeActive', newActiveTab)
      this.mobileListShown = false
    },
    removeTab: function (tabToDel) {
      // console.log('TabBar says : newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.$store.commit('panes/removeTab', tabToDel)
    },
    endDrag: function (e) {
      console.log('endOfDrag')
      console.log(e)
      console.log('from ' + e.from.dataset.paneid + ' to ' + e.to.dataset.paneid)
      // if moving from one pane to another
      if (e.from.dataset.paneid !== e.to.dataset.paneid) {
        this.$store.commit('panes/setFirstTabActive', {
          paneId: this.pane_id,
        })
      }
    },
    /*
    onEnd: function (tabMoved, paneId) {
      console.log('onEnd')
      console.log(tabMoved)
      console.log('moving tab #' + tabMoved.oldIndex + ' of ' + tabMoved.from.getAttribute('data-paneid') + ' to ' + tabMoved.newIndex + ' of ' + tabMoved.to.getAttribute('data-paneid'))
      this.$store.commit('panes/updateTabs', tabMoved)
      // debugger;
    },
    */
  },
  computed: {
    tabs: {
      get () {
        // console.log(this.$store.state.panes)
        // console.log('TabBar getting tabs')
        return this.$store.state.panes.items[this.pane_id].tabs
      },
      set (tabs) {
        // console.log('setting tabs')
        // console.log(tabs)
        this.$store.commit('panes/updateTabs', {
          tabs: tabs,
          paneId: this.pane_id,
        })
      },
    },
  },
}
</script>
<style scoped lang="scss">
  //define vars here
  $wideminwidth:640px;
  //import global variables (may overwrite previous ones)
  @import '@/assets/sass/_0.declare.scss';

  .tab_list_wrapper
  {
    font-family: $crustregular;
    background-color: $headerbgcolor;
    z-index: 3;
    top: 0;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    position: absolute;
    height: 30px;
    bottom: auto;
    box-shadow: 0 0.1rem 0.2rem 0 rgba($defaulttextcolor, 0.1);
  }

  @media (max-width: $wideminwidth - 1px)
  {
    .title
    {
      line-height: 30px;
      max-height: 30px;
      overflow: hidden;
      display: none;

      span
      {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 20px;
        color: $defaulttextcolor;
        font-weight: 600;
        font-size: 14px;
        padding-left: 10px;
      }

      .add
      {
        float: right;
        margin-right: 15px;
      }
    }

    .mobile-switch,
    .title .add
    {
      float: left;
      font-size: 24px;
      line-height: 30px;
      height: 30px;
      padding: 3px 0;

      i
      {
        line-height: 1;
      }
    }

    .mobile-switch
    {
      padding: 4px 0 0 15px;

      .title
      {
        display: block;
      }
    }

    .tab_list
    {
      background-color: $headerbgcolor;

      .add
      {
        display: none;
      }
    }

    .tab_item
    {
      display: none;
      line-height: 30px;
      margin-left: 24px + 15px + 10px; // icon width + 15 + 15
      margin-right: 15px; // icon width + 15 + 15
      &.active
      {
        display: block;
        font-size: 14px;
      }

      .icon-close
      {
        float: right;
        font-size: 24px;
        padding: 3px 0;
      }
    }

    .tab_list_wrapper.mobile-shown
    {
      background-color: $headerbgcolor;

      .mobile-switch
      {
        padding-top: 3px;
      }

      .tab_list
      {
        display: block;
        padding: 10px 0 20px 0;
        box-shadow: 0 0.1rem 0.2rem 0 rgba($defaulttextcolor, 0.1);
        max-height: calc(100vh - 100px);
        overflow: hidden auto;
      }

      .title
      {
        display: block;
        line-height: 34px;
      }

      .tab_item
      {
        display: block;
        height: 34px;
        line-height: 34px;
        padding: 0 5px 0 9px;
        margin-left: 24px + 15px + 10px;
        margin-right: 15px - 4px;
        border-radius: 3px;
        background-color: rgba($defaultitembgcolor, 0.15);
        margin-bottom: 10px;
        font-size: 14px;

        .icon-close
        {
          padding-top: 5px;
        }

        &.active
        {
          background-color: rgba($appgreen, 0.15);
        }

        .active-indicator
        {
          margin-left: -10px;
          width: 9px;
          font-size: 9px;
          display: block;
          float: left;
          line-height: 30px;
        }
      }
    }
  }

  //using media query to change behaviour if available display area is sufficient.
  @media (min-width: $wideminwidth)
  {
    .mobile
    {
      display: none;
    }

    .tab_list .item > span
    {
      display: block;
      width: calc(85% + 20px);
      line-height: 28px;
      transform: skewX(25deg);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      background: $tab_bgcolor;
      padding-left: 8px;
      margin-left: -20px;
    }

    // browser like tabs
    // extended from Adem ilter @ademilter
    .tab_list_wrapper
    {
      display: block;
      background: none;
      box-shadow: 0 0.1rem 0.2rem 0 rgba($defaulttextcolor, 0.1);

      .add
      {
        cursor: pointer;
        text-align: center;
        font-weight: bold;
        color: #CCC;
        line-height: 15px;
        font-size: 15px;
        float: left;
        margin: 6px 8px 0;
        width: 23px;
        height: 16px;
        background: $tab_bgcolor;
        border-radius: 5px;
        border: 1px solid #AAA;
        transform: skewX(-25deg);
        //box-shadow: inset 0 1px 0 rgba(255,255,255,.8);

        span
        {
          display: block;
          transform: skewX(25deg);
          color: rgba(0, 0, 0, 0.8);
        }
      }

      .add:hover
      {
        background-color: #1E2224;
        color: $tab_hovercolor;

        span
        {
          color: $tab_hovercolor;
        }
      }

      .add:active
      {
        //box-shadow: inset 0 1px 2px rgba(0,0,0,.2);
        background: #CCC;
        color: #555;
      }
    }

    .tab_title,
    .tab_display
    {
      display: none !important;
    }

    .tab-wrapper
    {
      min-height: 100vh;
      padding-top: 9rem;
    }

    .tab_list
 {
      position: relative;
      float: left;
      margin: 0;
      margin-left: 20px;
      height: 40px;
      background-color: transparent;
      display: block;
      width: calc(100% - 20px);
      //position:absolute;
      //top:0;
    }

    .tab_list .item,
    .tab_list .item::before
 {
      cursor: pointer;
      z-index: 1;
      position: relative;
      border: 1px solid #AAA;
      border-top: 0;
      transform: skewX(-25deg);
      float: left;
      margin: 0 0 0 7px;
      padding: 0 15px;
      padding-right: 30px;
      border-radius: 0 0 5px 5px;
      box-shadow: inset -1px 1px 0 rgba(255, 255, 255, 0.5);
      background: $tab_bgcolor;
      color: $defaulttextcolor;
      font-size: 14px;
    }

    .tab_list .item
    {
      width: 10%;
      min-width: 30px;
      height: 30px;

      .icon-close::before
      {
        border-radius: 100%;
      }

      .icon-close::before,
      em
      {
        position: absolute;
        top: 7px;
        right: 12px;
        padding: 0;
        margin: 0;
      }

      a,
      em .icon-close::before
      {
        transform: skewX(25deg);
      }

      .icon-close:hover::before
      {
        background-color: #1E2224;
        color: $tab_hovercolor;
      }

      .icon-close
      {
        margin: -3rem -1.5rem;
      }

      &.updated
      {
        > span
        {
          padding-left: 18px;
        }
      }

      em
      {
        top: 5px;
        z-index: 4;
        right: auto;
        left: 0px;

        &::after
        {
          height: 0.6rem;
          width: 0.6rem;
        }
      }

      a
      {
        z-index: 3;
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 18px;
        color: #777;
        width: 15px;
        height: 15px;
        line-height: 16px;
        text-align: center;
        border-radius: 100%;
      }
    }

    .tab_list .item::before
    {
      height: 30px;
      content: '';
      position: absolute;
      left: -18px;
      transform: skewX(-140deg);
      border-right: 0;
      margin: 0;
      padding: 0;
      width: 18px;
      border-radius: 0  0 0 5px;
      box-shadow: inset 1px 1px 0 rgba(255, 255, 255, 0.5);
      margin-top: -1px;
    }

    .tab_list .item:nth-child(1)
 {
      z-index: 9;
    }

    .tab_list .item:nth-child(2)
 {
      z-index: 8;
    }

    .tab_list .item:nth-child(3)
 {
      z-index: 7;
    }

    .tab_list .item:nth-child(4)
 {
      z-index: 6;
    }

    .tab_list .item:nth-child(5)
 {
      z-index: 5;
    }

    .tab_list .item:nth-child(6)
 {
      z-index: 4;
    }

    .tab_list .item:nth-child(7)
 {
      z-index: 3;
    }

    .tab_list .item:nth-child(8)
 {
      z-index: 2;
    }

    .tab_list .item:nth-child(9)
 {
      z-index: 1;
    }

    .tab_list .item.active,
    .tab_list .item.active::before
 {
      z-index: 999 !important;
      //background: #eee;
      height: 30px;
      border-color: #888;
      background-color: $curtab_bgcolor;
    }

    .tab_list .item img
    {
      z-index: 9;
      position: absolute;
      left: -6px;
      top: 6px;
      width: 16px;
      height: 16px;
      transform: skewX(25deg);
      border-radius: 3px;
    }

    .tab_list .item a:hover
    {
      color: $defaulttextcolor;
      background-color: #E05D68;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.4);
    }

    .tab_list .item a:active
    {
      background-color: #D83240;
    }

    .tab_list .item.active,
    .tab_list .item.active::before,
    .tab_list .item.active span
    {
      border-top: solid 1px $curtab_topbordercolor;
    }

    .tab_list .item.active
    {
      height: 30px;

      &::before
      {
        height: 28px;
      }

      span
      {
        margin-top: -1px;
        background-color: $curtab_bgcolor;
      }
    }
  }
</style>
