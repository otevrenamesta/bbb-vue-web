import './vuecustoms.js'
import Store from './store.js'
import { loadSiteConf, initUser, makeRequest } from './utils.js'
import createRoutes from './route_creator.js'
import ComponentManager from './component_manager.js'
import TemplateManager from './template_manager.js'
import CookiesPromptFN from './components/cookiesPrompt.js'

export default async function init (mountpoint, config) {
  const siteconf = await loadSiteConf(config)
  Object.assign(siteconf, config)
  const componentManager = ComponentManager(siteconf)
  const templateManager = TemplateManager(siteconf)
  const store = Store(siteconf)
  initUser(siteconf.profileURL, store)
  
  const router = new VueRouter({
    mode: 'history',
    routes: await createRoutes(siteconf, componentManager, templateManager)
  })
  router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0)
    next()
  })

  new Vue({
    data: siteconf,
    router,
    store,
    metaInfo: {
      // if no subcomponents specify a metaInfo.title, this title will be used
      title: siteconf.defaulttitle || '--',
      // all titles will be injected into this template
      titleTemplate: `%s | ${siteconf.title}`
    },
    components: {
      SiteHeader: () => componentManager.load('header.js'),
      SiteFooter: () => componentManager.load('footer.js'),
      CookiesPrompt: CookiesPromptFN(templateManager)
    },
    methods: {
      request: makeRequest
    },
    template: `
    <div>
      <SiteHeader />
      <CookiesPrompt />
      <router-view :key="$route.fullPath" />
      <SiteFooter />
    </div>
    `
  }).$mount(mountpoint)
}

