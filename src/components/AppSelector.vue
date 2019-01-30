<template>
  <div
    class="selector app-list" v-if="displayed"
    :class="fullscreen?'fullscreen':'tabbed'">
    <span
      class="new-app-closer"
      v-if="!firstApp"
      @click="$emit('close')"><i class="icon-close"></i></span>
    <!--<section class="app-section popular">
      <div class="section-title">Most popular</div>
      <ul :class="[ 'available-apps' ]">
        <li
          v-for="(appIndex, index) in popular_apps"
          :class="[ 'available-app' ]"
          :key="index">
          <AppSelectorItem
            :crustapp="available_apps[appIndex]"
            :paneId="paneId"
            :appIndex="appIndex"
            v-on:doadd="addApp(available_apps[appIndex], paneId)"/>
        </li>
      </ul>
    </section>-->
    <section class="app-section available">
      <div class="section-title">Available applications</div>
      <ul :class="[ 'available-apps' ]">
        <li
          v-for="(crustapp, index) in available_apps"
          :class="[ 'available-app' ]"
          :key="index"
          v-if="-1 === popular_apps.indexOf(index)">
          <AppSelectorItem
            :crustapp="crustapp"
            :paneId="paneId"
            :appIndex="index"
            v-on:doadd="addApp(crustapp, paneId)" />
        </li>
      </ul>
    </section>
    <modal v-if="chooseDisposition" @close="addApp">
      <h3 slot="header">Where should we add it ?</h3>
      <div class="chooseDisposition">
        <ul class="split2ways">
          <li class="h"></li>
        </ul>
      </div>
    </modal>
  </div>
</template>

<script>
import Modal from '@/components/Modal'
import AppSelectorItem from '@/components/AppSelectorItem'
import { mapGetters } from 'vuex'

