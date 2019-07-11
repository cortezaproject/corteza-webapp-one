<template>
  <div class="tab_list_wrapper" ref="tabbar">
    <div v-if="mobile && mobileListShown" class="tab_bar_mobile">
      <div class="tab_header_mobile">{{ $t('layout.listOfTabs') }}</div>
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
          </div>
          <button class="tab-close" @click="removeTab(tab.id)">&times;</button>
        </div>
      </div>
      <div class="tab_add_mobile">
        <button class="tab-plus" @click="$emit('add')">+ {{ $t('layout.add') }}</button>
      </div>
    </div>
    <template v-else-if="!mobile">
      <button v-if="hasOverflow" class="tab-prev-next" :aria-label="$t('layout.tabSlideLeftTooltip')" :title="$t('layout.tabSlideLeftTooltip')" @mousedown.self="startPrev" @mouseup.self="stopPrev" @mouseleave="stopPrev">&lt;</button>
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
            <div v-if="tab.icon" :style="{backgroundImage: 'url(' + tab.icon + ')'}" class="tab_logo"/>
            <div v-else-if="tab.logo" :style="{backgroundImage: 'url(' + tab.logo + ')'}" class="tab_logo"/>
            <div v-else class="no_tab_logo"/>
            <div
              class="tab_title"
              @touch.self="switchActive(tab.id)"
              @mousedown.self="switchActive(tab.id)">{{ tab.title }}</div>
            <button class="tab-close" @click="removeTab(tab.id)">&times;</button>
          </div>
        </draggable>
      </div>
      <button v-if="hasOverflow" class="tab-prev-next" :aria-label="$t('layout.tabSlideRightTooltip')" :title="$t('layout.tabSlideRightTooltip')" @mousedown.self="startNext" @mouseup.self="stopNext" @mouseleave="stopNext">&gt;</button>
      <button class="tab-plus" :aria-label="$t('layout.addTab')" :title="$t('layout.addTab')" @click="$emit('add')">+</button>
    </template>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  name: 'TabBar',

  components: {
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
    top: {
      required: false,
      type: String,
      default: '',
    },
    left: {
      required: false,
      type: String,
      default: '',
    },
    tabs: {
      required: true,
      type: Array,
    },
    active_tab: {
      type: Number,
      required: false,
      default: 0,
    },
    mobile: {
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

  computed: {
    tabList: {
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

  methods: {
    endDrag: function (e) {
      // if moving from one pane to another
      if (e.from.dataset.paneid !== e.to.dataset.paneid) {
        this.$store.commit('panes/setFirstTabActive', {
          paneId: this.pane_id,
        })
      }
    },

    switchActive: function (tabID) {
      this.$store.commit(this.mobile ? 'panes/changeActiveMobile' : 'panes/changeActive', tabID)
      this.mobileListShown = false
      this.$root.$emit('closeTabsMobile')
    },

    removeTab: function (tabID) {
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
}
</script>

<style scoped lang="scss">
  .tab_list_wrapper {
    font-family: $regular;
    background-color: $white;
    z-index: 3;
    margin: 0;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 0.1rem 0.2rem 0 rgba($dark, 0.1);
    display: flex;
    border-top: 1px solid $light;
  }

  .tab_logo {
    width: 20px;
    height: 25px;
    margin-right: 5px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }

  .tab_item {
    width: 150px;
    min-width: 150px;
    overflow: hidden;
    padding: 3px 2px 2px 4px;
    display: flex;
    align-items: center;
    border-bottom: 3px solid $white;
    border-right: 1px solid $light;
    color: $secondary;
    font-family: $regular;
    &.active {
      color: $success;
      border-bottom: 3px solid $success;
    }
    .tab-close {
      color: $secondary;
    }
  }

  .no_tab_logo {
    margin-right: 5px;
  }

  .tab_title {
    flex: 1 1 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    cursor: pointer;
  }

  .tab_list {
    display: flex;
    overflow: hidden;
  }

  .tab-close {
    cursor: pointer;
    border: none;
    background-color: transparent;
    width: 16px;
    font-size: 15px;
    margin-top: -5px;
    &:hover {
      transform: scale(1.2);
    }
    &:focus {
      outline: none;
    }
  }

  .tab-prev-next,
  .tab-plus {
    display: block;
    background: $secondary;
    font-size: 20px;
    width: 30px;
    min-width: 30px;
    min-height: 30px;
    cursor: pointer;
    background: $white;
    line-height: 20px;
    border: none;
    color: $secondary;
    padding: 0 0 5px;
    &:hover,
    &:active{
      color: $success;
      background: $white;
    }
  }

  .tab-prev-next {
    border-right: 1px solid $white;
    font-size: 15px;
  }

  .mobile {
    visibility: hidden;
  }

  @media (max-width: $wideminwidth - 1px) {
    .mobile {
      visibility: visible;
    }

    .tab_logo {
      width: 50px;
    }

    .tab-close {
      font-size: 18px;
    }

    .tab_bar_mobile {
      position: fixed;
      top: 50px;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      background-color: $white;
      overflow: hidden;
    }

    .tab_header_mobile {
      padding: 16px 20px;
      font-size: 20px;
    }

    .tab_list_mobile {
      flex: 1 1 0;
      overflow: auto;
    }

    .tab_item_mobile {
      background-color: $white;
      display: flex;
      align-items: center;
      border-radius: 3px;
      margin: 4px 8px 8px;
      padding: 8px 8px 8px;
    }

    .tab_add_mobile {
      padding: 20px;

      .tab-plus {
        background: $secondary;
        color: $white;
        font-size: 14px;
        width: 150px;
        height: 40px;
        display: flex;
        justify-content: center;
        margin: auto;
        transition: color .2s,background-color .2s;
        &:hover {
          border: 1px solid $secondary;
          color: $secondary;
          background: transparent;
        }
      }
    }
  }

</style>
