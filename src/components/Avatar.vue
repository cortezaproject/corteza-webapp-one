<!-- template for the user avatar component -->
<template>
  <i v-if="user" class="avatar u-avatar"
     :class="[ { 'no-avatar' : !user.avatar } ]"
     :title="user.name || user.username"
     :style="{ 'background-image': (user.avatar ? `url(${user.avatar})` : '') }">
      <span aria-hidden="true" v-if="!user.avatar">{{ user.name[0] || user.username[0] }}</span>
  </i>
  <i v-else
     class="avatar u-avatar coward">
      <span aria-hidden="true">?</span>
  </i>
</template>

<script>
export default
{
  name: 'avatar',
  // require user param
  props: {
    'user': Object,
    'required': true,
  },
}
</script>

<style scoped lang="scss">
//this import is for variables
@import '@/assets/sass/_0.declare.scss';

i.u-avatar
{
  display: inline-block;
  font-size: 16px !important;
  height: 32px;
  width: 32px;
  border: solid 2px $defaultlinecolor;
  border-radius: 100%;
  background: url('/static/pics/no-profile-pic.png') center center no-repeat;
  background-size: contain;
  line-height: 32px;
  text-align: center;
  font-style: normal;
  background-color: $appgrey;
  color: $appwhite;
  vertical-align: middle;

  span
  {
    color: $appwhite;
    font-size: 16px;
    line-height: 1;
  }
}
</style>
