<template>
  <div class="workspace">
    <Header :user="user"
      :optionalAdd="hasPanes"
      v-on:apps="showapps=true" />
      <!-- if user exists display interface -->
      <template v-if="isAuthenticated">
        <Layout
          v-model="panes"
          :user="user" />
        <app-selector
          :displayed="!hasPanes || showapps"
          :firstApp="!hasPanes"
          :fullscreen="true"
          v-on:close="showapps=false"
          v-on:add-app="addTab"></app-selector>
      </template>
      <!-- if user does not exist show loginform -->
      <div class="login" v-else>
        <LoginForm />
      </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Layout from '@/components/Layout.vue'
import AppSelector from '@/components/AppSelector.vue'
import LoginForm from '@/components/LoginForm.vue'

import { mapGetters } from 'vuex'

export default {
  components:
  {
    Header,
    Layout,
    AppSelector,
    LoginForm,
  },

  methods:
  {
    addTab (appData) {
      console.log('Adding a app from WkS')
      console.log(appData)
      this.$store.commit('panes/addApp', appData)
    },
    connect () {
      this.$store.commit('user/connectUser')
    },
  },

  computed:
  {
    ...mapGetters('auth', [
      'user',
      'isAuthenticated',
    ]),
    hasPanes:
    {
      get () {
        console.log('currently : ' + this.$store.state.panes.items.length + ' panes')
        return (this.$store.state.panes.items.length > 0)
      },
    },
    panes:
    {
      get () {
        console.log('WkS getting panes')
        return this.$store.state.panes
      },
      /*
      set (tabs) {
        this.$store.commit('panes/updateTabs', tabs);
      }
      */
    },
  },
  data ()
  {
    return {
      showapps: false,
    }
  },
}
</script>

<style lang="scss" scoped>
  .login
  {
    height: 100vh;
    width: 100%;
  }
</style>
