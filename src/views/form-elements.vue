<template>
  <div class="workspace">
    <Header />
    <div class="form-layout">
      <h1>Basic form components</h1>
      <div>

      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
  components:
  {
    Header,
  },
  data () {
    return {}
  },
}
</script>

<style lang="scss">
@import '@/assets/sass/_0.declare.scss';

*
{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.form-layout
{
  margin-top: 60px;
}
</style>
