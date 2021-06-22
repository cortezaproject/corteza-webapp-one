<template>
  <b-container
    class="app-selector d-flex flex-column text-center m-0 p-0 mw-100"
  >
    <div class="logo px-5">
      <img
        src="applications/default_logo.jpg"
        class="w-100"
      >
    </div>

    <div class="search w-100 mx-auto mt-4 mb-3 px-5">
      <b-input
        v-model="query"
        type="search"
        name="search"
        debounce="200"
        :aria-label="$t('layout.search')"
        :placeholder="$t('layout.search')"
      />
    </div>

    <draggable
      v-if="filteredApps.length"
      v-model="appList"
      group="apps"
      class="h-100 overflow-auto"
      :disabled="!canCreateApplication || query"
      @end="onDrop"
    >
      <transition-group
        name="apps"
        tag="div"
        class="d-flex flex-wrap justify-content-center mw-transition-group m-auto"
      >
        <b-card
          v-for="app in filteredApps"
          :key="app.applicationID"
          no-body
          overlay
          :style="`max-width: 16rem;`"
          class="app m-2"
          @mouseover="hovered = app.applicationID"
          @mouseleave="hovered = undefined"
        >
          <b-card-img
            :src="app.unify.logo"
            :alt="app.unify.name || app.name"
            class="rounded-bottom"
          />

          <b-card-title
            class="my-4 h5"
          >
            {{ app.unify.name || app.name }}
          </b-card-title>

          <b-link
            :disabled="!app.enabled"
            :href="app.unify.url"
            target="_blank"
            :style="[{ cursor: `${app.enabled ? 'pointer': canCreateApplication ? 'grab' : 'default'}` }]"
            class="stretched-link"
          />
        </b-card>
      </transition-group>
    </draggable>

    <div
      v-else
      class="d-flex justify-content-center"
    >
      <h4 class="mt-5">
        {{ $t('layout.noApps') }}
      </h4>
    </div>
  </b-container>
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
      query: '',

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

    filteredApps () {
      const query = (this.query || '').toUpperCase()
      return this.query ? this.appList.filter(({ name }) => (name.toUpperCase()).includes(query)) : this.appList
    },
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
.app-selector {
  .logo {
    img {
      max-width: 400px;
    }
  }

  .search {
    max-width: 600px;
    input[type="search"]::-webkit-search-cancel-button {
      -webkit-appearance: none;
      height: 13px;
      width: 13px;
      background: url("data:image/svg+xml;charset=UTF-8,%3csvg viewPort='0 0 12 12' version='1.1' xmlns='http://www.w3.org/2000/svg'%3e%3cline x1='1' y1='11' x2='11' y2='1' stroke='black' stroke-width='2'/%3e%3cline x1='1' y1='1' x2='11' y2='11' stroke='black' stroke-width='2'/%3e%3c/svg%3e");
    }
  }

  .mw-transition-group {
    max-width: 55%;
  }

  .app {
    transition: all 0.2s ease;
    box-shadow: 0;
    top: 0;

    &:hover {
      transition: all 0.2s ease;
      box-shadow: 0px 4px 8px rgba(38, 38, 38, 0.2);
      top: -2px;
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

  .apps-leave-active {
    position: absolute;
    transition: opacity 0.25s ease;
  }
  .apps-enter, .apps-leave-to {
    opacity: 0;
  }

  .apps-move {
    transition: transform 0.25s ease;
  }
}
</style>
