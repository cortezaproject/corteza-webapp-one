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

  @media (min-width: $wideminwidth)
  {
    span
    {
      background-color: $pfbgcolor;
      line-height: 1;
      display: inline-block;
      padding: 0.2em 0.5em;
      vertical-align: middle;
      border-radius: 2em;
      font-weight: normal;
      font-size: 1em;
      font-family: $crustsemibold;
      text-transform: uppercase;
      margin-left: 1em;
    }
  }

  @media (max-width: $wideminwidth - 1px)
  {
    span
    {
      background-color: $pfbgcolor;
      color: $pfbgcolor;
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      margin-left: 0.85em;
      vertical-align: middle;
      overflow: hidden;
    }
  }
</style>
