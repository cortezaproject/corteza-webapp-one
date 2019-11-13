<!-- template for the modal component -->
<template>
  <transition name="modal">
    <div class="modal-mask"
         @click="closeModal">

      <div class="modal-wrapper">
        <div class="modal-container p-3 m-3"
             @click.stop.prevent>

          <div class="modal-header pb-3"
               :class="headerClass">

            <h5 v-html="title" />

            <span class="modal-close-button"
                  @click="closeModal">
              &times;
            </span>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'modal',
  props: {
    title: {
      type: String,
      required: false,
      default: null,
    },
    headerClass: {
      type: String,
      required: false,
      default: null,
    },
  },

  methods: {
    /**
     * Emits close event
     */
    closeModal () {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
  .m-3 {
    margin: 1rem;
  }
  .p-3 {
    padding: 1rem;
  }
  .pb-3 {
    padding-bottom: 1rem;
  }
  .text-danger {
    color: $danger;
  }

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparentize(black,.2);
    display: table;
    transition: opacity 0.3s ease;
  }

  .modal-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .modal-container {
    max-width: 500px;
    width: 100%;
    background-color: $white;
    border-radius: 2px;
    transition: all 0.3s ease;
    font-family: Helvetica, Arial, sans-serif;

    h5 {
      font-size: 1.0625rem;
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-close-button {
    float: right;
    font-size: 2em;
    cursor: pointer;
  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>
