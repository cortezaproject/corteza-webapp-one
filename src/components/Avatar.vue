<!-- template for the user avatar component -->
<template>
  <span v-if="letter">
    <span class="avatar u-avatar"
       :class="[ { 'no-avatar' : !user.avatar } ]"
       :title="user.name || user.username"
       :style="{ 'background-image': (user.avatar ? `url(${user.avatar})` : '') }">
        <span aria-hidden="true" v-if="!user.avatar">{{ letter }}</span>
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
    user: {
      type: Object,
      required: true,
    },
  },

  computed: {
    letter () {
      const l = this.user.name[0] || this.user.username[0] || this.user.email[0] || ''
      return l.toLocaleUpperCase()
    },
  },
}
</script>

<style scoped lang="scss">
.u-avatar {
  display:inline-block;
  font-size:16px;
  height:32px;
  width:32px;
  border:solid 1px $success;
  border-radius:100%;
  background:url('/static/pics/no-profile-pic.png') center center no-repeat;
  background-size:contain;
  line-height:28px;
  text-align:center;
  font-style:normal;
  background-color:rgba($success,0.08);;
  color: $success;
  vertical-align: -webkit-baseline-middle;
}
</style>
