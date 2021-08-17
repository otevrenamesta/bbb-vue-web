import { initUser } from './utils.js'

export default (siteconf, user) => { return new Vuex.Store({
  state: {
    user,
    site: siteconf
  },
  getters: {
    mediaUrl: (state) => (media, params) => {
      const isVector = (url) => url.match(/.*.svg$/)
      const murl = _.isObject(media)
          ? `${siteconf.cdn}/${media.id}/${media.filename}`
          : media.match(/^https?:\/\//)
            ? media : `${siteconf.cdn}/${media}`
      if (isVector(murl) || (!params && !murl.match(/^https?:\/\//))) return murl
      return `${siteconf.cdn}/api/resize/?url=${encodeURIComponent(murl)}&${params}`
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
    toast: function (ctx, opts) {
      Vue.$toast.open(opts)
    }
  }
})}