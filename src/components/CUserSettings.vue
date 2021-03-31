<template>
  <div
    class="user"
  >
    <div
      class="label"
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

  computed: {
    user () {
      return this.$auth.user
    },
  },

  methods: {
    handleLogout () {
      this.$auth.logout()
    },

    handleSettings () {
      window.open(this.$auth.cortezaAuthURL, '_blank')
    },
  },
}

</script>
<style lang="scss" scoped>
div.user {
  cursor: pointer;
  display: inline-block;
  margin-right: 20px;

  // Panel settings is opened with hover on header item
  // settings are opened even if mouse moves out of header
  // to opened element because of nesting

  $max-width: 10rem;

  font-size: .8rem;
  .label {
    display: inline-block;
    height: 20px;
    overflow: hidden;

    border: 1px solid $secondary;
    border-radius: 20px;

    width: $max-width;

    div {
      width: calc(#{$max-width} - 40px);
      display: inline-block;
      padding: .1rem .2rem 0 .7rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 1rem;
    }

    .icon-chevron-down {
      display: inline-block;
      margin: 5px;
      float: right;
    }
  }

  &:hover, &:active {
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
