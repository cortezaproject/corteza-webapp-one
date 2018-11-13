<template>
  <div class="tab_list_wrapper" ref="tabbar">
    <div v-if="mobile && mobileListShown" class="tab_bar_mobile">
      <div class="tab_header_mobile">All tabs</div>
      <div class="tab_list_mobile">
        <div
          class="tab_item_mobile"
          :class="{ active : active_tab === tab.id }"
          v-for="tab in tabs" :key="tab.id"
          @touch.self="switchActive(tab.id)"
          @mousedown.self="switchActive(tab.id)">
          <div v-if="tab.logo" :style="{backgroundImage: 'url(' + tab.logo + ')'}" class="tab_logo"/>
          <div
            class="tab_title"
            @touch.self="switchActive(tab.id)"
            @mousedown.self="switchActive(tab.id)"
          >
            {{ tab.title }}
            <i class="active-indicator" v-if="active_tab === tab.id"></i>
          </div>
          <button class="tab-close" @click="removeTab(tab.id)">&times;</button>
        </div>
      </div>
      <div class="tab_add_mobile">
        <button class="tab-plus" @click="$emit('add')">+</button>
      </div>
    </div>
    <template v-else-if="!mobile">
      <button v-if="hasOverflow" class="tab-prev-next" aria-label="Slide left" title="Slide left" @mousedown.self="startPrev" @mouseup.self="stopPrev" @mouseleave="stopPrev">&lt;</button>
      <div class="tab_list" @mousedown.stop>
        <draggable
          ref="dragger"
          v-model="tabList"
          :options="{ group:'tabs' }"
          class="tab_list"
          :style="{marginLeft: -posSlider + 'px'}"
          :id="'tabs_in_pane_'+pane_id"
          :data-paneid="pane_id"
          @start="drag=true"
          @end="endDrag">
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
        </draggable>
      </div>
      <button v-if="hasOverflow" class="tab-prev-next" aria-label="Slide right" title="Slide right" @mousedown.self="startNext" @mouseup.self="stopNext" @mouseleave="stopNext">&gt;</button>
      <button class="tab-plus" aria-label="Add tab" title="Add tab" @click="$emit('add')">+</button>
    </template>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default
{
  name: 'TabBar',
  components:
  {
    draggable,
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
      hasOverflow: false,
      posSlider: 0,
      slidingLeft: false,
      slidingRight: false,
    }
  },
  created () {
    this.$root.$on('panelresized', this.onResize)
    this.$root.$on('showTabsMobile', this.onShowMobile)
  },
  beforeDestroy () {
    this.$root.$off('panelresized', this.onResize)
    this.$root.$off('showTabsMobile', this.onShowMobile)
  },
  mounted () {
    this.onResize()
  },
  methods:
  {
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
    switchActive: function (tabID) {
      // console.log('TabBar says : newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.$store.commit(this.mobile ? 'panes/changeActiveMobile' : 'panes/changeActive', tabID)
      this.mobileListShown = false
      this.$root.$emit('closeTabsMobile')
    },
    removeTab: function (tabID) {
      // console.log('TabBar says : newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.$store.commit('panes/removeTab', tabID)
    },
    onResize () {
      this.hasOverflow = this.$refs.dragger ? this.$refs.dragger.$el.scrollWidth > this.$refs.dragger.$el.offsetWidth && this.$refs.dragger.$el.offsetWidth > 0 && this.$refs.tabbar.offsetWidth > 100 : false
    },
    onShowMobile (shown) {
      this.mobileListShown = shown
    },
    startPrev () {
      this.slidingLeft = true
      this.slidingRight = false
      requestAnimationFrame(this.slideLeft)
    },
    stopPrev () {
      this.slidingLeft = false
    },
    startNext () {
      this.slidingRight = true
      this.slidingLeft = false
      requestAnimationFrame(this.slideRight)
    },
    stopNext () {
      this.slidingRight = false
    },
    slideLeft () {
      if (this.posSlider > 0) this.posSlider = this.posSlider - 5
      else this.stopPrev()
      if (this.slidingLeft) requestAnimationFrame(this.slideLeft)
    },
    slideRight () {
      let dif = this.$refs.dragger.$el.scrollWidth - this.$refs.dragger.$el.clientWidth
      if (dif > 0) this.posSlider = this.posSlider + (dif >= 5 ? 5 : dif)
      else this.stopNext()
      if (this.slidingRight) requestAnimationFrame(this.slideRight)
    },
  },
  computed: {
    tabList:
    {
      get () {
        return this.tabs
      },
      set (tabs) {
        this.$store.commit('panes/updateTabs', {
          tabs: tabs,
          paneId: this.pane_id,
        })
      },
    },
    panes () {
      return this.$store.state.panes
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

  .tab-prev-next
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
    border: 1px solid #555;
    border-radius: 2px;
    cursor: pointer;
  }

  .tab-prev-next:hover
  {
    background: $defaulttextcolor;
  }

  .tab-prev-next:active
  {
    padding: 1px 0 0 1px;
    background: #CCC;
    color: #555;
  }

  @media (max-width: $wideminwidth - 1px)
  {
    .tab_bar_mobile
    {
      position: fixed;
      top: 6em; /* take into account the header */
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      background-color: $appgrey;
      overflow: hidden;
    }

    .tab_header_mobile
    {
      padding: 16px 20px;
      font-size: 20px;
    }

    .tab_list_mobile
    {
      flex: 1 1 0;
      overflow: auto;
    }

    .tab_item_mobile
    {
      background-color: $appwhite;
      height: 30px;
      display: flex;
      align-items: center;
      padding: 0 6px;
      border-radius: 3px;
      margin: 8px 16px 16px;
    }

    .active-indicator
    {
      background-color: $error;
      display: inline-block;
      border-radius: 50%;
      width: 8px;
      height: 8px;
    }

    .tab_add_mobile
    {
      padding: 16px 0 20px;

      .tab-plus
      {
        color: $appwhite;
        background-color: $appblue;
        font-size: 28px;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
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
      border-top: 1px solid #DDD;
    }

    .tab_list
    {
      display: flex;
      overflow: hidden;
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
      min-width: 150px;
      overflow: hidden;
      background: #FFF;
      padding: 3px 2px 2px 4px;
      display: flex;
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
