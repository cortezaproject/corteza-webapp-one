<template>
  <div class="workspace">
    <Header :user="user"
      v-on:apps="showapps=true" />
    <Layout :user="user" />
    <app-selector
      :displayed="showapps"
      :fullscreen="true"
      style="top:96px;"
      v-on:close="showapps=false"></app-selector>
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
