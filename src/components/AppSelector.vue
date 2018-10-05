<template>
  <div
    class="selector app-list" v-if="displayed"
    :class="fullscreen?'fullscreen':'tabbed'">
    <div class="available-apps">
      <div class="welcome">
        <span v-if="!canClose">What should we start with ?</span>
        <span v-else>Choose an application</span>
        <span
          class="new-app-closer"
          v-if="canClose"
          @click="$emit('close')"><i class="icon-close"></i></span>
      </div>
      <ul>
        <li
          v-for="(crustapp, index) in available_apps"
          :class="[
            'available-app',
            (crustapp.color && crustapp.color !=='')?crustapp.color:'appgrey',
            {
                'in-tab' : crustapp.allowed_contextes.includes('tab')
            }]"
          :key="index">
          <v-popover
            class="popover-wrap"
            offset="-25"
            trigger="hover"
            placement="left">
            <div class="label-wrap"
              @click="$emit('add-app', {
                app: available_apps[index],
                paneId: paneId,
              })">
              <!-- icons have precedence -->
              <label
                v-if="crustapp.icon && crustapp.icon!==''"
                class="label-content app-icon"
                :class="crustapp.icon"></label>
              <!-- if no icon but logo -->
              <label
                v-else-if="crustapp.logo && crustapp.logo!==''"
                class="label-content app-logo">
                <i :style="'background-image:url(' + crustapp.logo + ');'" ></i></label>
              <!-- always a label, but may be 2 lined -->
              <label
                class='label-content app-text'
                :class="[ { rowspan2 : (!crustapp.icon || crustapp.icon === '') && (!crustapp.logo || crustapp.logo === '')  } ]">
                {{ crustapp.name }}
              </label>
            </div>
            <template slot="popover">
              new window
              <br>new tab
            </template>
          </v-popover>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { VTooltip, VPopover } from 'v-tooltip'

