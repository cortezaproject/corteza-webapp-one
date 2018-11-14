<template>
  <VueDragResize ref="vdr" class="vdr-panel" isActive preventActiveBehavior :parentLimitation="false" :isDraggable="false"
                 :minw="0" :minh="0" :w="width" :h="height" :sticks="sticks ? [sticks] : []"
                 @resizing="onResize" @resizestop="onStopResize">
    <div class="resizable-panel-content">
      <slot/>
    </div>
  </VueDragResize>
</template>

<script>
import VueDragResize from '@/library/vue-drag-resize'

export default
{
  name: 'ResizablePanel',
  components:
    {
      VueDragResize,
    },
  props:
    {
      sticks:
        {
          type: String,
          default: '',
        },
      width:
        {
          type: Number,
          default: 500,
        },
      height:
        {
          type: Number,
          default: 500,
        },
    },
  methods:
    {
      onResize (newRect) {
        this.$store.commit('panes/setResizing', true)
        this.$emit('resize', newRect)
      },
      onStopResize () {
        this.$store.commit('panes/setResizing', false)
        this.$emit('stopresize')
      },
    },
}
</script>

<style lang="scss">
  .vdr.vdr-panel
  {
    position: relative;
    max-width: 100vw;
    max-height: calc(100vh - 6em); /* exclude header */
    top: 0 !important;
    left: 0 !important;

    &::before
    {
      z-index: -2;
    }

    .vdr-stick
    {
      z-index: 4;
      width: 50px !important;
      height: 50px !important;
      border-radius: 25px;
    }

    .vdr-stick-tr
    {
      top: -7px !important;
      right: -23px !important;
    }

    .vdr-stick-mr
    {
      right: -25px !important;
    }

    .vdr-stick-bl
    {
      bottom: -25px !important;
      left: -25px !important;
    }

    .vdr-stick-bm
    {
      bottom: -25px !important;
    }

    .vdr-stick-br
    {
      bottom: -41px !important;
      right: -23px !important;
    }
  }

  .resizable-panel-content
  {
    min-height: 0;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border: 1px dashed #D6D6D6;
  }

  .resizable-panel-content > *:nth-child(2)
  {
    flex: 1 1 0;
  }

</style>
