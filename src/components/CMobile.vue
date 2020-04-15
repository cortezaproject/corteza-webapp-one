<template>
  <section
    v-if="tabsVisible"
    class="open-tabs"
  >
    <h4>{{ $t('app.general.openTabs') }}</h4>
    <button @click="handleAddTab()">
      + Add
    </button>
    <c-tab
      v-for="(tab, t) in tabs"
      :key="'tab'+ t"
      v-bind="tab"
      :active="activeTabIndex === t"
      :sticky="stickyTabs || tab.sticky || tabs.length === 1"
      mobile
      @activate-tab="handleActivateTab(t)"
      @close-tab="handleCloseTab(t)"
    />
  </section>
  <section
    v-else
    class="stretch"
  >
    <!--
      Important:
      in contrast to CPanel, we're using v-if here
      instead of v-show.

      There's no need to have multiple open <iframe>
      elements on mobile device
    -->
    <div
      v-if="activeTab"
      class="content"
      :class="{ 'app-selector-shown': !activeTab.url }"
    >
      <c-app-selector
        v-if="!activeTab.url"
        @selected="handleAppSelection($event, activeTabIndex)"
      />
      <iframe
        v-else
        :src="activeTab.url"
      />
    </div>
  </section>
</template>
<script>
import CAppSelector from './CAppSelector'
import CTab from './CTab'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    CAppSelector,
    CTab,
  },

  props: {
    tabsVisible: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      panels: 'layout/panels',
    }),

    tabs () {
      return this.panels[0].tabs
    },

    stickyTabs () {
      return this.panels[0].stickyTabs
    },

    activeTabIndex () {
      return this.panels[0].activeTabIndex
    },

    activeTab () {
      return this.tabs[this.activeTabIndex]
    },
  },

  methods: {
    ...mapActions({
      addPanelTab: 'layout/addTab',
      updatePanelTab: 'layout/updateTab',
      removePanelTab: 'layout/removeTab',
      activatePanelTab: 'layout/activateTab',
    }),

    handleAddTab () {
      this.addPanelTab({ panelIndex: 0 })
      this.$emit('update:tabsVisible', false)
    },

    handleCloseTab (tabIndex) {
      this.removePanelTab({ panelIndex: 0, tabIndex })
    },

    handleActivateTab (tabIndex) {
      this.activatePanelTab({ panelIndex: 0, tabIndex })
      this.$emit('update:tabsVisible', false)
    },

    handleAppSelection (app, tabIndex = -1) {
      const { name, url, icon, logo } = app.unify || {}
      const tab = {
        title: name || app.name || app.url,
        url,
        icon,
        logo,
      }

      this.updatePanelTab({ panelIndex: 0, tabIndex, tab })
    },
  },
}

</script>
<style lang="scss" scoped>

.content, iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.open-tabs {
  padding: 10px;

  h4, button {
    display: inline-block;
  }

  button {
    float: right;
    margin-top: 20px;
    border: 1px solid $secondary;
    background: $white;
    padding: 4px 10px;
    border-radius: 20px;
  }
}
</style>
