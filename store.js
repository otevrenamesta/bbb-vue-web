/* global Vue, Vuex, localStorage, LOGGED_USER, axios, _, BBB_SITE */
const loadedUsers = {}

Vue.filter('username', function (uid) {
  return loadedUsers[uid] || 'unknown'
})

export default (router) => { return new Vuex.Store({
  state: {
    user: LOGGED_USER,
    site: BBB_SITE,
    editwindow: null,
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
      if (!state.editwindow) {
        state.editwindow = window.open(EDITOR, "Editor")
      }
      state.editwindow.postMessage(edited, EDITOR)
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

window.addEventListener("message", (event) => {
  // Do we trust the sender of this message?
  if (event.origin !== "http://example.com:8080")
    return;

  // event.source is window.opener
  // event.data is "hello there!"

  // Assuming you've verified the origin of the received message (which
  // you must do in any case), a convenient idiom for replying to a
  // message is to call postMessage on event.source and provide
  // event.origin as the targetOrigin.
  event.source.postMessage("hi there yourself!  the secret response " +
                           "is: rheeeeet!",
                           event.origin);
}, false);