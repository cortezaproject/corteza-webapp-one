<template>
  <div class="tab_list_wrapper">
    <div v-if="mobile" class="tab_bar_mobile">
      <div class="tab_header_mobile">
        <div class="tab_icon_mobile" @click="mobileListShown=!mobileListShown">
          <i v-if="!mobileListShown" class="icon-tabs"></i>
          <i v-else class="icon-x"></i>
        </div>
        <div class="tab_active_title">{{ mobileListShown ? 'All Tabs' : activeMobileTitle }}</div>
        <div class="tab_icon_mobile" @click="mobileListShown ? $emit('add') : removeTab(panes.activeMobileTab)">
          <i v-if="mobileListShown" class="icon-plus-circle"></i>
          <i v-else class="icon-x"></i>
        </div>
      </div>
      <div class="tab_list_mobile" :style="{maxHeight: mobileListShown ? '250px' : '0'}">
        <div
          class="tab_item_mobile"
          :class="{ active : active_tab === tab.id }"
          v-for="tab in tabs" :key="tab.id"
          @touch.self="switchActive(tab.id)"
          @mousedown.self="switchActive(tab.id)">
          <i class="active-indicator icon-play3" v-if="active_tab === tab.id"></i>
          <div v-if="tab.logo" :style="{backgroundImage: 'url(' + tab.logo + ')'}" class="tab_logo"/>
          <div
            class="tab_title"
            @touch.self="switchActive(tab.id)"
            @mousedown.self="switchActive(tab.id)">{{ tab.title }}</div>
          <button class="tab-close" @click="removeTab(tab.id)">&times;</button>
        </div>
      </div>
    </div>
    <slick
      v-else
      ref="slick"
      class="tab_list"
      :options="slickOptions"
      :id="'tabs_in_pane_'+pane_id"
      :data-paneid="pane_id">
      <div
        class="tab_item"
        :class="{ active : active_tab === tab.id }"
        v-for="tab in tabs" :key="tab.id"
        @touch.self="switchActive(tab.id)"
        @mousedown.self="switchActive(tab.id)">
        <div v-if="tab.logo" :style="{backgroundImage: 'url(' + tab.logo + ')'}" class="tab_logo"/>
        <div
          class="tab_title"
          @touch.self="switchActive(tab.id)"
          @mousedown.self="switchActive(tab.id)">{{ tab.title }}</div>
        <button class="tab-close" @click="removeTab(tab.id)">&times;</button>
      </div>
    </slick>
    <button v-if="!mobile" class="tab-plus" aria-label="Add tab" title="Add tab" @click="$emit('add')">+</button>
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
    tabs: {
      required: true,
      type: Array,
    },
    active_tab:
    {
      type: Number,
      required: false,
      default: 0,
    },
    mobile:
      {
        type: Boolean,
        default: false,
      },
  },
  data () {
    return {
      mobileListShown: false,
    }
  },
  watch:
    {
      tabs: 'reInit',
    },
  methods:
  {
    switchActive: function (tabID) {
      // console.log('TabBar says : newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.$store.commit(this.mobile ? 'panes/changeActiveMobile' : 'panes/changeActive', tabID)
      this.mobileListShown = false
    },
    reInit () {
      if (this.mobile) return
      let currIndex = this.$refs.slick.currentSlide()

      this.$refs.slick.destroy()
      this.$nextTick(() => {
        this.$refs.slick.create()
        this.$refs.slick.goTo(currIndex, true)
      })
    },
    removeTab: function (tabID) {
      // console.log('TabBar says : newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.$store.commit('panes/removeTab', tabID)
    },
  },
  computed: {
    panes () {
      return this.$store.state.panes
    },
    slickOptions () {
      return {
        infinite: false,
        variableWidth: true,
        prevArrow: '<button class="slick_arrow">&lt;</button>',
        nextArrow: '<button class="slick_arrow">&gt;</button>',
      }
    },
    activeMobileTitle () {
      const active = this.panes.activeMobileTab
      const tab = this.tabs.find(item => item.id === active)
      return tab ? tab.title : ''
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

  @media (max-width: $wideminwidth - 1px)
  {
    .tab_header_mobile
    {
      display: flex;
      align-items: center;
    }

    .tab_icon_mobile
    {
      width: 30px;
      height: 30px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .tab_active_title
    {
      flex: 1 1 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      cursor: pointer;
    }

    .tab_list_mobile
    {
      overflow: auto;
      transition: max-height 0.3s linear;
    }

    .tab_item_mobile
    {
      background-color: $mainbgcolor;
      height: 30px;
      display: flex;
      align-items: center;
      padding: 0 6px;
      border-radius: 3px;
      margin: 8px 12px 12px 25px;
    }

    .tab_item_mobile.active
    {
      background-color: $appgreen;
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
      border-top: 1px solid #DDD;
    }

    .tab_list
    {
      display: flex;
      /* flex-wrap: wrap; */
      overflow: hidden;
      flex: 1 1 0;
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
      min-height: 30px;
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
    border: 1px solid #999;
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
