<template>
  <b-container
    fluid
    class="app-selector d-flex flex-column text-center m-0 p-0 mw-100"
  >
    <div class="d-flex justify-content-center align-items-center">
      <b-img
        :src="logo"
        class="logo px-3"
      />
    </div>

    <div class="search flex-shrink-2 w-100 mx-auto mt-4 mb-3 px-5">
      <div class="flex-grow-1 mt-1">
        <b-input-group
          data-v-onboarding="app-list"
        >
          <b-form-input
            v-model.trim="query"
            class="float-right mw-100"
            type="search"
            name="search"
            debounce="200"
            :aria-label="$t('search')"
            :placeholder="$t('search')"
          />
          <b-input-group-append>
            <b-input-group-text class="text-primary bg-white">
              <font-awesome-icon
                :icon="['fas', 'search']"
              />
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
      </div>
    </div>

    <div
      class="overflow-auto"
    >
      <b-container
        fluid="xl"
        class="h-100"
      >
        <b-row>
          <draggable
            v-if="filteredApps.length"
            v-model="appList"
            group="apps"
            class="h-100 w-100"
            :disabled="!canCreateApplication || query || isMobileResolution"
            @end="onDrop"
          >
            <transition-group
              name="apps"
              tag="div"
              class="d-flex flex-wrap justify-content-center m-2 m-xl-0 pt-1"
            >
              <b-col
                v-for="app in filteredApps"
                :key="app.applicationID"
                cols="12"
                sm="6"
                md="6"
                lg="4"
                xl="3"
                class="p-0 mb-4"
                :data-v-onboarding="getStepName(app.unify.url)"
              >
                <b-card
                  no-body
                  overlay
                  class="app h-100"
                  @mouseover="hovered = app.applicationID"
                  @mouseleave="hovered = undefined"
                >
                  <div
                    class="align-content-center d-flex flex-grow-1 flex-wrap"
                  >
                    <b-card-img
                      :src="app.unify.logo"
                      :alt="app.unify.name || app.name"
                      class="rounded-bottom thumbnail"
                    />
                  </div>

                  <b-card-text
                    class="my-4 h6"
                  >
                    {{ app.unify.name || app.name }}
                  </b-card-text>

                  <b-link
                    :disabled="!app.enabled"
                    :href="app.unify.url"
                    :style="[{ cursor: `${app.enabled ? 'pointer': canCreateApplication ? 'grab' : 'default'}` }]"
                    class="stretched-link"
                  />
                </b-card>
              </b-col>
            </transition-group>
          </draggable>

          <div
            v-else
            class="d-flex justify-content-center w-100"
          >
            <h4
              class="mt-5"
            >
              {{ $t('no-applications') }}
            </h4>
          </div>
        </b-row>
      </b-container>
    </div>

    <portal
      to="topbar-help-dropdown"
    >
      <b-dropdown-item
        @click="$refs.tour.onStartClick()"
      >
        {{ $t('start-tour') }}
      </b-dropdown-item>
    </portal>

    <tour-start
      @start="startTour"
    />

    <tour
      ref="tour"
      name="app-list"
      :steps="filteredSteps"
    />
  </b-container>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Draggable from 'vuedraggable'
import { components } from '@cortezaproject/corteza-vue'
const { Tour, TourStart } = components

export default {
  i18nOptions: {
    namespaces: 'layout',
  },

  components: {
    Draggable,
    Tour,
    TourStart,
  },

  props: {
    logo: {
      type: String,
      default: () => '',
    },
  },

  data () {
    return {
      query: '',

      appList: [],

      canCreateApplication: false,
      canPin: false,

      hovered: undefined,

      isMobileResolution: false,

      steps: [
        { name: 'app-list', dynamic: false },
        { name: 'low-code', dynamic: true },
        { name: 'crm', dynamic: true },
        { name: 'reporter', dynamic: true },
        { name: 'workflow', dynamic: true },
        { name: 'profile', dynamic: false },
      ],

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

    filteredSteps () {
      return this.steps.filter(step => {
        if (step.dynamic) {
          return this.filteredApps.some(app => {
            return this.getStepName(app.unify.url) === step.name
          })
        }
        return true
      }).map(s => { return s.name })
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
    if (window.innerWidth < 576) {
      this.isMobileResolution = true
    }
    this.$nextTick(() => {
      this.startTour()
    })
  },

  methods: {
    ...mapActions({
      reorderApp: 'applications/reorder',
      pinApp: 'applications/pin',
      unpinApp: 'applications/unpin',
    }),

    getStepName (url) {
      switch (url) {
        case 'compose/':
          return 'low-code'
        case 'compose/ns/crm/pages':
          return 'crm'
        case 'reporter/':
          return 'reporter'
        case 'workflow/':
          return 'workflow'
      }
    },

    fetchEffective () {
      this.$SystemAPI.permissionsEffective({ resource: 'application' })
        .then(p => {
          this.canCreateApplication = p.find(per => per.operation === 'application.create').allow || false
          // this.canPin = p.find(({ resource, operation, allow }) => resource === 'system' && operation === 'application.flag.self').allow
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

    startTour () {
      this.$refs.tour.onStart()
    },
  },
}
</script>
<style lang="scss" scoped>
.app-selector {
  .logo {
    max-height: 25vh;
    max-width: 500px;
    width: auto;
  }

  @media only screen and (max-width: 576px) {
    .logo {
      max-width: 100%;
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

  .app {
    transition: all 0.2s ease;
    box-shadow: 0;
    top: 0;
    margin: 0 0.625rem;

    .thumbnail {
      max-width: 100%;
      max-height: 150px;
      object-fit: cover;
    }

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
