<template>
  <div
    v-if="loaded"
    class="d-flex flex-column w-100 vh-100"
  >
    <header
      class="mw-100"
    >
      <c-topbar
        :sidebar-pinned="pinned"
        hide-app-selector
      />
    </header>

    <main class="d-flex h-100 overflow-hidden">
      <c-app-selector />
    </main>
  </div>

  <b-container
    v-else
    fluid
    class="d-flex justify-content-center vh-100 logo"
  >
    <img
      src="applications/default_logo.jpg"
      class="w-100 my-auto"
    >
  </b-container>
</template>

<script>
import { mapActions } from 'vuex'
import CAppSelector from '../components/CAppSelector'
import { components } from '@cortezaproject/corteza-vue'

const { CTopbar } = components

export default {
  components: {
    CAppSelector,
    CTopbar,
  },

  data () {
    return {
      // Are panels loaded?
      loaded: false,

      logo: 'applications/default_logo.jpg',

      pinned: false,
    }
  },

  created () {
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

        // Preload applications
        this.preloadApplications()

        this.loaded = true
      })
  },

  methods: {
    ...mapActions({
      preloadApplications: 'applications/load',
    }),
  },
}

</script>
<style lang="scss" scoped>
.logo {
  img {
    max-width: 50vw;
    animation: pulse 4.2s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 0;
    }
    65% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
