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
        <button
          class="star"
          :disabled="!canPin || !app.canUpdateApplication"
          @click="handlePin((app.flags || []).includes('pinned'), app.applicationID)"
        >
          <svg
            viewBox="0 0 16 16"
            class="star-icon"
          >
            <path
              v-if="(app.flags || []).includes('pinned')"
              d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
            />
            <path
              v-else-if="hovered === app.applicationID && canPin && app.canUpdateApplication"
              d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"
            />
          </svg>
        </button>
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
          @click.prevent="$emit('selected', app)"
        >
          <div
            class="app-logo"
            :class="{ 'opacity-3': !app.enabled }"
            :style="`background-image:url('${app.unify.logo}');opacity:${app.enabled ? '1' : '0.4'}`"
          />
          <label class="app-name">
            {{ app.unify.name || app.name }}
          </label>
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
    max-width: 610px;
    margin: 2rem auto;
    display: flex;
    flex-wrap: wrap;

    .app-item {
      position: relative;
      &:hover {
        background: $light;
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
      margin-top: calc(#{$open-icon-height} / 2);
      height: 110px;
      background: none;
      border: 0;
      width:  200px;

      .app-logo {
        height: 75%;
        max-width: 75%;
        display: block;
        margin: 0 auto;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
      .app-name {
        height: 25%;
      }
    }

    button:disabled {
      cursor: not-allowed;
    }
  }
}

</style>
