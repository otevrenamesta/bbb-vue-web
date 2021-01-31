/* global Vue, VueRouter */
import './vuecustoms.js'
import Store from './store.js'
import pageHeader from './template/layout/header.js'
import pageFooter from './template/layout/footer.js'

import Page from './components/page.js'
import EditForm from './components/editForm.js'
Vue.component('EditForm', EditForm)
import _ from './template/index.js'

import SiteSettings from './data/_site.js'

const router = new VueRouter({
  routes: [
    { path: '/:page?', component: Page, name: 'home' },
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
    <EditForm v-if="$store.state.edited" />
    <pageHeader :site="site" />
    <router-view></router-view>
    <pageFooter :site="site" />
  </div>
  `
}).$mount('#app')
