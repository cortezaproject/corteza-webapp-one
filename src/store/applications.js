const state = {
  set: [],
}

const getters = {
  set (state) {
    return state.set
  },

  unifyOnly (state) {
    return state.set.filter(({ unify: { listed } = { listed: false } }) => listed)
  },
}

const mutations = {
  updateSet (state, set) {
    state.set = set
  },
}

/**
 * @param localStorage
 * @param api
 */
export default ({ api }) => {
  return {
    namespaced: true,

    state,
    getters,
    mutations,

    actions: {
      async preload ({ commit }) {
        if (api && api.applicationList) {
          return api.applicationList()
            .then(({ set }) => commit('updateSet', set))
        }
      },
    },
  }
}
