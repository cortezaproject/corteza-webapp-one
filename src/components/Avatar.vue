<!-- template for the user avatar component -->
<template>
  <span v-if="user">
    <span class="avatar u-avatar"
       :class="[ { 'no-avatar' : !user.avatar } ]"
       :title="user.name || user.username"
       :style="{ 'background-image': (user.avatar ? `url(${user.avatar})` : '') }">
        <span aria-hidden="true" v-if="!user.avatar">{{ user.name[0] || user.username[0] }}</span>
    </span>
  </span>
    <i v-else
       class="avatar u-avatar coward">
    <span aria-hidden="true">?</span>
    </i>
</template>

<script>
export default {
  name: 'avatar',

  // require user param
  props: {
    'user': Object,
    'required': true,
  },
}
</script>

<style scoped lang="scss">
@import '@/assets/sass/_0.declare.scss';

.u-avatar {
  display:inline-block;
  font-size:16px;
  height:32px;
  width:32px;
  border:solid 1px $appgreen;
  border-radius:100%;
  background:url('/static/pics/no-profile-pic.png') center center no-repeat;
  background-size:contain;
  line-height:28px;
  text-align:center;
  font-style:normal;
  background-color:rgba($appgreen,0.08);;
  color:$appgreen;
  vertical-align: -webkit-baseline-middle;
}
</style>
