/* global Vue, VueRouter */
import './vuecustoms.js'
import Store from './store.js'
import Page from './components/page.js'

export default async function init (mountpoint, routesUrl, dataUrl) {
  const reqs = await Promise.all([
    axios(routesUrl),
    axios(dataUrl + 'config.json')
  ])
  const webRoutes = _.map(reqs[0].data, i => {
    return { path: i.path, component: () => Page(i.data, dataUrl) }
  })
  const siteconf = reqs[1].data
  
  const router = new VueRouter({
    mode: 'history',
    routes: webRoutes
  })
  const store = Store(router, siteconf)

  new Vue({
    router,
    store,
    components: { 
      pageHeader: () => import(dataUrl + 'template/components/header.js'), 
      pageFooter: () => import(dataUrl + 'template/components/footer.js')
    },
    metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: siteconf.defaulttitle || '--',
      // all titles will be injected into this template
      titleTemplate: `%s | ${siteconf.title}`
    },
    template: `
    <div>
      <pageHeader />
      <router-view :key="$route.fullPath" />
      <pageFooter />
    </div>
    `
  }).$mount(mountpoint)
}

