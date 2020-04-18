<template>
  <div
    class="panels"
  >
    <i
      class="icon-grid-interface-open"
    />
    <form>
      <span>{{ $t('header.layoutSwitcherTitle') }}</span>
      <div class="switcher">
        <button
          v-for="({ img, mask }, g) in grid"
          :key="g"
          class="layout"
          :class="{ active: layout === mask }"
          @click.prevent="apply(mask)"
        >
          <img :src="img">
        </button>
      </div>
      <button
        v-if="false"
      >
        Save layout
      </button>
    </form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import g1000 from '../themes/corteza-base/grid/1000.svg'
import g1010 from '../themes/corteza-base/grid/1010.svg'
import g1100 from '../themes/corteza-base/grid/1100.svg'
import g1101 from '../themes/corteza-base/grid/1101.svg'
import g1110 from '../themes/corteza-base/grid/1110.svg'
import g1111 from '../themes/corteza-base/grid/1111.svg'

// All available layouts
// see data() how this is reconstructed
const grid = {
  '1000': g1000,
  '1010': g1010,
  '1100': g1100,
  '1101': g1101,
  '1110': g1110,
  '1111': g1111,
}

export default {
  data () {
    return {
      grid: Object.getOwnPropertyNames(grid).map(mask => ({
        img: grid[mask],
        mask,
      })),
    }
  },

  computed: {
    ...mapGetters({
      panel: 'layout/panel',
      layout: 'layout/visibilityMask',
    }),
  },

  methods: {
    ...mapActions({
      applyVisibilityMask: 'layout/applyVisibilityMask',
    }),

    apply (mask) {
      document.activeElement && document.activeElement.blur()
      this.applyVisibilityMask(mask)
      this.$root.$emit('panels-resize')
    },
  },
}
</script>
<style lang="scss" scoped>
div.panels {
  cursor: pointer;
  display: inline-block;

  i {
    display: inline-block;
    margin: 10px 20px 0 20px;
  }

  &:hover, &:active {
    form {
      visibility: visible !important;
    }
  }

  form {
    position: fixed;
    visibility: hidden;
    right: 20px;
    top: 40px;
    width: 180px;
    font-size: .8rem;
    background: $light;
    text-align: center;
    margin: 0 0;
    box-shadow: 0 0.2rem 0.3rem 0 rgba(30,34,36,.1);

    .switcher {
      display: grid;
      grid-template-columns: 50px 50px 50px;
      margin: 5px 10px;

      button {
        border: none;
        margin: .5rem;
        background: none;
        cursor: pointer;

        &:hover {
          img {
            filter: invert(.5);
          }
        }

        img {
          filter: invert(.8);
        }

        &.active {
          img {
            filter: invert(.4);
          }
        }
      }
    }
  }
}
</style>
