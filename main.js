/* global Vue, VueRouter */
import './vuecustoms.js'
import Store from './store.js'
import Page from './components/page.js'

export async function init (mountpoint, api) {
  const reqs = await Promise.all([
    axios(api + 'routes.json'),
    axios(api + 'config.json')
  ])
  const webRoutes = _.map(reqs[0].data, i => {
    return { path: i.path, component: () => Page(i.data, api) }
  })
  const siteconf = reqs[1].data
  
  const router = new VueRouter({
    routes: webRoutes
      // { path: '/:page?', component: Page },
      // { path: '/clanek/:slug?', component: Page }
  })
  const store = Store(router, siteconf)

  new Vue({
    router,
    store,
    components: { 
      pageHeader: () => import(api + 'template/components/header.js'), 
      pageFooter: () => import(api + 'template/components/footer.js')
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

