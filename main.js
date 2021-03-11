/* global Vue, VueRouter */
import './vuecustoms.js'
import Store from './store.js'
import pageHeader from './template/layout/header.js'
import pageFooter from './template/layout/footer.js'

import Page from './components/page.js'
import MDText from './components/mdText.js'
Vue.component('MDText', MDText)
import _ from './template/index.js'

import SiteSettings from './data/_site.js'

const router = new VueRouter({
  routes: [
    { path: '/:page?', component: Page },
    { path: '/clanek/:slug?', component: Page }
  ]
})

const store = Store(router)

new Vue({
  router,
  store,
  data: { site: SiteSettings },
  components: { pageHeader, pageFooter },
  template: `
  <div>
    <pageHeader :site="site" />    
    <router-view :key="$route.fullPath" />
    <pageFooter :site="site" />
  </div>
  `
}).$mount('#app')
