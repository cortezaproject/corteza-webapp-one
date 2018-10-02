<template>
  <div
    class="selector app-list" v-if="displayed"
    :class="fullscreen?'fullscreen':'tabbed'">
    <ul class="crust-available-apps clearfix">
      <li

        v-for="(crustapp, index) in available_apps"
        :class="[ 'crust-available-app', (crustapp.color && crustapp.color !=='')?crustapp.color:'appgrey', { 'in-tab' : crustapp.allowed_contextes.includes('tab') } ]"
        :key="index">
        <v-popover
          offset="-25"
          trigger="hover"
          placement="left">
          <div class="label-wrap">
            <!-- icons have precedence -->
            <label
              v-if="crustapp.icon && crustapp.icon!==''"
              class="app-icon"
              :class="crustapp.icon"></label>
            <!-- if no icon but logo -->
            <label
              v-else-if="crustapp.logo && crustapp.logo!==''"
              class="app-logo">
              <i :style="'background-image:url(' + crustapp.logo + ');'" ></i></label>
            <!-- always a label, but may be 2 lined -->
            <label
              class='app-label'
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
    <span class="new-app-closer" @click="$emit('close')"><i class="icon-close"></i></span>
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

  props:
  {
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
        { name: 'CRM', color: 'appgreen', icon: 'icon-user', path: '/Messaging', allowed_contextes: ['window', 'panel', 'tab', 'external'] },
        { name: 'Messaging', color: 'appyellow', path: '/Messaging', allowed_contextes: ['panel', 'tab', 'external'] },
        { name: 'Shell', color: 'appblue', icon: 'icon-terminal', path: '/Messaging', allowed_contextes: ['panel', 'tab'] },
        { name: 'Magna Aliqua', color: '', icon: 'icon-equalizer', path: '/Messaging', allowed_contextes: ['panel', 'tab'] },
        { name: 'Venimud', color: 'appred', path: '/Messaging', logo: 'https://picsum.photos/200/300', allowed_contextes: ['panel', 'tab'] },
        { name: 'Ut labore', icon: 'icon-files-empty', path: '/Messaging', allowed_contextes: ['panel', 'tab'] },
      ],
    }
  },
}
</script>
<style lang="scss">

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
</style>

<style scoped lang="scss">
  @import '@/assets/sass/_0.declare.scss';

  *
  {
    font-family:$crustregular;
    box-sizing:border-box;
  }

  .selector
  {
    position:absolute;
    top:0;
    left:0;
    bottom:0;
    right:0;
    //width:100%;
    //height:100%;
    background-color:black;
  }

  .crust-available-app
  {
    width:80vw;
    height:10vh;
    color:white;
    background-color:red;
    text-align:center;
    line-height:5vh;
    margin:2vh auto;
    font-size:1.8rem;
    a, label
    {
      display:inline-block;
      width:100%;
      color:white;
      line-height:1;
      padding:0.5vh;
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
      &.app-label
      {
        font-size:1.2rem;
      }
      &.rowspan2
      {
        line-height:9vh; //9 because of 0.5 padding
      }
    }
    &:last-of-type
    {
      margin-bottom:0;
    }
  }

  .crust-available-app.appyellow
  {
    background-color:$appyellow;
  }

  .crust-available-app.appred
  {
    background-color:$appred;
  }

  .crust-available-app.appgreen
  {
    background-color:$appgreen;
  }

  .crust-available-app.appblue
  {
    background-color:$appblue;
  }

  .crust-available-app.appgrey
  {
    background-color:$appgrey;
  }

  .crust-available-app.applime
  {
    background-color:$applime;
  }

  .crust-available-app.appcream
  {
    background-color:$appcream;
  }

  //media query should go here
  .crust-available-apps
  {
    margin:20% auto 0 auto;
    max-width:640px;
  }

  .new-app-closer
  {
    position:absolute;
    top:3rem;
    right:3rem;
    font-size:3rem;
    color:white;
  }

  .crust-available-app
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
