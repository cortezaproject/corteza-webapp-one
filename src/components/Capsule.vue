<template>
  <!-- slot gets the content of holder div -->
  <span :title="title"><slot/></span>
</template>

<script>
export default
{
  name: 'Capsule',
  props:
  {
    title:
      {
        type: String,
        default: '',
      },
  },
}
</script>

<style scoped lang="scss">
  $pfbgcolor : yellow;

  @import '@/assets/sass/_0.declare.scss';

  span
  {
    background-color: $pfbgcolor;
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    margin-left: 0.85em;
    vertical-align: middle;
  }
</style>
