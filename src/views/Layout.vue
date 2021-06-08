<template>
  <div
    v-if="loaded"
    class="layout"
  >
    <header>
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
