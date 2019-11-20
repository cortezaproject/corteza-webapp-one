<template>
  <div>
    <div class="address-lookup">
      <label>
        <gmap-autocomplete
          ref="gmap"
          :select-first-on-enter="true"
          @place_changed="setPlace"
          @keyup.enter="addMarker"
        />
        <button @click="addMarker">{{ $t('app.googleMaps.search') }}</button>
      </label>
    </div>
    <div id="map">
      <gmap-map
        :center="center"
        :zoom="7"
        :options="{gestureHandling: 'greedy'}"
      >
        <gmap-marker
          v-for="(m, index) in markers"
          :key="index"
          :position="m.position"
          :clickable="false"
          :draggable="false"
          @click="center=m.position"
        />
      </gmap-map>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GoogleMap',

  data () {
    return {
      center: { lat: 50, lng: 10 },
      markers: [],
      places: [],
      currentPlace: null,
      gestureHandling: 'greedy',
    }
  },

  methods: {
    // receives a place object via the autocomplete component
    setPlace (place) {
      this.currentPlace = place
    },

    addMarker () {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        }
        this.markers.push({ position: marker })
        this.places.push(this.currentPlace)
        this.center = marker
        this.currentPlace = null
      }
    },

    geolocate: function () {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.address-lookup {
  position: absolute;
  z-index: 1;
  top: 80px;
  left: 15px;
  /deep/ button {
    height: 40px;
    background: #fff;
    padding: 10px;
    border: 1px solid $secondary;
    cursor: pointer;
    font-size: 15px;
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }
}
/deep/ input {
  height: 40px;
  padding: 10px;
  margin-left: -5px;
  width: 200px;
  font-size: 15px;
  &:focus {
    outline: none;
    box-shadow: none;
  }
}

/deep/ .gm-style-mtc {
  div {
    height: 30px!important;
  }
}

.vue-map-container {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  top: 0;
}
</style>
