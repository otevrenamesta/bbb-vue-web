
export async function loadSiteConf (config) {
  const r = await axios(config.dataUrl + 'config.yaml')
  return jsyaml.load(r.data)
}

const isVector = (url) => url.match(/.*.svg$/)
export function mediaUrl (siteconf, media, params) {
  const murl = media.match(/^https?:\/\//) ? media : `${siteconf.cdn}/${media}`
  if (isVector(murl) || (!params && !murl.match(/^https?:\/\//))) {
    // je to vektor, nebo nechci modifier
    return murl
  }
  return `${siteconf.cdnapi}/resize/?url=${encodeURIComponent(murl)}&${params}`
}

const KEY = window.location.hostname + '_BBB_token'

export function getMethods(siteconf, store) {

  function addToast (message, type = 'success') {
    this.$data.toast = message
    setTimeout(() => {
      this.$data.toast = null
    }, 3000)
  }
  
  function setToken(newToken) {
    localStorage.setItem(KEY, newToken)
    initUser()
  }

  function makeRequest(method, url, opts = {}) {
    const cfg = { method }
    const token = localStorage.getItem(KEY)
    token && opts.withCredentials && Object.assign(cfg, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
    opts.data 
      && Object.assign(cfg, { body: JSON.stringify(opts.data) })
      && Object.assign(cfg.headers, { 'Content-Type':'application/json' })
    return fetch(url, cfg)
    .then(res => {
      if (res.status === 401 && localStorage.getItem(KEY) !== token) {
        return doLogout()
      }
      const ctype = res.headers.get('Content-Type')
      return ctype && ctype.indexOf('json') >= 0 ? res.json() : res.text()
    })
  }

  function login () {
    window.location.href = siteconf.api + '/nia/login'
  }
  
  async function logout () {
    const url = siteconf.api + '/nia/logout'
    const logoutURL = await makeRequest('get', url, { withCredentials: true })
    doLogout()
    window.location.href = logoutURL
  }

  function doLogout () {
    store.commit('profile', null)
    siteconf.user = null
    localStorage.removeItem(KEY)
  }
  
  async function initUser () {
    const token = localStorage.getItem(KEY)
    if (!token) {
      store.commit('profile', null)
      siteconf.user = null
      return
    }
    try {
      const user = await makeRequest('get', siteconf.profileURL, { withCredentials: true })
      if (user) {
        store.commit('profile', user)
        siteconf.user = user
      }
    } catch (_) {}
  }

  return {
    request: makeRequest,
    login, logout,
    setToken,
    initUser,
    addToast,
    mediaUrl: (media, params) => mediaUrl(siteconf, media, params)
  }
}