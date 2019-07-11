<template>
  <VueDragResize ref="vdr" class="vdr-panel" :isActive="active" preventActiveBehavior :parentLimitation="false" :isDraggable="false"
                 :minw="0" :minh="0" :w="width" :h="height" :sticks="sticks ? [sticks] : []"
                 @resizing="onResize" @resizestop="onStopResize" @activated="onActivation">
    <div class="resizable-panel-content">
      <slot/>
    </div>
  </VueDragResize>
</template>

<script>
import VueDragResize from 'corteza-webapp-one/src/library/vue-drag-resize'

export default {
  name: 'ResizablePanel',

  components: {
    VueDragResize,
  },

  props: {
    active: {
      type: Boolean,
      required: true,
    },
    sticks: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 500,
    },
    height: {
      type: Number,
      default: 500,
    },
  },

  methods: {
    onResize (newRect) {
      this.$store.commit('panes/setResizing', true)
      this.$emit('resize', newRect)
    },

    onStopResize () {
      this.$store.commit('panes/setResizing', false)
      this.$emit('stopresize')
    },

    onActivation () {
      this.$emit('activated')
    },
  },
}
</script>

<style lang="scss">
  .vdr.vdr-panel {
    position: relative;
    max-width: 100vw;
    max-height: calc(100vh - 50px); /* exclude header */
    top: 0 !important;
    left: 0 !important;

    &::before {
      z-index: -2;
    }

    .vdr-stick {
      z-index: 4;
      width: 32px !important;
      height: 32px !important;
      border-radius: 50%;
      opacity: 1;
      cursor: grab;
      background-image:  url('data:image/png;base64,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');
      background-color: $warning;
      background-repeat: no-repeat;
      background-position: 6px 6px;
      background-size: 20px;
      border:none;
      -webkit-box-shadow: 0 0.1rem 0.2rem 0 rgba(30, 34, 36, 0.1);
      box-shadow: 0 0.1rem 0.2rem 0 rgba(30, 34, 36, 0.1);
    }
    .vdr-stick:hover {
      opacity: 0.5;
    }
    .vdr-stick-tr {
      top: -2px !important;
      right: -16px !important;
    }

    .vdr-stick-mr {
      right: -16px !important;
      margin-top: -4px !important;
    }

    .vdr-stick-bl {
      bottom: -16px !important;
      left: -16px !important;
    }

    .vdr-stick-bm {
      bottom: -16px !important;
      margin-left: -16px !important;
    }

    .vdr-stick-br {
      bottom: -16px !important;
      right: -16px !important;
    }
  }

  .resizable-panel-content {
    min-height: 0;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .resizable-panel-content > *:nth-child(2) {
    flex: 1 1 0;
  }

</style>
