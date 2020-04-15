<template>
  <div
    v-if="loaded"
    class="layout"
  >
    <header>
      <div class="logo">
        <img src="/applications/crust.jpg">
      </div>
      <div class="settings">
        <c-user-settings />
        <i
          class="icon-menu1"
          @click="tabsVisible = !tabsVisible"
        />
      </div>
    </header>
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
    <section v-else>
      <div
        v-for="(tab, t) in tabs"
        v-show="t === activeTabIndex"
        :key="t"
        class="content"
        :class="{ 'app-selector-shown': !tab.url }"
      >
        <c-app-selector
          v-if="!tab.url"
          @selected="handleAppSelection($event, t)"
        />
        <iframe
          v-else
          :src="tab.url"
        />
      </div>
    </section>
  </div>
  <div
    v-else
    class="loader-logo"
  >
    <img
      src="/applications/crust.jpg"
    >
  </div>
</template>
<script>
import CUserSettings from '../components/CUserSettings'
import CTab from '../components/CTab'
import { mapActions, mapGetters } from 'vuex'
import CAppSelector from '../components/CAppSelector'

export default {
  components: {
    CUserSettings,
    CTab,
    CAppSelector,
  },

  data () {
    return {
      loaded: false,
      tabsVisible: false,
    }
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
  },

  created () {
    this.loaded = false

    this.$auth.check()
      .then((user) => {
        if (!user) {
          // check performed: no error & no user,
          // redirect to auth
          throw new Error()
        }
      })
      .catch(() => {
        this.$auth.open()
      })
      .then(() => this.$Settings.init({ api: this.$SystemAPI }))
      .then((s) => {
        if (!this.$store.getters['layout/loaded'] && s && s.ui && s.ui.one) {
          this.$store.dispatch('layout/set', s.ui.one)
        }
      })
      .finally(() => {
        this.loaded = true
      })
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
      this.tabsVisible = false
    },

    handleCloseTab (tabIndex) {
      this.removePanelTab({ panelIndex: 0, tabIndex })
    },

    handleActivateTab (tabIndex) {
      this.activatePanelTab({ panelIndex: 0, tabIndex })
      this.tabsVisible = false
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
.layout {
  display: grid;
  grid-template-rows: 40px auto;
  height: 100vh;
  width: 100vw;

  header {
    display: flex;
    height: 40px;
    overflow: hidden;

    .logo {
      flex-grow: 1;
      padding: 10px 10px;

      img {
        max-height: 20px;
      }
    }

    & > .settings {
      align-content: flex-end;
      display: flex;
      .icon-menu1 {
        margin: 8px;
      }
    }
  }
  .content, iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
}
.loader-logo {
  display: flex;
  height: 100%;
  img {
    opacity: .6;
    max-width: 200px;
    margin: auto;
  }
}

.open-tabs {
  padding: 10px;
  h4,
  button {
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
