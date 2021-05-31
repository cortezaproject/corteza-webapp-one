<template>
  <div
    class="app-selector"
  >
    <div class="logo">
      <img src="applications/default_logo.jpg">
    </div>
    <div class="search">
      <input
        type="search"
        name="search"
        :aria-label="$t('layout.search')"
        :placeholder="$t('layout.search')"
      >
    </div>
    <draggable
      v-model="appList"
      group="apps"
      class="section"
      :disabled="!canCreateApplication"
      @end="onDrop"
    >
      <div
        v-for="app in appList"
        :key="app.applicationID"
        class="app-item"
        @mouseover="hovered = app.applicationID"
        @mouseleave="hovered = undefined"
      >
        <a
          :disabled="!app.enabled"
          :href="app.unify.url"
          target="_blank"
          :style="[{ cursor: `${app.enabled ? 'pointer': canCreateApplication ? 'grab' : 'default'}` }]"
          class="app-button"
        >
          <div
            class="app-logo"
            :class="{ 'opacity-3': !app.enabled }"
            :style="`background-image:url('${app.unify.logo}');opacity:${app.enabled ? '1' : '0.4'}`"
          />
          <h2 class="app-name">
            {{ app.unify.name || app.name }}
          </h2>
        </a>
      </div>
    </draggable>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Draggable from 'vuedraggable'

export default {
  components: {
    Draggable,
  },

  data () {
    return {
      appList: [],

      canCreateApplication: false,
      canPin: false,

      hovered: undefined,
    }
  },

  computed: {
    ...mapGetters({
      apps: 'applications/unifyOnly',
    }),
  },

  watch: {
    'apps': {
      immediate: true,
      handler (apps) {
        this.appList = apps
      },
    },
  },

  created () {
    this.fetchEffective()
  },

  methods: {
    ...mapActions({
      reorderApp: 'applications/reorder',
      pinApp: 'applications/pin',
      unpinApp: 'applications/unpin',
    }),

    fetchEffective () {
      this.$SystemAPI.permissionsEffective({ resource: 'application' })
        .then(p => {
          this.canCreateApplication = p.find(per => per.operation === 'application.create').allow || false
          this.canPin = p.find(({ resource, operation, allow }) => resource === 'system' && operation === 'application.flag.self').allow
        })
    },

    handlePin (pin = true, applicationID) {
      if (pin) {
        this.unpinApp({ applicationID, ownedBy: this.$auth.user.userID })
      } else {
        this.pinApp({ applicationID, ownedBy: this.$auth.user.userID })
      }
    },

    async onDrop () {
      const applicationIDs = this.appList.map(({ applicationID }) => applicationID)
      await this.reorderApp(applicationIDs)
    },
  },
}
</script>
<style lang="scss" scoped>
$open-icon-height: .8rem;
$app-item-default: 20px;
$border-color: #E4E9EF;
$primary-color: #4D7281;

.app-selector {
  text-align: center;
  overflow: auto;
  .logo {
    padding: 0 40px;
    img {
      width: 100%;
      max-width: 400px;
    }
  }
  .search {
    padding: 0 40px;
    input {
      border: 2px solid $border-color;
      height: 40px;
      margin-top: 60px;
      font-size: 1rem;
      padding: 0.375rem 0.75rem;
      width: 100%;
      max-width: 500px;
      border-radius: 0.3rem;
      &:focus {
        border-color: $primary-color;
      }
    }
    input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
      height: 13px;
      width: 13px;
      background: url("data:image/svg+xml;charset=UTF-8,%3csvg viewPort='0 0 12 12' version='1.1' xmlns='http://www.w3.org/2000/svg'%3e%3cline x1='1' y1='11' x2='11' y2='1' stroke='black' stroke-width='2'/%3e%3cline x1='1' y1='1' x2='11' y2='11' stroke='black' stroke-width='2'/%3e%3c/svg%3e");
    }
  }
  .section {
    max-width: 1200px;
    margin: 2rem auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .app-item {
      position: relative;
      background-color: #fff;
      border-radius: $app-item-default;
      margin: $app-item-default;
      padding-bottom: $app-item-default;
      box-shadow: 0px 3px 6px #00000029;

      .star {
        position: absolute;
        top: .2rem;
        left: .2rem;
        padding: 0;
        margin: 0;
        background-color: transparent;
        border: none;
        .star-icon {
          fill: $warning;
          width: 1.2rem;
          height: 1.2rem;
        }
      }
    }

    .app-button {
      height: 160px;
      background: none;
      border: 0;
      width:  280px;
      padding: 0;
      display: inline-block;
      text-decoration: none;

      .app-logo {
        height: 100%;
        max-width: 100%;
        display: block;
        margin: 0 auto;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: top;
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
      }
      .app-name {
        padding: $app-item-default;
        margin-top: 0;
      }
    }

    button:disabled {
      cursor: not-allowed;
    }
  }
}

</style>
