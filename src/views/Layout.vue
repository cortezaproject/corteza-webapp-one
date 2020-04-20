<template>
  <div
    v-if="loaded"
    class="layout"
  >
    <header>
      <div class="logo">
        <img :src="logo">
      </div>
      <div class="settings">
        <c-user-settings />
        <i
          v-if="mobile"
          class="icon-menu1"
          @click="mobileTabsVisible = !mobileTabsVisible"
        />
        <c-panel-settings
          v-else
        />
      </div>
    </header>
    <c-mobile
      v-if="mobile"
      :tabs-visible.sync="mobileTabsVisible"
    />
    <c-panels
      v-else
      ref="panels"
      :width="windowWidth - panelOffsetLeft"
      :height="windowHeight - panelOffsetTop"
    />
  </div>
  <div
    v-else
    class="loader-logo"
  >
    <img :src="logo">
  </div>
</template>
<script>
import CPanelSettings from '../components/CPanelSettings'
import CUserSettings from '../components/CUserSettings'
import CPanels from '../components/CPanels'
import CMobile from '../components/CMobile'
import { mapGetters, mapActions } from 'vuex'

const mobileMaxWidth = 450

export default {
  components: {
    CMobile,
    CPanelSettings,
    CUserSettings,
    CPanels,
  },

  data () {
    return {
      // Are panels loaded?
      loaded: false,

      // Window dimensions & panel position
      windowWidth: undefined,
      windowHeight: undefined,
      panelOffsetTop: 0,
      panelOffsetLeft: 0,

      // Are be mobile tabs visible
      //
      // this is set when user clicks on top-right icon
      // on mobile view
      mobileTabsVisible: false,

      logo: '/applications/default_logo.jpg',
    }
  },

  computed: {
    ...mapGetters({
      layoutLoaded: 'layout/loaded',
    }),

    mobile () {
      return this.windowWidth <= mobileMaxWidth
    },
  },

  created () {
    window.addEventListener('resize', this.handleWindowResize)

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
      // Load UI settings (layout, logo)
      .then(() => this.$Settings.init({ api: this.$SystemAPI }))
      .then(({ ui: { one = {} } }) => {
        const localAttachment = /^attachment:(\d+)/
        if (one.logo && localAttachment.test(one.logo)) {
          // Assuming that this is URL to an uploaded image file
          const [, attachmentID] = localAttachment.exec(one.logo)

          this.logo = this.$SystemAPI.baseURL +
            this.$SystemAPI.attachmentOriginalEndpoint({
              attachmentID,
              kind: 'settings',
              name: 'logo',
            })
        }

        if (!this.layoutLoaded && one) {
          this.setLayout(one)
          this.$root.$emit('panels-resize')
        }

        // Preload applications
        this.preloadApplications()
      })
      .finally(() => {
        this.handleWindowResize()
        this.loaded = true
      })
  },

  mounted () {
    this.$nextTick(() => {
      this.handleWindowResize()
    })
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.handleWindowResize)
  },

  methods: {
    ...mapActions({
      setLayout: 'layout/set',
      preloadApplications: 'applications/preload',
    }),

    handleWindowResize () {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight

      if (this.$refs['panels'] !== undefined) {
        const { offsetTop = 0, offsetLeft = 0 } = this.$refs['panels'].$el

        this.panelOffsetTop = offsetTop
        this.panelOffsetLeft = offsetLeft
      }
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

    // Make sure header (and all panels that might float over
    // child elements) is not covered by panels
    z-index: 1000;

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

    .icon-menu1 {
      margin: 10px 8px 0;
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
