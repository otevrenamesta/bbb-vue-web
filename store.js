import { loadScript, loadStyle } from './script_service.js'
const isVector = (url) => url.match(/.*.svg$/)

export default (siteconf, user) => { 
  return new Vuex.Store({
    state: {
      user,
      site: siteconf
    },
    getters: {
      mediaUrl: (state) => (media, params) => {
        const murl = media.match(/^https?:\/\//) ? media : `${siteconf.cdn}/${media}`
        if (isVector(murl) || (!params && !murl.match(/^https?:\/\//))) {
          // je to vektor, nebo nechci modifier
          return murl
        }
        return `${siteconf.cdnapi}/resize/?url=${encodeURIComponent(murl)}&${params}`
      },
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