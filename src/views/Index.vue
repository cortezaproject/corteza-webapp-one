<template>
  <div id="crust-chrome" class="crust">
    <router-multi-view/>
  </div>
</template>

<script>
export default {

}
</script>
<style lang="scss">
  html *
  {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body
  {
    padding: 0;
    margin: 0;
  }

  #crust-chrome > *
  {
    width: 100vw;
    height: 100vh;
  }
</style>
