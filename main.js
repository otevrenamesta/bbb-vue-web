import './vuecustoms.js'
import Store from './store.js'
import { loadSiteConf, initUser } from './utils.js'
import createRoutes from './route_creator.js'

export default async function init (mountpoint, serviceUrl, dataUrl) {
  const reqs = await Promise.all([
    axios(serviceUrl + 'routes.json'),
    loadSiteConf(serviceUrl, dataUrl)
  ])
  const siteconf = Object.assign(reqs[1], { dataUrl })
  const user = initUser(siteconf.profileURL)
  
  const router = new VueRouter({
    mode: 'history',
    routes: createRoutes(reqs[0].data, siteconf)
  })
  const store = Store(siteconf, await user)

  new Vue({
    router,
    store,
    metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: siteconf.defaulttitle || '--',
      // all titles will be injected into this template
      titleTemplate: `%s | ${siteconf.title}`
    },
    template: `<router-view :key="$route.fullPath" />`
  }).$mount(mountpoint)
}

