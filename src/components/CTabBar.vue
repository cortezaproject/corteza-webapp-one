<template>
  <div
    class="tab-bar"
    :class="{ overflowing }"
  >
    <div
      class="scroll-wrap scroll-left-wrap"
    >
      <button
        v-if="overflowing && !resizing"
        class="scroll"
        @click="handleScroll(-1)"
      >
        &lt;
      </button>
    </div>
    <div
      ref="tabs-wrap"
      class="tabs-wrap"
    >
      <draggable
        filter=".sticky"
      >
        <c-tab
          v-for="(tab, i) in tabs"
          :key="i"
          ref="tab"
          v-bind="tab"
          :active="activeTabIndex === i"
          :sticky="staticTabs || tab.sticky || tabs.length === 1"
          @activate-tab="handleActivateTab(i)"
          @close-tab="handleCloseTab(i)"
        />
        <button
          v-if="!staticTabs && !overflowing && !resizing"
          class="add sticky"
          @click="handleAddTab()"
        >
          +
        </button>
      </draggable>
    </div>
    <div
      class="scroll-wrap scroll-right-wrap"
    >
      <button
        v-if="overflowing && !resizing"
        class="scroll"
        @click="handleScroll(1)"
      >
        &gt;
      </button>
      <button
        v-if="!staticTabs && overflowing && !resizing"
        class="add"
        @click="$emit('add-tab')"
      >
        +
      </button>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import CTab from './CTab'

export default {
  components: {
    CTab,
    draggable,
  },

  props: {
    /**
     * Do not allow adding, moving, removing tabs
     */
    index: {
      type: Number,
      required: true,
    },

    /**
     * Pre-seeded tabs
     */
    tabs: {
      type: Array,
      required: false,
      default: () => [],
    },

    activeTabIndex: {
      type: Number,
      required: false,
      default: () => 0,
    },

    /**
     * Do not allow to add or remove tabs
     */
    staticTabs: {
      type: Boolean,
      required: false,
      default: () => false,
    },

    /**
    /**
     * Do not allow adding, moving, removing tabs
     */
    resizing: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },

  data () {
    return {
      overflowing: false,
    }
  },

  mounted () {
    this.$root.$on('panels-resized', () => this.handleResize())
    this.handleResize()
  },

  methods: {
    /**
     * Intercepting events so we can properly handle overflow
     */
    handleAddTab () {
      this.$emit('add-tab')
      this.handleResize()
    },

    /**
     * Intercepting events so we can properly handle overflow
     */
    handleCloseTab (tabIndex) {
      this.$emit('close-tab', tabIndex)
      this.handleResize()
    },

    handleActivateTab (tabIndex) {
      this.$emit('activate-tab', tabIndex)
      // @todo calculate position of the activated tab and scroll to it
      //       note: scrollIntoView() does not work for this situation
    },

    handleResize () {
      this.$nextTick(() => {
        // element present?
        if (!this.$refs['tabs-wrap']) return
        const { clientWidth, scrollWidth } = this.$refs['tabs-wrap']

        // scrolling?
        this.overflowing = clientWidth < scrollWidth
      })
    },

    handleScroll (mod = 0) {
      if (!this.$refs['tabs-wrap']) return
      this.$refs['tabs-wrap'].scrollBy({ left: 100 * mod, behavior: 'smooth' })
    },
  },
}
</script>
<style lang="scss" scoped>
.tab-bar {
  display: grid;
  grid-template-columns: 2rem auto;
  box-shadow: 0 0.1rem 0.2rem 0 rgba(30,34,36,.1);

  &.overflowing {
    grid-template-columns: 2rem auto 4rem;
  }

  .tabs-wrap {
    overflow: hidden;
    white-space: nowrap;
    height: 2rem;
  }

  button {
    cursor: pointer;
    border: none;
    background: $white;
    vertical-align: middle;
    &.add {
      width: 2.5rem;
      font-size: 1.3rem;
      color: $primary;
    }
    &.scroll {
      font-size: 1rem;
      color: $secondary;
    }
  }

  .scroll-wrap {
    &.scroll-right-wrap {
      text-align: right;
    }
  }
}
</style>
