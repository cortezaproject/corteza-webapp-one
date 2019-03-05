<template>
  <!-- slot gets the content of holder div -->
  <span :title="title"><slot/></span>
</template>

<script>
export default {
  name: 'Capsule',

  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped lang="scss">
  $pfbgcolor : yellow;

  @import '@/assets/sass/_0.declare.scss';

  @media (min-width: $wideminwidth) {
    span {
      background-color: $pfbgcolor;
      line-height: 1;
      display: inline-block;
      padding: 0.2em 0.5em;
      vertical-align: baseline;
      border-radius: 2em;
      font-size: 1em;
      font-family: $crustsemibold;
      text-transform: uppercase;
      margin-left: 5px;
      letter-spacing: 2px;
    }
  }

  @media (max-width: $wideminwidth - 1px) {
    span {
      background-color: $pfbgcolor;
      color: $pfbgcolor;
      display: inline-block;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      margin-left: 5px;
      vertical-align: middle;
      overflow: hidden;
    }
  }
</style>
