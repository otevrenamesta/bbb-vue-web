/* global Vue, Vuex, localStorage, LOGGED_USER, axios, _ */
const loadedUsers = {}

Vue.filter('username', function (uid) {
  return loadedUsers[uid] || 'unknown'
})

export default (router, siteconf) => { return new Vuex.Store({
  state: {
    user: null,
    site: siteconf,
    editwindow: null,
    edited: null
  },
  getters: {
    mediaUrl: (state) => (media, params) => {
      const p = _.isArray(params) ? params.join('&') : params
      return _.isString(media)
        ? media.match(/^https?:\/\//)
          ? `${siteconf.cdn}/?url=${encodeURIComponent(media)}&${p}`
          : `${siteconf.cdn}/${media}?${p}`
        : `${siteconf.cdn}/${media.id}/${media.filename}?${p}`
    }
    // userLogged: state => {
    //   return state.user !== null
    // },
    // UID: state => (state.user.id),
    // isMember: state => group => {
    //   try {
    //     return LOGGED_USER.groups.indexOf(group) >= 0
    //   } catch (_) {
    //     return false
    //   }
    // }
  },
  mutations: {
    profile: (state, profile) => {
      state.user = profile
    }
  },
  actions: {
    toast: function (ctx, opts) {
      Vue.$toast.open(opts)
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