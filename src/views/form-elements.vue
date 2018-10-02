<template>
  <div class="workspace">
    <Header :user="user" />
    <div class="form-layout">
      <h1>Basic form components</h1>
      <radio group="yes-no" value="1">Yes</radio>
      <radio group="yes-no" value="0">No</radio>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import radio from '@/components/form-elements/radio.vue'

export default {
  components:
  {
    'Header': Header,
    radio,
  },
  data ()
  {
    return {
      user: {
        id: '01234567891',
        has_notifications: false,
        username: 'BetaUser',
        avatar: '',
      },
    }
  },
}
</script>

<style lang="scss">

@import '@/assets/sass/_0.declare.scss';

*
{
  margin:0;
  padding:0;
  box-sizing: border-box;
}

.form-layout
{
  margin-top:96px;
  padding:20px;
  font-family: $crustregular;
}
</style>
