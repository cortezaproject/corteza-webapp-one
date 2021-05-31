<template>
  <div
    v-if="loaded"
    class="layout"
  >
    <header>
      <div class="settings">
        <c-user-settings />
      </div>
      <c-topbar
        :sidebar-pinned="pinned"
      />
    </header>
    <c-app-selector />
  </div>
  <div
    v-else
    class="loader-logo"
  >
    <img :src="logo">
  </div>
</template>
<script>
import CUserSettings from '../components/CUserSettings'
import { mapGetters, mapActions } from 'vuex'
import CAppSelector from '../components/CAppSelector'
import { CTopbar } from '@cortezaproject/corteza-vue'

const mobileMaxWidth = 450

export default {
  components: {
    CUserSettings,
    CAppSelector,
    CTopbar,
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

      logo: 'applications/default_logo.jpg',

      pinned: false,
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

    // Load UI settings (layout, logo)
    this.$Settings.init({ api: this.$SystemAPI })
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
      preloadApplications: 'applications/load',
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
$header-height: 60px;

.layout {
  display: grid;
  grid-template-rows: $header-height auto;
  height: 100vh;
  width: 100vw;

  header {
    display: flex;
    align-items: center;
    height: $header-height;
    overflow: hidden;

    // Make sure header (and all panels that might float over
    // child elements) is not covered by panels
    z-index: 1000;

    .logo {
      flex-grow: 1;
      padding: 10px 10px;

      img {
        max-height: calc(#{$header-height} / 2);
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
