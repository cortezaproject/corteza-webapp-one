<template>
  <div
    class="user"
    :class="{ expanded }"
  >
    <div
      class="label"
      @click="handleExpand"
    >
      <div>{{ user.name || user.handle || user.email }}</div>
      <i
        class="icon-chevron-down"
      />
    </div>
    <ul>
      <li @click="handleSettings">
        {{ $t('settings') }}
      </li>
      <li @click="handleLogout">
        {{ $t('logout') }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  i18nOptions: {
    keyPrefix: 'header.user',
  },

  data () {
    return {
      active: false,
    }
  },

  computed: {
    user () {
      return this.$auth.user
    },
  },

  created () {
    this.$root.$on('header-settings-collapse', (origin) => {
      if (origin !== 'user') this.expanded = false
    })
  },

  methods: {
    handleExpand () {
      this.$root.$emit('header-settings-collapse', 'user')
      this.expanded = !this.expanded
    },

    handleLogout () {
      this.expanded = false
      this.$auth.logout().then(() => {
        this.$auth.open()
      })
    },
    handleSettings () {
      window.open('/auth/profile', '_blank')
    },
  },
}

</script>
<style lang="scss" scoped>
div.user {
  cursor: pointer;
  display: inline-block;

  // Panel settings is opened with hover on header item
  // settings are opened even if mouse moves out of header
  // to opened element because of nesting

  $max-width: 10rem;

  font-size: .8rem;
  .label {
    display: inline-block;
    margin: 8px 0 0 10px;
    height: 20px;
    overflow: hidden;

    border: 1px solid $secondary;
    border-radius: 20px;

    width: $max-width;

    div {
      width: calc(#{$max-width} - 40px);
      display: inline-block;
      padding: 1px .2rem 0 .7rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .icon-chevron-down {
      display: inline-block;
      margin: 5px;
      float: right;
    }
  }

  &:hover, &:active, &.expanded {
    ul {
      visibility: visible !important;
    }
  }

  ul {
    position: fixed;
    visibility: hidden;
    top: 40px;
    right: 20px;
    width: 180px;
    font-size: .8rem;
    background: $light;
    margin: 0;
    padding: 0;
    box-shadow: 0 0.2rem 0.3rem 0 rgba(30,34,36,.1);

    li {
      cursor: pointer;
      display: block;
      padding: .5rem;

      &:hover {
        background: $white;
      }

      a {
        text-decoration: none;
      }
    }
  }
}
</style>