export default {
  directives: {},

  components: {
    Modal,
    AppSelectorItem,
  },

  computed: {
    ...mapGetters({
      currentUser: 'auth/user',
    }),
  },

  methods:
  {
    // no fat arrow
    // https://stackoverflow.com/a/43073924
    addApp: function (availableApp, paneId) {
      this.$logger.log('adding app in selector')
      // if we have a paneId,
      // nothing to do, just send add-app
      // otherwise we need to know how to dispose panes,
      // if this is not the first app.
      this.$logger.log('paneId :' + paneId)
      if (!this.firstApp && paneId === null) {
        this.chooseDisposition = true
        return
      }
      this.$emit('add-app', {
        app: availableApp,
        paneId: paneId,
      })
    },
  },

  props:
  {
    paneId:
    {
      type: Number,
      required: false,
      default: null,
    },
    displayed:
    {
      type: Boolean,
      required: false,
      default: false,
    },
    fullscreen:
    {
      type: Boolean,
      required: false,
      default: false,
    },
    // if true this is the first app we add,
    // we cannot close the app window selection
    // and we do not need to ask disposition.
    firstApp:
    {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data: function () {
    return {
      // if this is not the first app we will use this structure to
      // add data need to add the tab (chosen orientation and position)
      app_to_add: null,
      chooseDisposition: false,
      // app struct
      // must have name,
      // may have color (defaults to $appgrey)
      // may have icon (has precedence over images)
      // may have an image, if no image nor icon,text will take the whole space.
      // may have an array specifiying in what context the app can be opened, if unspecified will default "window"
      // allowed contexts are :
      //  - window (default) allows to be opened in new window, if other modes available a selection tooltip will alow to choose how to open.
      //  - tab : can be opened in tabs
      //  - external : specific for apps or executables
      //  - panel : can be opened in crust context
      // if apps can be opened in tabs they will be listed via the "+" in a panel context
      // if apps can be opened in panel/window or external they will be listed via the "+" in header
      popular_apps: [],
      available_apps: [],
    }
  },
  created () {
    this.available_apps = [
      {
        name: 'Crust Messaging',
        logo: require('@/assets/logos/crust.jpg'),
        icon: require('@/assets/logos/crust_favicon.png'),
        color: 'appyellow',
        path: '/messaging/',
        allowed_contextes: ['panel', 'tab', 'external'],
        method: 'iframe',
        showOptions: false,
      },
      {
        name: 'Crust CRM',
        color: 'appgreen',
        logo: require('@/assets/logos/crust.jpg'),
        icon: require('@/assets/logos/crust_favicon.png'),
        path: '/crm/',
        allowed_contextes: ['window', 'panel', 'tab', 'external'],
        method: 'iframe',
        showOptions: false, // should be initalised as false for all
      },
      {
        name: 'Corteza JitsiBridge',
        color: '',
        icon: require('@/assets/logos/jitsi_icon.png'),
        logo: require('@/assets/logos/jitsi.png'),
        path: '/jitsi.html?id=' + this.currentUser.ID + '&user=' + this.currentUser.email + '&name=' + this.currentUser.name,
        allowed_contextes: ['panel', 'tab'],
        showOptions: false,
      },
      {
        name: 'Google Maps',
        color: 'appblue',
        logo: require('@/assets/logos/google_maps.png'),
        icon: require('@/assets/logos/google_maps_icon.png'),
        path: 'https://maps.google.com/maps?width=100%&height=600&hl=es&q=Europe&ie=UTF8&t=&z=4&iwloc=B&output=embed',
        allowed_contextes: ['panel', 'tab'],
        method: 'iframe',
        showOptions: false,
      },
      {
        name: 'OpenStreetmap',
        color: '',
        icon: require('@/assets/logos/openstreetmap_icon.png'),
        logo: require('@/assets/logos/openstreetmap.png'),
        path: 'https://www.openstreetmap.org/export/embed.html?bbox=-11.228027343750002%2C38.39333888832238%2C16.303710937500004%2C51.631657349449995&amp;layer=mapnik',
        allowed_contextes: ['panel', 'tab'],
        showOptions: false,
      },
      {
        name: 'Etherpad from RiseUp',
        color: '',
        path: 'https://pad.riseup.net/',
        logo: require('@/assets/logos/etherpad.png'),
        allowed_contextes: ['panel', 'tab'],
        showOptions: false,
      },
      {
        name: 'Trading View',
        color: '',
        logo: require('@/assets/logos/tradingview.png'),
        path: 'https://www.crust.tech/test-chart/',
        allowed_contextes: ['panel', 'tab'],
        showOptions: false,
      },
      {
        name: 'Kansha Boards',
        icon: require('@/assets/logos/kansha_icon.png'),
        logo: require('@/assets/logos/kansha.png'),
        path: 'http://demo.kansha.org/kansha/SATORI+Project/0f97810e-4a20-468a-b068-4b6a81a88e62',
        allowed_contextes: ['panel', 'tab'],
        showOptions: false,
      },
      {
        name: 'Wiki',
        icon: require('@/assets/logos/bluespice_icon.jpeg'),
        logo: require('@/assets/logos/bluespice.png'),
        path: 'https://en.demo.bluespice.com/wiki/Main_Page',
        allowed_contextes: ['panel', 'tab'],
        showOptions: false,
      },
    ]
  },
}
</script>

<style scoped lang="scss">
  @import '@/assets/sass/_0.declare.scss';

  .new-app-closer
  {
    position: fixed;
    top: 10px;
    right: 15px;
    font-size: 32px;
  }

  .app-list
  {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: $appselectorbg;
    font-family: $crustregular;
    font-size: 10px;
    box-sizing: border-box;
    z-index: 99;
    overflow: hidden auto;
    padding-bottom: 30px;

    *
    {
      font-family: $crustregular;
      box-sizing: border-box;
    }

    .available-apps
    {
      list-style: none;
      padding: 10px;
      clear: both;
    }
  }

  .available-app
  {
    display: block;
    width: calc(50% - 10px);
    max-width: 180px;
    height: 115px;
    background-color: $appselectoritembg;
    float: left;
    margin: 5px;
    border-radius: 3px;
  }

  .section-title
  {
    font-size: 2.5em;
    margin-top: 50px;
    padding: 20px 15px 10px 15px;
    text-align: center;
    clear: both;
  }

  @media (min-width: $wideminwidth)
  {
    .section-title
    {
      padding-top: 60px;
    }

    .app-section
    {
      max-width: 4*(180px + 5px + 10px); // app width + margin + list padding
      margin: 0 auto;
    }
  }
</style>
