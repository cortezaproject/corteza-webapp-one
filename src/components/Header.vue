<template>
  <div class="header-wrap">
    <header>
      <div class="title-wrap">
        <strong class="title">{{ $t('header.app-name') }}</strong>
        <Capsule title="Platform">{{ $t('header.app-tag') }}</Capsule>
        <span class="active_mobile">{{ (activeTab || {}).title }}</span>
      </div>
      <div class="toolbox">
        <!-- the header add is for panels, not for now, remove false && to restore -->
        <section  v-if="user" class="toolbox-item toolbox_profile">
          <Avatar :user="user"></Avatar>
        </section>
        <span class="user-info">
          <label>{{ user.name || user.username || user.email }} </label>
          <a href="/auth/logout">{{ $t('header.signOut') }}</a>
        </span>
        <span class="toolbox-item profile">
          <a href="/auth" target= '_blank'>
            <i class="icon-user"></i>
          </a>
        </span>
        <section v-if="false && user && optionalAdd" class="toolbox-item add circle">
          <i class="icon-plus"
            :title="$t('header.addPane')"
            @click="$emit('apps')"></i>
        </section>
        <section @click="optionsMenuOpen=!optionsMenuOpen" class="toolbox-item toolbox_menu desktop">
            <i v-if="optionsMenuOpen"
              class="icon-grid-interface-close"
              :title="$t('header.showOptionsMenu')"></i>
            <i v-else
              class="icon-grid-interface-open"
              :title="$t('header.hideOptionsMenu')"></i>
        </section>
        <section @click="clickMenuMobile" class="toolbox-item toolbox_menu mobile">
          <i v-if="mobileMenuOpen"
             class="icon-grid-interface-close"
             :title="$t('header.showOptionsMenu')"></i>
          <i v-else
             class="icon-grid-interface-open"
             :title="$t('header.hideOptionsMenu')"></i>
        </section>
      </div>
    </header>
    <nav class="main-menu" v-if="optionsMenuOpen">
      <div class="main-menu-wrap">
        <section>
          <div class="menu-section-title">{{ $t('header.panel.title') }}</div>
          <div class="menu-panels">
              <div class="menu-panels-text-big">
                {{ $t('header.panel.selectOrDeselect') }}
              </div>
              <div class="menu-panels-grid">
                <table class="panels-table">
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th scope="col"><span>{{ $t('header.panel.column', { number: 1 }) }}</span></th>
                      <th scope="col"><span>{{ $t('header.panel.column', { number: 2 }) }}</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row"><span>{{ $t('header.panel.row', { number: 2 }) }}</span></th>
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
                      <th scope="row"><span>{{ $t('header.panel.row', { number: 2 }) }}</span></th>
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
          </div>
        </section>
      </div>
    </nav>
  </div>
</template>

<script>
import Avatar from '@/components/Avatar'
import Capsule from '@/components/Capsule'

