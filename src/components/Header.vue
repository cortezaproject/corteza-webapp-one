<template>
  <div class="header-wrap">
    <header>
      <div class="title-wrap">
        <strong class="title">Crust</strong>
        <Capsule title="Platform">platform</Capsule>
        <span class="active_mobile">{{ (activeTab || {}).title }}</span>
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
        <section @click="optionsMenuOpen=!optionsMenuOpen" class="toolbox-item toolbox_menu desktop">
            <i v-if="optionsMenuOpen"
              class="icon-grid-interface-close"
              title="Show options menu"></i>
            <i v-else
              class="icon-grid-interface-open"
              title="Show options menu"></i>
        </section>
        <section @click="clickMenuMobile" class="toolbox-item toolbox_menu mobile">
          <i v-if="mobileMenuOpen"
             class="icon-grid-interface-close"
             title="Show options menu"></i>
          <i v-else
             class="icon-grid-interface-open"
             title="Show options menu"></i>
        </section>
      </div>
    </header>
    <nav class="main-menu" v-if="optionsMenuOpen">
      <div class="main-menu-wrap">
        <section>
          <div class="menu-section-title">Panels</div>
          <div class="menu-panels">
              <div class="menu-panels-text-big">
                Select or deselect the panels you want work in during this session:
              </div>
              <div class="menu-panels-grid">
                <table class="panels-table">
                  <thead>
                    <tr>
                      <th>&nbsp;
                      </th>
                      <th scope="col"><span>Column 1</span>
                      </th>
                      <th scope="col"><span>Column 2</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row"><span>Row 1</span>
                      </th>
                      <td>
                        <label for="panel_row_0_column_0">
                          <input type="checkbox" id="panel_row_0_column_0" name="panel_row_0_column_0" value="0" :checked="panels[0].visible" @input="updPanels"/>
                        </label>
                      </td>
                      <td>
                        <label for="panel_row_0_column_1">
                          <input v-if="rowFirst" type="checkbox" id="panel_row_0_column_1" name="panel_row_0_column_1" value="1" :checked="panels[1].visible" @input="updPanels"/>
                          <input v-else type="checkbox" id="panel_row_0_column_1" name="panel_row_1_column_0" value="2" :checked="panels[2].visible" @input="updPanels"/>
                        </label>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row"><span>Row 2</span>
                      </th>
                      <td>
                        <label for="panel_row_1_column_0">
                          <input v-if="rowFirst" type="checkbox" id="panel_row_1_column_0" name="panel_row_1_column_0" value="2" :checked="panels[2].visible" @input="updPanels"/>
                          <input v-else type="checkbox" id="panel_row_1_column_0" name="panel_row_0_column_1" value="1" :checked="panels[1].visible" @input="updPanels"/>
                        </label>
                      </td>
                      <td>
                        <label for="panel_row_1_column_1">
                          <input type="checkbox" id="panel_row_1_column_1" name="panel_row_1_column_1" value="3" :checked="panels[3].visible" @input="updPanels"/>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="menu-panels-alert">
                <vue-cookie-accept-decline :disableDecline="true">
                  <div slot="message">
                    Adding or removing panels may reload the tabs, so make sure to don't have unsaved work or open video chats.
                  </div>
                  <div slot="acceptContent">
                    Ok
                  </div>
                </vue-cookie-accept-decline>
              </div>
          </div>
        </section>
      </div>
    </nav>
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
        <div class="main-menu-footer">
          <span class="help">
            <i class="icon-message-circle-right-speak"></i>
            <em>Help</em>
          </span>
          <span class="version">v1.0</span>
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
import VueCookieAcceptDecline from 'vue-cookie-accept-decline'

export default
{
  name: 'Header',
  // --------
  components:
  {
    Avatar,
    Capsule,
    Modal,
    VueCookieAcceptDecline,
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
      optionsMenuOpen: false,
      mobileMenuOpen: false,
      showAppModalPanel: false,
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
  computed:
    {
      allTabs () {
        return this.$store.state.panes.items.reduce((acc, panel) => {
          return acc.concat(panel.tabs)
        }, [])
      },
      activeTab () {
        let active = this.$store.state.panes.activeMobileTab
        return this.allTabs.find(item => item.id === active)
      },
      rowFirst () {
        return this.$store.state.panes.disposition === 'rowfirst'
      },
      panels () {
        return this.$store.state.panes.items
      },
    },
  created () {
    this.$root.$on('closeTabsMobile', this.onCloseMobile)
  },
  beforeDestroy () {
    this.$root.$off('closeTabsMobile', this.onCloseMobile)
  },
  methods:
    {
      onCloseMobile () {
        this.mobileMenuOpen = false
      },
      updPanels (evt) {
        const paneID = +evt.target.value
        this.$store.commit('panes/togglePanel', paneID)
        if (this.panels[paneID].visible) {
          // a panel was shown
          this.optionsMenuOpen = false
          if (this.panels[paneID].tabs.length === 0) this.panels[paneID].showapps = true
        }
      },
      clickMenuMobile () {
        this.mobileMenuOpen = !this.mobileMenuOpen
        this.$root.$emit('showTabsMobile', this.mobileMenuOpen)
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
        font-size: 26px;
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
      .icon-grid-interface-close {
        color:$appyellow;
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

    .menu-panels-text-big
    {
      margin-bottom: 20px;
      color: $defaulttextcolor;
      font-size: 14px;
    }

    .panels-table
    {
      color: $appgrey;
      border:none;
      border-collapse: collapse;
    }

    .panels-table th,
    .panels-table td
    {
      text-align: center;
      vertical-align: middle;
      border:1px solid #fff;
    }

    .panels-table th span,
    .panels-table td label
    {
      padding:10px;
      display: block;
    }
    .panels-table td label:hover
    {
      cursor: pointer;
      background: $appyellow;
    }

    .panels-table th
    {
      background-color: rgba($defaultitembgcolor, 0.15);
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
      position: relative;
    }

    .title
    {
      font-size: 2.4em;
      line-height: 1;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .toolbox_profile,
  .toolbox_menu,
  .icon-close
  {
    cursor: pointer;
  }

  .active_mobile
  {
    background-color: $appgrey;
    color: white;
    text-transform: uppercase;
    border-radius: 10px;
    padding: 5px 10px 3px;
    margin:33px 0 0;
    position: absolute;
    left: 0;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  .menu-panels-alert .cookie {
    margin: 20px 0 0;
    padding: 7px;
    border: 1px solid $appyellow;
    background: rgba($appyellow, 0.2);
    border-radius: 5px;
  }

  @media (min-width: $wideminwidth)
  {
    .active_mobile
    {
      display: none;
    }

    .toolbox_menu.mobile
    {
      display: none;
    }
  }

  @media (max-width: $wideminwidth - 1px)
  {
    .toolbox_menu.desktop
    {
      display: none;
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
        line-height: 40px;
      }
    }
  }

</style>
