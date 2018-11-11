<template>
  <div class="header-wrap">
    <header>
      <div class="title-wrap">
        <strong class="title">Crust</strong>
        <Capsule>platform</Capsule>
      </div>
      <div class="toolbox">
        <!-- the header add is for panels, not for now, remove false && to restore -->
        <section v-if="false && user && optionalAdd" class="toolbox-item add circle">
          <i class="icon-plus"
            title="Add a pane"
            @click="$emit('apps')"></i>
        </section>
        <section v-if="user && optionalAdd"
          class="toolbox-item toolbox_notify"
          :class="(user.has_notifications ? 'toolbox_has_notification' : '')">
          <i
            class="icon-bell2"
            :class="(user.has_notifications ? 'toolbox_notification' : '')"></i>
        </section>
        <section @click="mainMenuOpen=!mainMenuOpen" v-if="user" class="toolbox-item toolbox_profile">
          <Avatar v-if="!mainMenuOpen" :user="user"></Avatar>
          <label v-else>
            <i
              class="icon-close user-menu-close"
              title="Show main menu"></i>
          </label>
        </section>
        <section v-if="user" class="toolbox-item toolbox_menu">
          <label>
            <i
              class="icon-menu"
              title="Show main menu"></i>
            <!-- i
              :class="mainMenuOpen?'icon-close':'icon-menu'"
              title="Show main menu"></i -->
          </label>
        </section>
      </div>
    </header>
    <nav class="main-menu" v-if="mainMenuOpen">
      <div class="main-menu-wrap">
        <section>
          <div class="menu-section-title">General</div>
          <ul>
            <li v-for="(item, index) in mainmenu" :key="index">
              <a :href="item.link">{{ item.label }}</a>
            </li>
          </ul>
        </section>
        <section>
          <div class="menu-section-title">Panels</div>
          <div class="menu-panels">
              <div class="menu-panels-text">
                Select or deselect the panels you want to see:
              </div>
              <div class="menu-panels-grid">
                <span>Row 1: </span><input type="checkbox" name="panel_row_0_column_0" v-model="panels_top" value="0" @click="updPanels"/> | <input type="checkbox" name="panel_row_0_column_1" v-model="panels_top" value="1" @click="updPanels"/><br/>
                <span>Row 2: </span><input type="checkbox" name="panel_row_1_column_0" v-model="panels_bottom" value="2" @click="updPanels"/> | <input type="checkbox" name="panel_row_1_column_1" v-model="panels_bottom" value="3" @click="updPanels"/>
              </div>
          </div>
        </section>
        <div class="main-menu-footer">
          <span class="help">
            <i class="icon-message-circle-right-speak"></i>
            <em>Help</em>
          </span>
          <span class="version">v0.7</span>
        </div>
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
    Avatar,
    Capsule,
    Modal,
  },
  // --------
  props:
  {
    user:
    {
      required: true,
      validator: function (prop) {
        return ((typeof prop) === 'object' || prop === null)
      },
    },
    optionalAdd:
    {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  // --------
  data: function () {
    return {
      var: false,
      mainMenuOpen: false,
      showAppModalPanel: false,
      panels_top: this.$store.state.panes.disposition.itempos[0] || [],
      panels_bottom: this.$store.state.panes.disposition.itempos[1] || [],
      mainmenu:
      [
        {
          label: 'My Profile',
        },
        {
          label: 'Settings',
        },
        // no use for login link here... This menu is not shown ifnot logged in
        // { label: 'Login', link: '/auth/signin' },
        {
          label: 'Logout',
          link: '/auth/signout',
        },
      ],
    }
  },
  watch:
    {
      panels_top: 'updPanels',
      panels_bottom: 'updPanels',
    },
  methods:
    {
      updPanels () {
        const top = this.panels_top.map(item => Number(item)).sort()
        const bottom = this.panels_bottom.map(item => Number(item)).sort()
        this.$store.commit('panes/changeDisposition', [top, bottom])
        /*
          (top.length > 0 && bottom.length > 0) ? [top, bottom]
            : top.length > 0 ? [top] : bottom.length > 0 ? [bottom] : []);
            */
      },
    },
}
</script>

<style scoped lang="scss">
  $headerbgcolor : white;
  $defaulttextcolor : black;
  $crustregular : Arial, sans-serif;
  $defaultlinecolor : #CCC;
  $notificationcolor : red;
  $wideminwidth : 720px;
  // import global settings that override previous declarations
  @import '@/assets/sass/_0.declare.scss';

  *
  {
    font-family: $crustregular;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .toolbox_menu
  {
    display: none; //for now
    transition: all 0.2s ease;
  }

  .toolbox
  {
    font-size: 100%;
    float: right;
    line-height: 6em;
    margin-right: 1.5em;
    vertical-align: middle;

    &-item
    {
      display: inline-block;
      line-height: 1;
      vertical-align: middle;
      margin: 0 0 0 1em;
      // cursor:pointer;

      i
      {
        font-size: 32px;
        display: inline-block;
        min-width: 1em;
        color: $defaultlinecolor;
        border-radius: 100%;

        &.user-menu-close
        {
          border-radius: 32px;
          width: 32px;
          background-color: $appgrey;
          font-size: 24px;
          text-align: center;
          line-height: 32px;
          color: white;
        }
      }
    }

    &_notification
    {
      &::after
      {
        display: inline-block;
        border-radius: 100%;
        content: ".";
        background-color: $notificationcolor;
        height: 1em;
        width: 1em;
        margin-left: -1.5em;
        color: $headerbgcolor;
        border: solid 2px $headerbgcolor;
      }
    }

    &_profile,
    &_menu
    {
      margin-top: 1px;
    }

    &_has_notification
    {
      margin-top: -2px;
    }
  }

  .add
  {
    i
    {
      border-radius: 50%;
      background-color: $headerbgcolor;
      text-align: center;
      line-height: 1;
      vertical-align: middle;
    }

    &:hover i
    {
      background-color: $defaultlinecolor;
      color: $headerbgcolor;
    }
  }

  .main-menu
  {
    position: fixed;
    font-size: 13px;
    color: $appgrey;
    top: 60px;
    right: 0;
    bottom: 0;
    width: 90vw;
    max-width: 320px;
    z-index: 100;
    overflow: hidden auto;
    background-color: $headerbgcolor;
    box-shadow: 0 0.1em 0.2em 0 rgba($defaulttextcolor, 0.1);
    border-left: solid 1px rgba($defaultlinecolor, 0.25);
    padding: 60px 20px 20px 20px;

    .menu-section-title
    {
      margin-bottom: 20px;
      color: $defaulttextcolor;
      font-weight: 600;
    }

    .main-menu-footer
    {
      position: absolute;
      bottom: 20px;
      right: 20px;
      left: 20px;
      font-weight: 300;
      display: block;

      i,
      span,
      em
      {
        line-height: 20px;
        vertical-align: top;
        font-style: normal;
      }

      i
      {
        font-size: 18px;
        margin-right: 5px;
      }

      .version
      {
        float: right;
      }
    }

    ul
    {
      list-style: none;
    }

    li
    {
      height: 35px;
      line-height: 35px;
      padding: 0 9px;
      border-radius: 3px;
      background-color: rgba($defaultitembgcolor, 0.15);
      margin-bottom: 10px;

      a
      {
        text-decoration: none;
        color: $appgrey;
      }

      &:hover
      {
        cursor: pointer;
        color: darken($appgrey, 50);
        background-color: rgba($defaultitembgcolor, 0.25);
      }
    }
  }

  .header-wrap
  {
    font-size: 10px;
  }

  header
  {
    overflow: hidden;
    background-color: $headerbgcolor;
    border-bottom: 1px solid rgba($defaulttextcolor, 0.1);
    height: 6em;
    max-height: 6em;

    .title-wrap
    {
      float: left;
      display: block;
      line-height: 6em;
      margin: 0 0.5em 0 1.5em;
    }

    .title
    {
      font-size: 2.4em;
      line-height: 1;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .toolbox_profile
  {
    cursor: pointer;
  }

</style>
