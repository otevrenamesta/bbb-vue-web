/* global Vue, VueRouter */
import './vuecustoms.js'
import Store from './store.js'
import Page from './components/page.js'

export async function init (mountpoint, api, siteconf) {
  const routesReq = await axios(api + 'routes.json')
  const webRoutes = _.map(routesReq.data, i => {
    return { path: i.path, component: () => Page(i.data, api) }
  })
  
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
    template: `
    <div>
      <pageHeader />
      <router-view :key="$route.fullPath" />
      <pageFooter />
    </div>
    `
  }).$mount(mountpoint)
}

