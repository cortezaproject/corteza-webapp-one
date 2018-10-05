<template>
  <!-- slot gets the content of holder div -->
  <span><slot/></span>
</template>

<script>
export default
{
  name: 'Capsule',
  components:
  {
  },
  props:
  {
    color: String,
    default: '',
  },
  data: function ()
  {
    return {
      var: false,
    }
  },
}
</script>

<style scoped lang="scss">
  $pfbgcolor : yellow;
  @import '@/assets/sass/_0.declare.scss';
  span
  {
    background-color:$pfbgcolor;
    line-height:1;
    display:inline-block;
    padding:0.2em 0.5em;
    vertical-align:middle;
    border-radius:2em;
    font-weight:normal;
    font-size:1em;
    font-family:$crustsemibold;
    text-transform:uppercase;
    margin-left:1em;
  }
</style>
