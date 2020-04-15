<template>
  <section
    ref="panel"
    :class="{ 'show-tab-bar': showTabBar }"
  >
    <c-tab-bar
      v-if="showTabBar"
      v-bind="$attrs"
      :tabs="tabs"
      :active-tab="activeTab"
      v-on="$listeners"
    />
    <div
      v-for="(tab, i) in tabs"
      v-show="i === activeTab"
      :key="i"
      class="content"
      :class="{ 'app-selector-shown': !tab.url }"
    >
      <c-app-selector
        v-if="!tab.url"
        @selected="handleAppSelection($event, i)"
      />
      <iframe
        v-else
        :src="tab.url"
      />
    </div>
  </section>
</template>
<script>
import CTabBar from './CTabBar'
import CAppSelector from './CAppSelector'

export default {
  components: {
    CAppSelector,
    CTabBar,
  },

  props: {
    /**
     * Hide the tab bar
     */
    tabs: {
      type: Array,
      default: () => [{}],
    },

    activeTab: {
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
  },

  data () {
    return {}
  },

  methods: {
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
