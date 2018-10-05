<template>
  <div class="workspace">
    <Header :user="user"
      :optionalAdd="hasPanes"
      v-on:apps="showapps=true" />
    <Layout
      v-model="panes"
      :user="user" />
    <app-selector
      :displayed="!hasPanes || showapps"
      :canClose="hasPanes"
      :fullscreen="true"
      v-on:close="showapps=false"
      v-on:add-app="addTab"></app-selector>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Layout from '@/components/Layout.vue'
import AppSelector from '@/components/AppSelector.vue'

export default {
  components:
  {
    'Header': Header,
    'Layout': Layout,
    AppSelector,
  },

  methods:
  {
    addTab (appData) {
      console.log('Adding a app from WkS')
      console.log(appData)
      this.$store.commit('addApp', appData)
    },
  },

  computed:
  {
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
        this.$store.commit('updateTabs', tabs);
      }
      */
    },
  },
  data ()
  {
    return {
      user: {
        id: '01234567891',
        has_notifications: false,
        username: 'BetaUser',
        avatar: '',
      },
      showapps: false,
    }
  },
}
</script>

<style>
*
{
  margin:0;
  padding:0;
}
</style>
