<template>
  <div
    class="tab_list_wrapper"
    :style="(top === ''?'':'top:' + top) + ';' + (left ==='' ? '' : 'left:calc('+left+' - 5px)')"
    :class="{ 'mobile-shown' : mobileListShown}">
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
    <slick
      ref="slick"
      class="tab_list"
      :options="slickOptions"
      :id="'tabs_in_pane_'+pane_id"
      :data-paneid="pane_id">
      <div
        class="tab_item"
        :class="[ { active : active_tab === tab.id } ]"
        v-for="(tab, index) in tabs" :key="index"
        @touch.self="switchActive({id:tab.id, pane:pane_id})"
        @mousedown.self="switchActive({id:tab.id, pane:pane_id})">
        <i class="active-indicator icon-play3" v-if="mobileListShown && active_tab === tab.id"></i>
        <div v-if="tab.logo" :style="{backgroundImage: 'url(' + tab.logo + ')'}" class="tab_logo"/>
        <div
          class="tab_title"
          @touch.self="switchActive({id:tab.id, pane:pane_id})"
          @mousedown.self="switchActive({id:tab.id, pane:pane_id})">{{ tab.title }}</div>
        <button class="tab-close" @click="removeTab({id:tab.id, pane:pane_id})">&times;</button>
      </div>
    </slick>
    <button class="tab-plus" aria-label="Add tab" title="Add tab" @click="addTab">+</button>
  </div>
</template>
<script>
import Slick from 'vue-slick'
require('slick-carousel/slick/slick.css')

export default
{
  name: 'TabBar',
  components:
  {
    Slick,
  },
  props:
  {
    showapps:
    {
      required: true,
      type: Boolean,
    },
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
  watch:
    {
      tabs: 'reInit',
    },
  methods:
  {
    switchActive: function (newActiveTab) {
      // console.log('TabBar says : newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.$store.commit('panes/changeActive', newActiveTab)
      this.mobileListShown = false
    },
    reInit () {
      let currIndex = this.$refs.slick.currentSlide()

      this.$refs.slick.destroy()
      this.$nextTick(() => {
        this.$refs.slick.create()
        this.$refs.slick.goTo(currIndex, true)
      })
    },
    addTab () {
      this.$emit('add')
    },
    removeTab: function (tabToDel) {
      // console.log('TabBar says : newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.$store.commit('panes/removeTab', tabToDel)
    },
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
    slickOptions () {
      return {
        infinite: false,
        variableWidth: true,
        prevArrow: '<button class="slick_arrow">&lt;</button>',
        nextArrow: '<button class="slick_arrow">&gt;</button>',
      }
    },
  },
}
</script>
<style scoped lang="scss">
  @import '@/assets/sass/_0.declare.scss';

  .tab_list_wrapper
  {
    font-family: $crustregular;
    background-color: $headerbgcolor;
    z-index: 3;
    margin: 0;
    padding: 0;
    overflow: hidden;
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

    .tab_list_wrapper
    {
      display: flex;
      overflow: hidden;
    }

    .tab_list
    {
      display: flex;
      /* flex-wrap: wrap; */
      overflow: hidden;
      border-top: 1px solid #DDD;
    }

    .tab-plus
    {
      display: block;
      font-weight: bold;
      color: #FFF;
     background: $tab_bgcolor;
      line-height: 20px;
      font-size: 20px;
      width: 30px;
      min-width: 30px;
      border: none;
      cursor: pointer;
    }

    .tab-plus:hover
    {
      background: $defaulttextcolor;
    }

    .tab-plus:active
    {
      padding: 1px 0 0 1px;
      background: #CCC;
      color: #555;
    }

    .tab_item
    {
      width: 150px;
      overflow: hidden;
      background: #FFF;
      padding: 3px 2px 2px 4px;
      display: inline-flex !important;
      align-items: center;
      border: 1px solid #DDD;

      .tab_logo
      {
        width: 25px;
        height: 25px;
        margin-right: 5px;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
      }

      .tab_title
      {
        flex: 1 1 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 25px;
        cursor: pointer;
      }

      .tab-close
      {
        cursor: pointer;
        border: none;
        background-color: transparent;
        width: 16px;
        font-size: 20px;
      }

      .tab-close:hover
      {
        transform: scale(1.2);
      }
    }

    .tab_item.active
    {
      background-color: $appgreen;
      color: #FFF;
      border-color: $appgreen;

      .tab-close
      {
        color: #FFF;
      }
    }
  }
</style>

<style>
  .slick_arrow
  {
    display: block;
    font-weight: bold;
    color: #777;
    background: #DDD;
    line-height: 20px;
    font-size: 20px;
    width: 30px;
    min-width: 30px;
    border: 1px solid black;
    border-radius: 2px;
    cursor: pointer;
  }

  .slick_arrow:active
  {
    padding: 1px 0 0 1px;
  }

  .slick-list
  {
    overflow: hidden;
  }

  .slick-slide
  {
    width: 150px !important;
    display: inline-block;
  }
</style>
