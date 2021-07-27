/* global Vue, VueRouter */
import './vuecustoms.js'
import Store from './store.js'
import PageCreator from './components/page.js'
import DetailPageCreator from './components/detailPage.js'
import { loadSiteConf } from './utils.js'

export default async function init (mountpoint, serviceUrl, dataUrl) {
  const reqs = await Promise.all([
    axios(serviceUrl + 'routes.json'),
    loadSiteConf(serviceUrl, dataUrl)
  ])
  const siteconf = reqs[1]
  const pageCreator = PageCreator(dataUrl, siteconf)
  const detailPageCreator = DetailPageCreator(dataUrl, siteconf)
  const webRoutes = _.map(reqs[0].data, i => {
    return { path: i.path, component: () => pageCreator(i.data) }
  })
  _.map(siteconf.detailpages, i => {
    const route = i.component
      ? { path: i.path, component: () => import(i.component) }
      : { path: `${i.path}:id`, component: () => detailPageCreator(i) }
    webRoutes.push(route)
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

