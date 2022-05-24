
export async function loadSiteConf (config) {
  const r = await axios(config.dataUrl + 'config.yaml')
  return jsyaml.load(r.data)
}

const KEY = window.location.hostname + '_BBB_token'
let token = null
let storeLink = null
let gprofileURL = null
export function setToken(newToken) {
  localStorage.setItem(KEY, newToken)
  token = newToken
  initUser(gprofileURL)
}

export function makeRequest(method, url, opts = {}) {
  const cfg = { method }
  opts.data && Object.assign(cfg, { body: JSON.stringify(opts.data) })
  token && opts.withCredentials && Object.assign(cfg, { 
    headers: { Authorization: `Bearer ${token}` } 
  })
  return fetch(url, cfg).then(res => res.json())
}

export async function initUser (profileURL, store = null) {
  if (store) {
    storeLink = store
    gprofileURL = profileURL
  }
  token = localStorage.getItem(KEY)
  try {
    const user = await makeRequest('get', gprofileURL, { withCredentials: true })
    storeLink.commit('profile', user)
  } catch (err) {
    token = null
    localStorage.removeItem(KEY)
  }
}