export default {
  directives: {
    'tooltip': VTooltip,
  },

  components: {
    'v-popover': VPopover,
  },

  methods:
  {
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
    canClose:
    {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data: function ()
  {
    return {
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
      available_apps: [
        {
          name: 'CRM',
          color: 'appgreen',
          // icon: 'icon-user',
          path: '/Messaging',
          allowed_contextes: ['window', 'panel', 'tab', 'external'],
        },
        {
          name: 'Messaging',
          icon: 'icon-bubble2',
          color: 'appyellow',
          path: 'https://latest.rustbucket.io/messaging/',
          allowed_contextes: ['panel', 'tab', 'external'],
          method: 'iframe',
        },
        {
          name: 'Shell',
          color: 'appblue',
          icon: 'icon-terminal',
          path: '/Messaging',
          allowed_contextes: ['panel', 'tab'],
        },
        {
          name: 'Magna Aliqua UT LABORE',
          color: '',
          icon: 'icon-equalizer',
          path: '/Messaging',
          allowed_contextes: ['panel', 'tab'],
        },
        {
          name: 'Venimud',
          color: 'appred',
          path: '/Messaging',
          logo: 'https://picsum.photos/200/300',
          allowed_contextes: ['panel', 'tab'],
        },
        {
          name: 'Ut labore',
          icon: 'icon-files-empty',
          path: '/Messaging',
          allowed_contextes: ['panel', 'tab'],
        },
      ],
    }
  },
}
</script>

<!-- don't scope this -->
<!-- using app-list as spillover limiter -->
<style lang="scss">
.app-list
{
  .available-app
  {
    .trigger // element of popover
    {
      max-width:100%;
      // display:block!important;
    }
  }
}
</style>

<!-- scopable parts -->
<style scoped lang="scss">
  $crustregular: sans-serif;
  $appyellow : #FFCC32;
  $appred    : #E85568;
  $appgreen  : #2FBC95;
  $appblue   : #1397CB;
  $applime   : #00D53E;
  $appgrey   : #90A3B1;
  $appcream  : #F3F3F5;

  @import '@/assets/sass/_0.declare.scss';

  .welcome
  {
    color:$appyellow;
    font-size:2.5em;
    margin-bottom:30px;
    clear:both;
    text-align:center;
    padding: 0 0 0 20px;
  }

  .app-list
  {
    position:absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background-color:black;
    font-family:$crustregular;
    font-size:10px;
    box-sizing:border-box;
    *
    {
      font-family:$crustregular;
      box-sizing:border-box;
    }
  }

  .available-app
  {
    width:200px;
    height:100px;
    color:white;
    background-color:$appgrey;
    text-align:center;
    line-height:50px;
    margin:10px auto;

    .trigger // element of popover
    {
      max-width:100%;
      display:block!important;
    }

    .label-content
    {
      display:inline-block;
      width:100%;
      color:white;
      line-height:1;
      padding:5px;
      vertical-align:top;
      text-decoration:none;
      &:first-child
      {
        vertical-align:bottom;
      }
      &.app-logo
      {
        i
        {
          margin-top:0.5vh;
          height:4vh;
          width:4vh;
          display:inline-block;
          background:#000;
          background-repeat:no-repeat;
          background-size:cover;
          border-radius:50%;
        }
      }
      &.app-text, &.app-icon
      {
        font-size:2.4em;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        max-width:100%;
      }
      &.rowspan2
      {
        line-height:90px; //9 because of 5px padding
      }
    }
    &:last-of-type
    {
      margin-bottom:0;
    }
  }

  .available-app.appyellow
  {
    background-color:$appyellow;
  }

  .available-app.appred
  {
    background-color:$appred;
  }

  .available-app.appgreen
  {
    background-color:$appgreen;
  }

  .available-app.appblue
  {
    background-color:$appblue;
  }

  .available-app.appgrey
  {
    background-color:$appgrey;
  }

  .available-app.applime
  {
    background-color:$applime;
  }

  .available-app.appcream
  {
    background-color:$appcream;
  }

  //media query should go here
  .available-apps
  {
    margin:20% auto 0 auto;
    max-width:640px;
    min-width:320px;
    position: static;
    top: -25%;
    transform: translateY(-50%);
  }

  .new-app-closer
  {
    float:right;
    top:3em;
    right:3em;
    // font-size:3em;
    color:white;
    margin-right: 20px;
  }

  .available-app
  {
    width:30%;
    min-width:100px;
    max-width:200px;
    display:block;
    float:left;
    margin:0 20px 20px 0;
    border-radius:5px;
    &:nth-child(3n)
    {
      clear:right;
      margin-right:0;
    }
    &:nth-child(3n+1)
    {
      clear:left;
    }
  }
</style>

<!-- style for popover -->
<style scoped lang="scss">
/*
  .fullscreen
  {
    z-index:99;
  }

  .trigger
  {
    display:block!important;
  }

  .tooltip
  {
    display: block !important;
    display: none !important;
    z-index: 10000;

    .tooltip-inner {
      background: black;
      color: white;
      border-radius: 16px;
      padding: 5px 10px 4px;
    }

    .tooltip-arrow {
      width: 0;
      height: 0;
      border-style: solid;
      position: absolute;
      margin: 5px;
      border-color: #ccc;
      z-index: 1;
    }

    &[x-placement^="top"] {
      margin-bottom: 5px;

      .tooltip-arrow {
        border-width: 5px 5px 0 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        bottom: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="bottom"] {
      margin-top: 5px;

      .tooltip-arrow {
        border-width: 0 5px 5px 5px;
        border-left-color: transparent !important;
        border-right-color: transparent !important;
        border-top-color: transparent !important;
        top: -5px;
        left: calc(50% - 5px);
        margin-top: 0;
        margin-bottom: 0;
      }
    }

    &[x-placement^="right"] {
      margin-left: 5px;

      .tooltip-arrow {
        border-width: 5px 5px 5px 0;
        border-left-color: transparent !important;
        border-top-color: transparent !important;
        border-bottom-color: transparent !important;
        left: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }

    &[x-placement^="left"] {
      margin-right: 5px;

      .tooltip-arrow {
        border-width: 5px 0 5px 5px;
        border-top-color: transparent !important;
        border-right-color: transparent !important;
        border-bottom-color: transparent !important;
        right: -5px;
        top: calc(50% - 5px);
        margin-left: 0;
        margin-right: 0;
      }
    }

    &.popover {
      $color: #f9f9f9;

      .popover-inner {
        background: $color;
        color: black;
        padding: 24px;
        border-radius: 5px;
        box-shadow: 0 5px 30px rgba(black, .1);
      }

      .popover-arrow {
        border-color: $color;
      }
    }

    &[aria-hidden='true'] {
      visibility: hidden;
      opacity: 0;
      transition: opacity .15s, visibility .15s;
    }

    &[aria-hidden='false'] {
      visibility: visible;
      opacity: 1;
      transition: opacity .15s;
    }
  }
*/
</style>