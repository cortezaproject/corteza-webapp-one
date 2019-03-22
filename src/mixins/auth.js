const lsAuthJWTKey = 'auth.jwt'
const lsAuthUserKey = 'auth.user'

export default {
  computed: {
    isAuthenticated () {
      return !!this.getJWT()
    },
  },

  methods: {
    setJWT (jwt) {
      localStorage.setItem(lsAuthJWTKey, jwt)
    },

    getJWT () {
      return localStorage.getItem(lsAuthJWTKey)
    },

    getCurrentUser () {
      return JSON.parse(localStorage.getItem(lsAuthUserKey))
    },

    setCurrentUser (u) {
      localStorage.setItem(lsAuthUserKey, JSON.stringify(u))
    },

    async checkAuthentication (jwt = this.getJWT()) {
      if (!jwt) {
        return Promise.reject(new Error('invalid or empty JWT value'))
      }

      return this.$system.setJWT(jwt).authCheck().then(({ user }) => {
        this.setJWT(jwt)
        this.setCurrentUser(user)
        return Promise.resolve(user)
      })
    },
  },
}
