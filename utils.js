
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
  let token = null
  
  function setToken(newToken) {
    localStorage.setItem(KEY, newToken)
    token = newToken
    initUser()
  }

  function makeRequest(method, url, opts = {}) {
    const cfg = { method }
    token && opts.withCredentials && Object.assign(cfg, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
    opts.data 
      && Object.assign(cfg, { body: JSON.stringify(opts.data) })
      && Object.assign(cfg.headers, { 'Content-Type':'application/json' })
    return fetch(url, cfg)
    .then(res => {
      if (res.status === 401) return doLogout()
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
    token = null
    localStorage.removeItem(KEY)
  }
  
  async function initUser () {
    token = localStorage.getItem(KEY)
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
    mediaUrl: (media, params) => mediaUrl(siteconf, media, params)
  }
}