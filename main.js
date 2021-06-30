/* global Vue, VueRouter */
import './vuecustoms.js'
import Store from './store.js'
import PageCreator from './components/page.js'

export default async function init (mountpoint, serviceUrl, dataUrl) {
  const reqs = await Promise.all([
    axios(serviceUrl + 'routes.json'),
    axios(dataUrl + 'config.json')
  ])
  const siteconf = reqs[1].data
  Object.assign(siteconf, { serviceUrl, dataUrl })
  const pageCreator = PageCreator(dataUrl, siteconf)
  const webRoutes = _.map(reqs[0].data, i => {
    return { path: i.path, component: () => pageCreator(i.data) }
  })
  
  const router = new VueRouter({
    mode: 'history',
    routes: webRoutes
  })
  const store = Store(siteconf)

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