export default {
  name: 'Header',

  components: {
    Avatar,
    Capsule,
  },

  props: {
    user: {
      required: true,
      validator: function (prop) {
        return ((typeof prop) === 'object' || prop === null)
      },
    },
    optionalAdd: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data () {
    return {
      var: false,
      // NOTE: Depricated?
      mainMenuOpen: false,
      optionsMenuOpen: false,
      mobileMenuOpen: false,
      showAppModalPanel: false,
      // NOTE: Depricated?
      mainmenu:
      [
        {
          label: 'My Profile',
        },
        {
          label: 'Settings',
        },
        {
          label: 'Logout',
          link: '/auth/signout',
        },
      ],
    }
  },

  computed: {
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

  methods: {
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
  $defaultheight: 50px;
  $iconsize: 18px;

  * {
    font-family: $regular;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-weight: 100;
  }

  .user-info {
    display: inline-block;
    margin-left: 5px;
    label {
      font-size: 13px;
      min-width: 40px;
      text-align: right;
      font-family: $bold;
      display: inline-block;
    }
    a {
      color: $black;
      text-decoration: none;
      position: absolute;
      max-height: 0px;
      margin-left: -40px;
      margin-top: 15px;
    }
  }

  .toolbox_menu {
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .toolbox {
    font-size: 100%;
    float: right;
    line-height: $defaultheight;
    margin-right: 1.5em;
    vertical-align: middle;

    &-item {
      display: inline-block;
      line-height: 1;
      vertical-align: middle;
      margin: 0 0 0 1em;

      i {
        font-size: $iconsize;
        display: inline-block;
        color: $secondary;

        &.user-menu-close {
          border-radius: 32px;
          width: 32px;
          background-color: $secondary;
          font-size: $iconsize;
          text-align: center;
          line-height: 32px;
          color: white;
        }
      }
      .icon-grid-interface-close {
        color: $warning;
      }
    }

    &_notification {
      &::after {
        display: inline-block;
        border-radius: 100%;
        content: ".";
        background-colotitle-wrapr: $danger;
        height: 1em;
        width: 1em;
        margin-left: -1.5em;
        color: $white;
        border: solid 2px $white;
      }
    }

    &_profile,
    &_menu {
      margin-top: 1px;
    }

    &_has_notification {
      margin-top: -2px;
    }
  }

  .add {
    i {
      border-radius: 50%;
      background-color: $white;
      text-align: center;
      line-height: 1;
      vertical-align: middle;
    }

    &:hover i {
      background-color: $secondary;
      color: $white;
    }
  }

  .main-menu {
    position: fixed;
    font-size: 13px;
    color: $secondary;
    top: $defaultheight;
    right: 0;
    bottom: 0;
    width: 90vw;
    max-width: 320px;
    z-index: 100;
    overflow: hidden auto;
    background-color: $white;
    box-shadow: 0 0.1em 0.2em 0 rgba($dark, 0.1);
    border-left: solid 1px rgba($secondary, 0.25);
    padding: 10px 20px;

    .menu-section-title {
      margin-bottom: 15px;
      color: $dark;
    }

    .main-menu-footer {
      position: absolute;
      bottom: 20px;
      right: 20px;
      left: 20px;
      font-weight: 300;
      display: block;

      i,
      span,
      em {
        line-height: 20px;
        vertical-align: top;
        font-style: normal;
      }

      i {
        font-size: 18px;
        margin-right: 5px;
      }

      .version {
        float: right;
      }
    }

    .menu-panels-text-big {
      margin-bottom: 20px;
      color: $dark;
      font-size: 14px;
    }

    .panels-table {
      color: $secondary;
      border:none;
      border-collapse: collapse;
      width: 100%;
    }

    .panels-table th,
    .panels-table td {
      text-align: center;
      vertical-align: middle;
      border:1px solid #fff;
    }

    .panels-table th span,
    .panels-table td label {
      padding:10px;
      display: block;
    }
    .panels-table td label:hover {
      cursor: pointer;
      background: $light;
    }

    .panels-table th {
      background-color: $secondary;
      color: $white;
    }

    ul {
      list-style: none;
    }

    li {
      height: 35px;
      line-height: 35px;
      padding: 0 9px;
      border-radius: 3px;
      background-color: rgba($secondary, 0.15);
      margin-bottom: 10px;

      a {
        text-decoration: none;
        color: $secondary;
      }

      &:hover {
        cursor: pointer;
        color: darken($secondary, 50);
        background-color: rgba($secondary, 0.25);
      }
    }
  }

  .header-wrap {
    font-size: 10px;
  }

  header {
    overflow: hidden;
    background-color: $white;
    height: $defaultheight;

    .title-wrap {
      float: left;
      display: block;
      line-height: $defaultheight;
      margin: 0 0.5em 0 1.5em;
      position: relative;
    }

    .title {
      font-size: 2.4em;
      line-height: 1;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .active_mobile {
    background-color: $secondary;
    color: white;
    text-transform: uppercase;
    border-radius: 10px;
    padding: 3px 10px 3px;
    margin: 30px 0 0;
    position: absolute;
    left: 0;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }

  @media (min-width: $wideminwidth) {
    .active_mobile {
      display: none;
    }

    .toolbox_menu.mobile {
      display: none;
    }
  }

  @media (max-width: $wideminwidth - 1px) {
    .toolbox_menu.desktop {
      display: none;
    }

    header {
      .title-wrap {
        line-height: 25px;
      }
    }
  }

</style>
