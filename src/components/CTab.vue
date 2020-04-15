<template>
  <div class="wrap">
    <div
      class="tab"
      :class="{ 'active': active, 'sticky': sticky }"
      @click.prevent="$emit('activate-tab')"
    >
      <div
        v-if="icon"
        class="icon"
        :style="iconStyle"
      />
      <div
        class="label"
      >
        <slot>{{ title || $t('layout.defaultTabTitle') }}</slot>
      </div>
      <button
        v-if="!sticky"
        class="close"
        @click.prevent="$emit('close-tab')"
      >
        &times;
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: () => '',
    },

    active: {
      type: Boolean,
      required: false,
      default: () => false,
    },

    /**
     * Can this tab be moved?
     */
    sticky: {
      type: Boolean,
      required: false,
      default: () => false,
    },

    icon: {
      type: String,
      required: false,
      default: () => undefined,
    },
  },

  data () {
    return {}
  },

  computed: {
    iconStyle () {
      return {
        'background-image': 'url(' + this.icon + ')',
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.wrap {
  display: inline-flex;
}

.tab {
  overflow: hidden;
  border: 1px solid $light;
  border-bottom: 2px solid $light;
  cursor: pointer;
  color: $secondary;
  font-family: $regular;
  font-size: .8rem;
  border-radius: 10px 10px 0 0;
  background: $light;
  padding: 0 0 0 .5rem;
  height: 1.7rem;
  margin-top: .1rem;

  &:active, &.active {
    color: $dark;
    border-bottom: 3px solid $primary;
    background: $white;
  }

  > * {
    display: inline-block;
    height: 1.8rem;
    vertical-align: middle;
  }

  .icon {
    width: 2rem;
    background-size: 1rem;
    background-position: center;
    background-repeat: no-repeat;
  }

  .label {
    max-width: 20rem;
    min-width: 6rem;
    margin-left: .2rem;
    line-height: 2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button.close {
    border: 0;
    font-size: 1rem;
    color: $secondary;
    background: transparent;

    &:hover {
      cursor: pointer;
      transform: scale(1.2);
    }
  }
}

</style>
