
export async function loadSiteConf (serviceUrl, dataUrl) {
  let siteconf = null
  try {
    const r = await axios(serviceUrl + 'config.yaml')
    siteconf = jsyaml.load(r.data)
  } catch (err) {
    if (err.name === "YAMLException") return alert(err.message)
    const r = await axios(dataUrl + 'config.json')
    siteconf = r.data
  }
  return Object.assign(siteconf, { serviceUrl, dataUrl })
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