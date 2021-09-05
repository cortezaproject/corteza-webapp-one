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
        :labels="{
          helpForum: $t('navigation.help.forum'),
          helpDocumentation: $t('navigation.help.documentation'),
          helpFeedback: $t('navigation.help.feedback'),
          helpVersion: $t('navigation.help.version'),
          userSettingsLoggedInAs: $t('navigation.userSettings.loggedInAs', { user }),
          userSettingsProfile: $t('navigation.userSettings.profile'),
          userSettingsChangePassword: $t('navigation.userSettings.changePassword'),
          userSettingsLogout: $t('navigation.userSettings.logout'),
        }"
        hide-app-selector
      />
    </header>

    <main class="d-flex h-100 overflow-hidden">
      <c-app-selector />
    </main>
  </div>

  <c-loader-logo
    v-else
    :logo="logo"
  />
</template>

<script>
import { mapActions } from 'vuex'
import CAppSelector from '../components/CAppSelector'
import { components } from '@cortezaproject/corteza-vue'
import logo from 'corteza-webapp-one/src/themes/corteza-base/img/logo.png'

const { CTopbar, CLoaderLogo } = components

export default {
  components: {
    CAppSelector,
    CTopbar,
    CLoaderLogo,
  },

  data () {
    return {
      loaded: false,

      pinned: false,
    }
  },

  computed: {
    user () {
      const { user } = this.$auth
      return user.name || user.handle || user.email || ''
    },

    logo () {
      return this.$Settings.attachment('ui.mainLogo', logo)
    },
  },

  created () {
    this.loaded = false

    this.preloadApplications().then(() => {
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

</style>
