<template>
  <div
    class="app-selector"
  >
    <h1>{{ $t('app.general.availableApps') }}</h1>
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

.app-selector {
  text-align: center;
  .section {
    max-width: 1200px;
    margin: 2rem auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .app-item {
      position: relative;
      background-color: #fff;
      border-radius: 20px;
      margin: 20px;
      padding-bottom: 20px;
      &:hover {
        .open-url {
          .open-icon {
            fill: $secondary;
          }
        }
      }
      .open-url {
        position: absolute;
        right: .2rem;
        padding: .2rem;
        .open-icon {
          fill: white;
          height: $open-icon-height;
        }
      }
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
        height: auto;
        text-align: left;
        padding: 20px;
        margin-top: 0;
        position: relative;
      }
    }

    button:disabled {
      cursor: not-allowed;
    }
  }
}

</style>
