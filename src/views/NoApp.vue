<template>
  <main>
    Application (<code>{{ $route.path }}</code>) not found.
  </main>
</template>

<script>
export default {
  data () {
    return {}
  },
}
</script>
<style lang="scss">
main {
  margin: 40px;
  text-aign: center;
  width: 100%;
}
</style>
