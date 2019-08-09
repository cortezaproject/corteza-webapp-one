<template>
  <div class="workspace" v-if="$auth.is()">
    <Header :user="$auth.user"
      :optionalAdd="hasPanes"
      v-on:apps="showapps=true" />
    <!-- if user exists display interface -->
    <Layout
      v-model="panes" />
    <app-selector
      :displayed="!hasPanes || showapps"
      :firstApp="!hasPanes"
      :fullscreen="true"
      v-on:close="showapps=false"
      v-on:add-app="addTab"></app-selector>
  </div>
</template>

<script>
import Header from 'corteza-webapp-one/src/components/Header.vue'
import Layout from 'corteza-webapp-one/src/components/Layout.vue'
import AppSelector from 'corteza-webapp-one/src/components/AppSelector.vue'

export default {
  components: {
    Header,
    Layout,
    AppSelector,
  },

  data () {
    return {
      showapps: false,
    }
  },

  computed: {
    hasPanes: {
      get () {
        // this.$logger.log('currently : ' + this.$store.state.panes.items.length + ' panes')
        return (this.$store.state.panes.items.length > 0)
      },
    },

    panes: {
      get () {
        // this.$logger.log('WkS getting panes')
        return this.$store.state.panes
      },
      /*
      set (tabs) {
        this.$store.commit('panes/updateTabs', tabs);
      }
      */
    },
  },

  created () {
    this.$auth.check(this.$SystemAPI).catch(() => {
      this.$auth.open()
    })
  },

  methods: {
    addTab (appData) {
      this.$store.commit('panes/addApp', appData)
    },

    connect () {
      this.$store.commit('user/connectUser')
    },
  },
}
</script>
<style lang="scss" scoped>
.workspace {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
</style>
