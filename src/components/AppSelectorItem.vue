<template>
  <div
    class="app-wrap"
    :class="[ { active : crustapp.showOptions } ]"
    @touch="crustapp.showOptions=!crustapp.showOptions">
    <div class="app-label">
      <!-- logos have precedence -->
      <label
        v-if="crustapp.logo && crustapp.logo!==''"
        class="app-visual app-logo">
        <i :style="'background-image:url(' + crustapp.logo + ');'" ></i></label>
      <!-- if no logo but icon -->
      <label
        v-else-if="crustapp.icon && crustapp.icon!==''"
        class="app-visual app-icon">
        <i :class="crustapp.icon"></i></label>
      <!-- if no logo or icon : first letter of app -->
      <label
        v-else
        class="app-visual app-letter">
        <i>{{ crustapp.name[0] }}</i></label>
      <!-- and the name -->
      <label
        class='app-text'>
        {{ crustapp.name }}
      </label>
    </div>
    <!-- this should appear on hover -->
    <div class="app-display-options">
      <div class="display-option"><a class="link" @click="$emit('doadd')">{{ $t('app.general.openTab') }}</a></div>
      <div class="display-option"><a class="link" target="_blank" :href="crustapp.url">{{ $t('app.general.openWindow') }}</a></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    paneId: {
      required: false,
      default: null,
    },
    appIndex: {
      type: Number,
      required: true,
    },
    crustapp: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped>
  $appheight: 115px;
  $appvisualheight: 80px;

  .app-visual,
  .app-text,
  .app-display-options {
    display: block;
    text-align: center;
  }

  .app-text {
    line-height: $appheight - $appvisualheight;
    color: $secondary;
    font-size: 15px;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 auto;
  }

  .app-visual {
    height: $appvisualheight;
    line-height: $appvisualheight;
    transition: opacity 0.5s;
  }

  .app-display-options {
    line-height: $appheight/2;
    transition: opacity 0.75s;
    opacity: 0;

    .display-option {
      border: solid 1px $white;
      padding: 0;
      font-size: 11px;
      line-height: 1;
      border-radius: $appheight/2;
      margin: 5px auto;
      max-width: 80%;
      color: $black;

      .link {
        color: darken($secondary, 25);
        text-decoration: none;
        display: inline-block;
        width: 100%;
        padding: 5px;
        cursor: pointer;
      }

      &:hover {
        background-color: $secondary;
        border-color: $white;

        .link {
          color: $white;
        }
      }
    }
  }

  .app-logo {
    i {
      top: 50%;
      transform: translateY(10px);
      display: block;
      height: $appvisualheight - 10px;
      max-width: 75%;
      margin: 0 auto;
      border-radius: 3px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position-x: center;
      background-position-y: center;
    }
  }

  .app-icon,
  .app-letter {
    color: $white;
    padding-top: 10px;

    i {
      color: $white;
      display: block;
      width: 64px;
      height: 64px;
      line-height: 64px;
      margin: 0 auto;
      background-color: $secondary;
      font-size: 32px;
      font-style: normal;
    }
  }

  .app-letter i {
    font-weight: 600;
  }

  .app-wrap {
    min-height: 115px;
    max-height: 115px;
    max-width: 100%;
    overflow: hidden;

    .app-label {
      transition: all 0.2s;
    }

    &:hover,
    &:focus {
      .app-label {
        margin-top: -70px;
      }

      .app-visual {
        opacity: 0;
      }

      .app-display-options {
        opacity: 1;
      }
    }
  }

  @media (min-width: $wideminwidth) {
    .app-display-options {
      .display-option {
        font-size: 13px;
      }
    }
  }
</style>
