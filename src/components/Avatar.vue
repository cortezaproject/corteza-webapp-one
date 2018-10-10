<!-- template for the user avatar component -->
<template>
  <i name="avatar"
     class="u-avatar"
     :title="user.username"
     :data-uid="user.id"
     :style="(user.avatar && ''!==user.avatar)?'background-image:url('+user.avatar+')':''"
     aria-hidden="true"><span>{{ user.username }}</span></i>
</template>

<script>
export default
{
  name: 'avatar',
  // require user param
  props:
  {
    'user': Object,
    'required': true,
  },
}
</script>

<style scoped lang="scss">
//this import is for variables
//we can define vars here
$defaultlinecolor: #ccc;
//and overwrite them here, with the defaults
@import '@/assets/sass/_0.declare.scss';
i
{
  display:inline-block;
  height:1em;
  width:1em;
  border:solid 2px $defaultlinecolor;
  border-radius:100%;
  // background: center center no-repeat url(../assets/pics/no-profile-pic.png);
  background: center center no-repeat url(../assets/pics/user4.png);
  background-size:contain;
  span
  {
    display:none;
  }
}
</style>
