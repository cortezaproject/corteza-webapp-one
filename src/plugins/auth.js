import axios from 'axios'
import { User } from '@/types'

// Handles basic auth comm + state management
export default {
  install (Vue) {
    Vue.prototype.$auth = {
      baseURL () {
        return window.CrustConfig.auth.baseUrl || 'https://auth.api.latest.rustbucket.io'
      },

      api () {
        return axios.create({
          baseURL: this.baseURL(),
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      },

      async clear () {
        return new Promise((resolve, reject) => {
          this.api()
            .delete(`/check`)
            .then(({ data }) => {
              resolve()
            })
            .catch(error => {
              reject(error || new Error('Protocol error'))
            })
        })
      },

      async check () {
        return new Promise((resolve, reject) => {
          this.api()
            .get(`/check`)
            .then(({ data }) => {
              if (!data.response) {
                // Not authenticated
                // make sure this is reflected in the state
                reject(new Error('Not authenticated'))
              } else {
                // Authentication successful, update state
                // and notify the caller
                console.debug('AuthCheck:', data.response.user)
                resolve(new User(data.response.user))
              }
            })
            .catch(error => {
              reject(error || new Error('Protocol error'))
            })
        })
      },
    }
  },
}
