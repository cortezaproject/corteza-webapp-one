<template>
  <div
    v-if="loaded"
    class="d-flex flex-column w-100 vh-100"
  >
    <header
      class="mw-100"
    >
      <c-topbar
        hide-app-selector
        :sidebar-pinned="false"
        :labels="{
          helpForum: $t('help.forum'),
          helpDocumentation: $t('help.documentation'),
          helpFeedback: $t('help.feedback'),
          helpVersion: $t('help.version'),
          userSettingsLoggedInAs: $t('userSettings.loggedInAs', { user }),
          userSettingsProfile: $t('userSettings.profile'),
          userSettingsChangePassword: $t('userSettings.changePassword'),
          userSettingsLogout: $t('userSettings.logout'),
        }"
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
  i18nOptions: {
    namespaces: 'navigation',
  },

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
    logo () {
      return this.$Settings.attachment('ui.mainLogo', logo)
    },

    user () {
      const { user } = this.$auth
      return user.name || user.handle || user.email || ''
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
