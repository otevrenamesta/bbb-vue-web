import { loadScript, loadStyle } from './script_service.js'
import { mediaUrl } from './utils.js'

export default (siteconf) => { 
  return new Vuex.Store({
    state: {
      user: null,
      site: siteconf
    },
    getters: {
      mediaUrl: (state) => (media, params) => mediaUrl(siteconf, media, params),
      userLogged: state => {
        return state.user !== null
      }
    },
    mutations: {
      profile: (state, profile) => {
        state.user = profile
      }
    },
    actions: {
      // toast: function (ctx, opts) {
      //   Vue.$toast.open(opts)
      // },
      loadScript: function (ctx, src) {
        return loadScript(src)
      },
      loadStyle: function (ctx, src) {
        return loadStyle(src)
      }
    }
  })
}