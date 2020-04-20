<template>
  <div
    class="app-selector"
  >
    <h1>{{ $t('app.general.availableApps') }}</h1>
    <section>
      <div
        v-for="(app) in apps"
        :key="app.ID"
        class="app-item"
      >
        <a
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
        <button @click.prevent="$emit('selected', app)">
          <div
            class="app-logo"
            :style="'background-image:url('+ app.unify.logo +');'"
          />
          <label class="app-name">
            {{ app.unify.name || app.name }}
          </label>
        </button>
      </div>
    </section>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      apps: 'applications/unifyOnly',
    }),
  },
}
</script>
<style lang="scss" scoped>
$open-icon-height: .8rem;

.app-selector {
  text-align: center;

  section {
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
    }

    button {
      margin-top: calc(#{$open-icon-height} / 2);
      height: 110px;
      background: none;
      cursor: pointer;
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
  }
}

</style>
