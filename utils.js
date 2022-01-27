
export async function loadSiteConf (config) {
  const r = await axios(config.serviceUrl + 'config.yaml')
  return jsyaml.load(r.data)
}

const KEY = '_BBB_web_user'

export function makeRequest (method, url, opts = {}) {
  return axios({ 
    method, 
    url, 
    data: opts.data || null, 
    withCredentials: opts.withCredentials || false 
  }).then(res => res.data)
}

export function initUser (profileURL) {
  // let user = localStorage.getItem(KEY)
  // user = user ? JSON.parse(user) : null
  // if (user) return user
  return makeRequest('get', profileURL, { withCredentials: true })
    .catch(err => {
      return null
    })
}

function removeUser () {
  localStorage.removeItem(KEY)
}

export function saveUser (user) {
  localStorage.setItem(KEY, JSON.stringify(user))
}