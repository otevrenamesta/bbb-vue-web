/* global Vue, VueRouter */
import './vuecustoms.js'
import Store from './store.js'

import Page from './components/page.js'

async function init () {
  const routesReq = await axios(API + 'routes.json')
  const webRoutes = _.map(routesReq.data, i => {
    return { path: i.path, component: () => Page(i.data) }
  })
  
  const router = new VueRouter({
    routes: webRoutes
      // { path: '/:page?', component: Page },
      // { path: '/clanek/:slug?', component: Page }
  })
  const store = Store(router)

  new Vue({
    router,
    store,
    components: { 
      pageHeader: () => import(API + 'template/components/header.js'), 
      pageFooter: () => import(API + 'template/components/footer.js')
    },
    template: `
    <div>
      <pageHeader />
      <router-view :key="$route.fullPath" />
      <pageFooter />
    </div>
    `
  }).$mount('#app')
}

init()

