<template>
  <div
    class="stretch"
    :class="{ 'multi-panel': enableMultiplePanels }"
  >
    <div
      ref="panels"
      class="panels"
      :style="panelsStyle"
    >
      <c-panel
        v-for="(panel, p) in visiblePanels"
        :key="p"
        v-bind="panel"
        :resizing="resizing"
        class="panel"
        :class="panelClasses(panel.index)"
        @add-tab="handlePanelTabAdd(panel.index, $event)"
        @update-tab="handlePanelTabUpdate(panel.index, $event)"
        @close-tab="handlePanelTabRemove(panel.index, $event)"
        @activate-tab="handlePanelTabActivate(panel.index, $event)"
      />
    </div>
    <nav class="draggable-area">
      <vue-draggable-resizable
        v-if="visiblePanels.length > 1"
        class="resize-handler"
        v-bind="dragHandleProps"
        @dragging="handleResize"
        @dragstop="handleResizeStop"
      >
        <svg
          viewBox="0 0 448 512"
        >
          <path
            class="drag-icon"
            d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"
          />
        </svg>
      </vue-draggable-resizable>
    </nav>
  </div>
</template>
<script>
import CPanel from './CPanel'
import VueDraggableResizable from 'vue-draggable-resizable'
import { mapGetters, mapActions } from 'vuex'

// Returns strings as-is (50%), appends px to numeric values
const dim = (n, fix = 0) => Number(n) ? (n + fix) + 'px' : n

export default {
  components: {
    CPanel,
    VueDraggableResizable,
  },

  props: {
    // mininum width for multiple panels
    multiPanelMinWindowWidth: {
      type: Number,
      default: () => 800,
    },
  },

  data () {
    return {
      windowWidth: undefined,
      windowHeight: undefined,
      offsetTop: 0,
      offsetLeft: 0,
      centerX: undefined,
      centerY: undefined,
      resizing: false,
    }
  },

  computed: {
    ...mapGetters({
      panels: 'layout/panels',
      visiblePanels: 'layout/visiblePanels',
      enableMultiplePanels: 'layout/enableMultiplePanels',
    }),

    dragHandleProps () {
      const w = 20
      const h = w

      return {
        resizable: false,
        parent: true,
        w,
        h,
        x: this.centerX - 300,
        y: this.centerY - 300,
      }
    },

    /**
     * Generates panel styles (grid-template columns & rows)
     *
     * One panel: no grid
     * Two panels: only columns
     * Three panels: columns & rows
     *
     * We're intentionaly not using "Xpx + auto" format
     * because of the height/overflow/scroll issues
     * in lower panels
     */
    panelsStyle () {
      const visible = this.visiblePanels.length
      const emp = this.enableMultiplePanels

      if (visible < 2 || !emp) {
        return {}
      }

      const columns = {
        'grid-template-columns':
          dim(this.centerX, this.offsetLeft) + ' ' +
          dim(this.windowWidth - this.centerX),
      }

      const rows = {
        'grid-template-rows':
          dim(this.centerY, this.offsetTop * -1) + ' ' +
          dim(this.windowHeight - this.centerY),
      }

      if (visible > 1 && emp) {
        // if panels visible & enabled, calculate orientation
        switch (true) {
          case visible > 2:
            // 3 or 4 panels, enable columns & rows
            return { ...columns, ...rows }

          case this.panels[1].visible:
            // top-right panel visible - 2 columns
            return columns

          case this.panels[2].visible:
            // bottom-left panel visible - 2 rows
            return rows
        }
      }

      return {}
    },

    /**
     * Assigns .span-rows class to
     * 2nd panel when there are 3 panels
     * @param index
     */
    panelClasses () {
      // quick checker if a specific panel is visible
      const hidden = (index) => !this.panels[index].visible

      return (index) => {
        const base = []

        if (this.resizing) {
          base.push('resizing')
        }

        if (index === 0) {
          base.push('primary')
        } else {
          base.push('extra')
        }

        if (this.visiblePanels.length === 3) {
          // three panels visible...
          // note: panel#0 is always visible
          switch (true) {
            case index === 0 && hidden(1):
              return [...base, 'span-columns']
            case index === 0 && hidden(2):
              return [...base, 'span-rows']
            case index === 1 && hidden(3):
              return [...base, 'span-rows']
          }
        }
        return base
      }
    },

    enableMultiplePanels () {
      return this.windowWidth >= this.multiPanelMinWindowWidth
    },
  },

  created () {
    const { width, height } = this.panels[0]
    this.centerX = width
    this.centerY = height
    this.$root.$emit('panels-resize')
    this.handleWindowResize()
  },

  mounted () {
    this.$nextTick(() => {
      this.handleWindowResize()
      window.addEventListener('resize', this.handleWindowResize)
    })
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.handleWindowResize)
  },

  methods: {
    ...mapActions({
      addPanelTab: 'layout/addTab',
      updatePanelTab: 'layout/updateTab',
      removePanelTab: 'layout/removeTab',
      activatePanelTab: 'layout/activateTab',
      setPanelSize: 'layout/setPanelSize',
    }),

    /**
     * Update coordinates of the grid center
     */
    handleResize (left, top) {
      this.resizing = true

      // Correct position with panel element offset (this takes
      // into account any top/left menu, toolbars etc..

      const draggableAreaOffset = 300
      // const handleW = 20
      // const handleH = 20

      this.centerX = left + draggableAreaOffset
      this.centerY = top + draggableAreaOffset

      // emit panel-resize to allow components
      // adjust their dimensions
      this.$root.$emit('panels-resize')
    },

    handleResizeStop () {
      // Stop resizing
      this.resizing = false

      // Send one last udpate
      this.$root.$emit('panels-resize')

      // And save the size of the 1st panel
      this.setPanelSize({
        panelIndex: 0,
        width: this.centerX,
        height: this.centerY,
      })
    },

    handleWindowResize () {
      this.windowWidth = window.innerWidth
      this.windowHeight = window.innerHeight

      if (this.$refs['panels'] !== undefined) {
        // We'll need panel offset for
        this.offsetTop = this.$refs['panels'].offsetTop
        this.offsetLeft = this.$refs['panels'].offsetLeft

        // Recalculate center when panels are loaded
        if (this.centerX === undefined) {
          this.centerX = (this.windowWidth + this.offsetLeft) / 2
        }

        if (this.centerY === undefined) {
          this.centerY = (this.windowHeight + this.offsetTop) / 2
        }
      }

      // emit panel-resize to allow components
      // adjust their dimensions
      this.$root.$emit('panels-resize')
    },

    handlePanelTabAdd (panelIndex, { tab } = { tab: {} }) {
      this.addPanelTab({ panelIndex, tab })
    },

    handlePanelTabUpdate (panelIndex, { tab, tabIndex }) {
      this.updatePanelTab({ panelIndex, tabIndex, tab })
    },

    handlePanelTabRemove (panelIndex, tabIndex) {
      this.removePanelTab({ panelIndex, tabIndex })
    },

    handlePanelTabActivate (panelIndex, tabIndex) {
      this.activatePanelTab({ panelIndex, tabIndex })
    },
  },
}
</script>
<style lang="scss" scoped>
.panels {
  display: block;
  width: 100%;
  height: 100%;

  .panel {
    &.extra {
      visibility: hidden;
    }
  }
}

