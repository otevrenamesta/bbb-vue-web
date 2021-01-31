/* global Vue, Vuex, localStorage, LOGGED_USER, axios, _ */
const loadedUsers = {}

Vue.filter('username', function (uid) {
  return loadedUsers[uid] || 'unknown'
})

export default (router) => { return new Vuex.Store({
  state: {
    user: LOGGED_USER,
    edited: null
  },
  getters: {
    userLogged: state => {
      return state.user !== null
    },
    UID: state => (state.user.id),
    isMember: state => group => {
      try {
        return LOGGED_USER.groups.indexOf(group) >= 0
      } catch (_) {
        return false
      }
    }
  },
  mutations: {
    profile: (state, profile) => {
      state.user = profile
    },
    startEdit: (state, edited) => {
      state.edited = edited
    },
    stopEdit: function (state) {
      state.edited = null
    },
  },
  actions: {
    toast: function (ctx, opts) {
      Vue.$toast.open(opts)
    },
    edit: function (ctx, opts) {
      ctx.commit('startEdit', opts)
    },
    loadusers: function (ctx, opts) {
      const toBeLoaded = _.filter(opts, i => !(i in loadedUsers))
      return new Promise(resolve => {
        toBeLoaded.length === 0 ? resolve() : setTimeout(() => {
          console.log(`loaded: ${JSON.stringify(toBeLoaded)}`)
          _.each(toBeLoaded, uid => {
            loadedUsers[uid] = 'jssjfls' + uid
          })
          resolve()
        }, 300)
      })
    }
  }
})}
