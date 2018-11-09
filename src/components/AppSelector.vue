<template>
  <div
    class="selector app-list" v-if="displayed"
    :class="fullscreen?'fullscreen':'tabbed'">
    <span
      class="new-app-closer"
      v-if="!firstApp"
      @click="$emit('close')"><i class="icon-close"></i></span>
    <section class="app-section popular">
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
    </section>
    <section class="app-section available">
      <div class="section-title">Available</div>
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

export default {
  directives: {},

  components: {
    Modal,
    AppSelectorItem,
  },

  methods:
  {
    // no fat arrow
    // https://stackoverflow.com/a/43073924
    addApp: function (availableApp, paneId) {
      console.log('adding app in selector')
      // if we have a paneId,
      // nothing to do, just send add-app
      // otherwise we need to know how to dispose panes,
      // if this is not the first app.
      console.log('paneId :' + paneId)
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
      popular_apps: [ 0, 3, 6, 1 ],
      available_apps: [
        {
          name: 'Crust CRM',
          color: 'appgreen',
          // icon: 'icon-user',
          logo: require('@/assets/logos/crust.jpg'),
          path: 'https://example.com/',
          allowed_contextes: ['window', 'panel', 'tab', 'external'],
          method: 'iframe',
          showOptions: false, // should be initalised as false for all
        },
        {
          name: 'Crust Messaging',
          logo: require('@/assets/logos/crust.jpg'),
          icon: 'icon-bubble2',
          color: 'appyellow',
          path: '/messaging/',
          allowed_contextes: ['panel', 'tab', 'external'],
          method: 'iframe',
          showOptions: false,
        },
        {
          name: 'Maps',
          color: 'appblue',
          icon: 'icon-location',
          path: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d5548694.956216767!2d1.9195935488340492!3d47.2298136496854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x476531f5969886d1%3A0x400f81c823fec20!2sLjubljana%2C+Slovenia!3m2!1d46.056946499999995!2d14.505751499999999!4m5!1s0x480ede2fa7d69085%3A0x40ca5cd36e4ab30!2sRennes!3m2!1d48.117266!2d-1.6777925999999999!5e0!3m2!1sen!2sfr!4v1537822098803',
          allowed_contextes: ['panel', 'tab'],
          method: 'iframe',
          showOptions: false,
        },
        {
          name: 'Jira',
          color: '',
          logo: require('@/assets/logos/jira.png'),
          path: 'https://example.com/',
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'Carta Magna',
          color: '',
          path: 'https://example.com/',
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'Jenkins',
          logo: require('@/assets/logos/jenkins.png'),
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'Magna Aliqua UT LABORE',
          color: '',
          icon: 'icon-equalizer',
          path: 'https://example.com/',
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'Aliqua UT LABORE',
          color: '',
          icon: 'icon-files-empty',
          path: 'https://example.com/',
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'Venimud',
          color: 'appred',
          logo: 'https://picsum.photos/200/300',
          path: 'https://example.com/',
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'OwnCloud',
          logo: require('@/assets/logos/owncloud.png'),
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'Ut labore',
          path: 'https://example.com/',
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'Chemistry',
          logo: require('@/assets/logos/app-logo.jpg'),
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'TalkTalk',
          color: 'appred',
          icon: 'icon-bubbles',
          path: 'https://example.com/',
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: 'Archive',
          logo: require('@/assets/logos/archive.png'),
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
        {
          name: '123',
          allowed_contextes: ['panel', 'tab'],
          showOptions: false,
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
  // these values makes this standalone
  $wideminwidth:640px;
  $crustregular: sans-serif;
  $appyellow : #FFCC32;
  $appred    : #E85568;
  $appgreen  : #2FBC95;
  $appblue   : #1397CB;
  $applime   : #00D53E;
  $appgrey   : #90A3B1;
  $appcream  : #F3F3F5;
  $appselectorbg : #EDF1F4;
  $appselectoritembg : #FFF;
  // this is the global config
  @import '@/assets/sass/_0.declare.scss';

  .new-app-closer
  {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 32px;
  }

  .app-list
  {
    position: absolute;
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
