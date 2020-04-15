<template>
  <div
    v-if="loaded"
    class="layout"
  >
    <header>
      <div class="logo">
        <img
          src="/applications/crust.jpg"
        >
      </div>
      <div class="settings">
        <c-user-settings />
        <c-panel-settings />
      </div>
    </header>
    <c-panels
      class="stretch"
    />
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
import CPanelSettings from '../components/CPanelSettings'
import CUserSettings from '../components/CUserSettings'
import CPanels from '../components/CPanels'

export default {
  components: {
    CPanelSettings,
    CUserSettings,
    CPanels,
  },

  data () {
    return {
      loaded: false,
    }
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
    }
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
</style>
