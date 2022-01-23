
export async function loadSiteConf (config) {
  const r = await axios(config.serviceUrl + 'config.yaml')
  return jsyaml.load(r.data)
}

const KEY = '_BBB_web_user'

export function initUser (profileURL) {
  let user = localStorage.getItem(KEY)
  user = user ? JSON.parse(user) : null
  if (user) return user
  return axios(profileURL)
    .then(res => {
      saveUser(res.data)
      return res.data
    })
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