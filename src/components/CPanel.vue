<template>
  <section
    ref="panel"
    :class="{ 'show-tab-bar': showTabBar }"
  >
    <c-tab-bar
      v-if="showTabBar"
      v-bind="$attrs"
      :tabs="tabs"
      :index="index"
      :active-tab-index="activeTabIndex"
      :resizing="resizing"
      v-on="$listeners"
    />
    <!--
      Important:
      we're intentionally using v-show here
      v-if causes component redraw and
      refresh of the iframe content
    -->
    <div
      v-show="resizing"
      class="resizing-placeholder"
    >
      <img
        :src="resizingPlaceholderLogo"
      >
    </div>
    <div
      v-for="(tab, i) in tabs"
      v-show="!resizing && i === activeTabIndex"
      :key="i"
      class="content"
      :class="{ 'app-selector-shown': !tab.url }"
    >
      <c-app-selector
        v-if="!tab.url"
        @selected="handleAppSelection($event, i)"
      />
      <iframe
        v-else-if="isLoaded(tab, i)"
        :src="tab.url"
        @load="handleLoad(i)"
      />
    </div>
  </section>
</template>
<script>
import { mapActions } from 'vuex'
import CTabBar from './CTabBar'
import CAppSelector from './CAppSelector'

export default {
  components: {
    CAppSelector,
    CTabBar,
  },

  props: {
    /**
     * Panel index
     */
    index: {
      type: Number,
      required: true,
    },

    /**
     * Hide the tab bar
     */
    tabs: {
      type: Array,
      default: () => [{}],
    },

    /**
     * ID if the active tab
     */
    activeTabIndex: {
      type: Number,
      required: false,
      default: () => 0,
    },

    /**
     * Hide the tab bar
     */
    showTabBar: {
      type: Boolean,
      default: () => true,
    },

    /**
     * Hide the tab bar
     */
    resizing: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },

  computed: {
    activeTab () {
      if (this.activeTabIndex >= 0 && this.activeTabIndex < this.tabs.length) {
        return this.tabs[this.activeTabIndex]
      }

      return undefined
    },

    resizingPlaceholderLogo () {
      const tab = this.activeTab
      if (tab && tab.logo) {
        return tab.logo
      }

      return '/applications/default_logo.jpg'
    },
  },

  methods: {
    ...mapActions({
      markTabAsLoaded: 'layout/markTabAsLoaded',
    }),

    /**
     * Is tab loaded?
     *
     * Tab is considered loaded if it was
     * activated in the current session
     *
     * We do this extra check to ensure that
     * we do not load pages on tabs/panels on app load
     *
     * @param {object} tab
     * @param {number} tabIndex
     * @returns {boolean}
     */
    isLoaded (tab, tabIndex) {
      return tab.loaded || tabIndex === this.activeTabIndex
    },

    handleAppSelection (app, tabIndex = -1) {
      const { name, url, icon, logo } = app.unify || {}
      const tab = {
        title: name || app.name || app.url,
        url,
        icon,
        logo,
      }

      this.$emit(tabIndex < 0 ? 'add-tab' : 'update-tab', { tab, tabIndex })
    },

    handleLoad (tabIndex) {
      this.markTabAsLoaded({ panelIndex: this.index, tabIndex })
    },
  },
}
</script>
<style lang="scss" scoped>
section {
  &.show-tab-bar {
    display: grid;
    grid-template-rows: 2rem auto;
  }

  div.tab-bar {
    align-self: end;
    overflow: hidden;
    height: 2rem;
  }

  div.resizing-placeholder {
    display: flex;
    height: 100%;
    width: 100%;
    background: $light;

    img {
      opacity: .1;
      max-width: 200px;
      margin: auto;
    }
  }

  div.content {
    width: 100%;
    height: 100%;

    &.app-selector-shown {
      overflow: auto;
    }

    iframe {
      background: $light;
      border: 0;
      width: 100%;
      height: 100%;
    }
  }
}

</style>
