<template>
  <div class="workspace">
    <Header :user="user" />
    <div class="form-layout">
      <h1>Basic form components</h1>
      <div>
        <radio group-name="yes-no" value="1">Yes</radio>
        <radio group-name="yes-no" value="0">No</radio>
      </div>
      <div>
        <checkbox name="yellow" value="#FFFF00">Yellow</checkbox>
        <checkbox name="orange" value="rgb(255,153,0)">Orange</checkbox>
        <checkbox name="red" value="red">red</checkbox>
      </div>
      <div>
        <checkbox name="confirm" value="yes">It's ok!</checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import radio from '@/components/form-elements/radio.vue'
import checkbox from '@/components/form-elements/checkbox.vue'

export default {
  components:
  {
    'Header': Header,
    radio,
    checkbox,
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
