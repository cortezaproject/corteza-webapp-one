<template>
  <div id="roomselection">
    <span>To start a video call select from existing channels:</span>
    <div id="roomdropdown">
      <select v-model="channelID">
        <option v-for="(c) in channels"
                :key="c.ID"
                :value="c.ID">{{ c.name }}</option>
      </select>
    </div>
    <button :disabled="jitsi || (!channelID)"
            @click="onCreate">Join</button>
    <h4>OR</h4>
    <span>Create a  new room:</span>
    <input type="text" id="roomInputField" v-model="roomName" placeholder="Room name" />

    <button :disabled="jitsi || (cleanup(roomName).length === 0)"
            @click="onCreate">Create</button>

    <div ref="jitsiInterface"
         v-show="jitsi"
         class="jitsiInterface"></div>
  </div>
</template>
<script>
import auth from '@/mixins/auth'
import Vue from 'vue'
import LoadScript from 'vue-plugin-load-script'
import { mapGetters } from 'vuex'

Vue.use(LoadScript)

Vue.loadScript('https://meet.jit.si/external_api.js')

const domain = 'meet.jit.si'

export default {
  params: {
    user: {
      type: Object,
      required: true,
    },
  },

  mixins: [auth],

  data () {
    return {
      channelID: null,
      roomName: '',
      jitsi: null,
      channels: null,
    }
  },

  computed: {
    ...mapGetters({
      currentUser: 'auth/user',
    }),
  },

  beforeCreate () {
    this.$messaging.channelList().then((cc) => {
      // @todo make a proper filter & label
      this.channels = cc.filter((c) => c.name.length > 0)
    })
  },

  destroyed () {
    this.dispose()
  },

  methods: {
    dispose () {
      if (this.jitsi) {
        this.jitsi.dispose()
        this.jitsi = null
      }
    },

    cleanup (str) {
      return str.replace(/[^a-z0-9+]+/gi, '')
    },

    onCreate () {
      this.open({
        roomName: this.channelID || this.roomName,
        userDisplayName: this.currentUser.name || this.currentUser.username,
      })
    },

    onClose () {
      this.dispose()
    },

    removeJitsiAfterHangup () {
      this.dispose()
    },

    open ({ roomName, userDisplayName } = {}) {
      this.dispose()

      /* eslint-disable no-undef */
      this.jitsi = new JitsiMeetExternalAPI(domain, {
        roomName: `crust_${this.cleanup(roomName || 'unnamed')}`,
        width: '100%',
        height: '100%',
        parentNode: this.$refs.jitsiInterface,
        interfaceConfigOverwrite: {
          DEFAULT_BACKGROUND: '#232323',
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: '',
          SHOW_POWERED_BY: false,
          DEFAULT_REMOTE_DISPLAY_NAME: 'Fellow Cruster',
          DEFAULT_LOCAL_DISPLAY_NAME: userDisplayName || 'Anonymous',
          TOOLBAR_BUTTONS: [
            'microphone',
            'camera',
            'closedcaptions',
            'desktop',
            'fullscreen',
            'fodeviceselection',
            'hangup',
            'profile',
            'info',
            'recording',
            'settings',
            'tileview',
            'videoquality',
            'filmstrip',
            'invite',
            'shortcuts',
          ],
          SETTINGS_SECTIONS: [
            'devices',
            'language',
            'moderator',
            'profile',
            'calendar',
          ],
        },
      })

      // add an event listner to remove jitsi after the local party has hung up the call.
      // this is to remove the page that mentions slack after the rating page.
      this.jitsi.addEventListeners({
        readyToClose: this.removeJitsiAfterHangup,
      })

      window.jitsi = this.jitsi
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";

html, body {
  margin: 0;
  overflow: hidden;
}

.jitsiInterface {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #232323;

  & > iframe {
    flex: 1 1 auto;
  }
}

#roomselection {
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background-color: #fff;
  font-family: Arial;
}

input {
  height: 30px;
  width: 100%;
  border: 1px solid $appgrey;
  padding-left: 10px;
  font-size: 14px;
  display: block;
  margin-top: 10px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

select {
  height: 30px;
  width: 100%;
  margin-top: 10px;
  background: transparent;
  padding-left: 10px;
  font-size: 14px;
  -webkit-border-radius:0px;
  -moz-border-radius:0px;
  border-radius:0px;
  -webkit-appearance:none;
  -moz-appearance:none;
  appearance:none;
  border: 1px solid $appgrey;
}

#roomdropdown::after {
  border: 4px dashed transparent;
  border-top: 4px solid $appgrey;
  content: "";
  display: inline-block;
  float: right;
  margin-right: 10px;
  margin-top: -15px;
}

select:focus,
input:focus {
  outline: none;
}

button {
  cursor: pointer;
  background: transparent;
  color: $appblue;
  font-size: 14px;
  line-height: 38px;
  text-decoration: none;
  display: block;
  width: 150px;
  text-align: center;
  height: 40px;
  margin: 20px auto 0;
  -webkit-transition: color .2s,background-color .2s;
  transition: color .2s,background-color .2s;
  border: 1px solid $appblue;
  &:hover {
    border: 1px solid $appblue;
    background: $appblue;
    color: #ffffff;
  }
  &:disabled {
    cursor: not-allowed;
    color: $appgrey;
    border-color: $appgrey;
    &:hover {
      background: transparent;
    }
  }
}

h4 {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 30px 0;
  color: $appgrey;
  &:before,
  &:after {
    content: '';
    border-top: 1px solid $appgrey;
    margin: 0 20px 0 0;
    flex: 1 0 20px;
  }
  &:after {
    margin: 0 0 0 20px;
  }
}

</style>