.draggable-area {
  visibility: hidden;
}

.multi-panel {
  // Only support panels on big screens
  .panels {
    display: grid;

    .panel {
      background: $white;
      align-self: stretch;
      justify-items: stretch;
      border: 1px solid $light;
      border-top: none;

      &.span-rows {
        grid-row: span 2;
      }

      &.span-columns {
        grid-column: span 2;
      }

      &.extra {
        visibility: visible;
      }

      &.resizing {
        // This will prevent events from pointer
        // that can mess-up panel resizing
        pointer-events: none;
        border-bottom: 1px dashed $primary;
        border-right: 1px dashed $primary;
      }
    }
  }

  .draggable-area {
    visibility: visible;
    $offset: 300;
    $handle:  20;

    position: fixed;
    left: calc(#{$offset}px - #{$handle}px);
    top: calc(#{$offset}px);
    width: calc(100% - (#{$offset}px - #{$handle}px) * 2);
    height: calc(100% - (#{$offset}px - #{$handle}px) * 2);

    // Prevent pointer events
    // this makes area "invisible" to clicks and other pointer events
    pointer-events: none;

    .resize-handler {
      // Enable back pointer events
      // disabled on parent
      pointer-events: auto;

      cursor: move;
      border-top-right-radius: 10px;

      margin-left: 10px;
      margin-top: -10px;

      opacity: .1;

      color: $white;
      &:hover {
        opacity: 1;

        .drag-icon {
          fill: $primary;
        }
      }

      .drag-icon {
        fill: $dark;
      }
    }
  }
}

</style>
