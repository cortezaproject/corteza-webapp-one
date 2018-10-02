<template>
  <div class="header-wrap">
    <header>
      <div class="title-wrap">
        <strong class="title">Crust</strong>
        <capsule>platform</capsule>
      </div>
      <div class="toolbox">
        <section class="toolbox-item add circle">
          <i class="icon-plus"
            title="Add a pane"
            @click="$emit('apps')"></i>
        </section>
        <section
          class="toolbox-item toolbox_notify"
          :class="(user.has_notifications ? 'toolbox_has_notification' : '')">
          <i
            class="icon-bell2"
            :class="(user.has_notifications ? 'toolbox_notification' : '')"></i>
        </section>
        <section class="toolbox-item toolbox_profile">
          <user-avatar :user="user" />
        </section>
        <section class="toolbox-item toolbox_menu">
          <label @click="mainMenuOpen=!mainMenuOpen">
            <i :class="mainMenuOpen?'icon-close':'icon-menu3'" title="Show main menu"></i>
          </label>
        </section>
      </div>
    </header>
    <nav class="main-menu" v-if="mainMenuOpen">
      <div>
        <ul>
          <li v-for="(item, index) in mainmenu" :key="index">
            {{ item.label }}
          </li>
        </ul>
      </div>
    </nav>
    <modal v-if="showAppModalPanel" @close="showAppModalPanel = false">
      <h3 slot="header">custom header</h3>
    </modal>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import Capsule from '@/components/Capsule'
import Modal from '@/components/Modal'

export default
{
  name: 'Header',
  // --------
  components:
  {
    'user-avatar': Avatar,
    'capsule': Capsule,
    Modal,
  },
  // --------
  props:
  {
    user:
    {
      type: Object,
      required: true,
    },
  },
  // --------
  data: function () {
    return {
      var: false,
      mainMenuOpen: false,
      showAppModalPanel: false,
      mainmenu:
      [
        { label: 'My Profile' },
        { label: 'Settings' },
        { label: 'Logout' },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
  @import '@/assets/sass/_0.declare.scss';

  *
  {
    font-family:$crustregular;
    box-sizing:border-box;
  }
  header
  {
    position:fixed;
    width: 100%;
    left:0;
    right:0;
    overflow:hidden;
    background-color: $headerbgcolor;
    box-shadow: 0 0.1rem 0.2rem 0 rgba($defaulttextcolor, 0.1);
    height: 6rem;
    max-height: 6rem;
    top:0;
    z-index:999;

    .title-wrap
    {
      float:left;
      display:block;
      line-height:6rem;
      margin:0 0.5rem 0 1.5rem;
    }

    .title
    {
      font-size:2.4rem;
      line-height:1;
      display:inline-block;
      vertical-align:middle;
    }
  }

  .toolbox
  {
    float:right;
    line-height:6rem;
    margin-right:1.5rem;
    vertical-align:middle;

    &-item
    {
      display:inline-block;
      line-height: 1;
      vertical-align: middle;
      margin: 0 0 0 1rem;
      i
      {
        display:inline-block;
        min-width:3rem;
        font-size:3rem;
        color:$defaultlinecolor;
        //border:solid 2px transparent;
        border-radius:100%;
      }
    }

    &_notification
    {
      &:after
      {
        display:inline-block;
        border-radius:100%;
        content:".";
        background-color:$notificationcolor;
        height:1rem;
        width:1rem;
        margin-left:-1.5rem;
        font-size:1;
        color:$headerbgcolor;
        border:solid 2px $headerbgcolor;
      }
    }
    &_profile, &_menu
    {
      margin-top:1px;
    }

    &_has_notification
    {
      margin-top:-2px;
    }
  }
  .add
  {
    i
    {
      border-radius:50%;
      background-color:$headerbgcolor;
      text-align:center;
      line-height: 1;
      vertical-align: middle;
    }
    &:hover i
    {
      background-color:$defaultlinecolor;
      color:$headerbgcolor;
    }
  }

  .main-menu
  {
    position :fixed;
    overflow:hidden auto;
    top:96px;
    bottom:0;
    right:0;
    min-width:200px;
    width:25%;
    background-color:$headerbgcolor;
    box-shadow: 0 0.1rem 0.2rem 0 rgba($defaulttextcolor, 0.1);
    border-left: solid 1px rgba($defaultlinecolor, 0.25);
    //border-top: solid 1px $defaultlinecolor;
    z-index:998;
    padding:20px 0 20px 20px;
    ul
    {
      list-style:none;
    }
    li
    {
      font-size:1.2rem;
      padding:5px 0 5px 10px;
      border-radius:3px 0 0 3px;
      &:hover
      {
        background-color:$defaultlinecolor;
        color:$headerbgcolor;
      }
    }
  }
</style>
