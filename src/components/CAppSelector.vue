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
          v-if="app.enabled && hovered === app.applicationID"
          :href="app.unify.url"
          target="_blank"
          class="open-url"
        >
          <svg
            viewBox="0 0 512 512"
            class="open-icon"
          >
            <path
              d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"
            />
          </svg>
        </a>
        <button
          :disabled="!app.enabled"
          :style="[{ cursor: `${app.enabled ? 'pointer': canCreateApplication ? 'grab' : 'default'}` }]"
          class="app-button"
          :value="$t(app.unify.name || app.name)"
          @click.prevent="$emit('selected', app)"
        >
          <div
            class="app-logo"
            :class="{ 'opacity-3': !app.enabled }"
            :style="`background-image:url('${app.unify.logo}');opacity:${app.enabled ? '1' : '0.4'}`"
          />
          <h2 class="app-name">
            {{ app.unify.name || app.name }}
          </h2>
        </button>
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

      .app-logo {
        height: 100%;
        max-width: 100%;
        display: block;
        margin: 0 auto;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
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
