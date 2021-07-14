
export async function loadSiteConf (serviceUrl, dataUrl) {
  let siteconf = null
  try {
    const r = await axios(serviceUrl + 'config.yaml')
    siteconf = jsyaml.load(r.data)
  } catch (err) {
    const r = await axios(dataUrl + 'config.json')
    siteconf = r.data
  }
  return Object.assign(siteconf, { serviceUrl, dataUrl })
}