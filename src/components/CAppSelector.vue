<template>
  <b-container
    class="app-selector text-center"
  >
    <div class="logo px-5 mb-5">
      <img
        src="applications/default_logo.jpg"
        class="w-100"
      >
    </div>
    <div class="search w-100 m-auto px-5">
      <b-input
        type="search"
        name="search"
        :aria-label="$t('layout.search')"
        :placeholder="$t('layout.search')"
      />
    </div>
    <draggable
      v-model="appList"
      group="apps"
      class="d-flex flex-wrap justify-content-center mt-4"
      :disabled="!canCreateApplication"
      @end="onDrop"
    >
      <b-card
        v-for="app in appList"
        :key="app.applicationID"
        no-body
        overlay
        :style="`max-width: 16rem;opacity:${app.enabled ? '1' : '0.4'}`"
        class="m-3"
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
    </draggable>
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

</style>
