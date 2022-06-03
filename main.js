import './vuecustoms.js'
import Store from './store.js'
import { loadSiteConf, getMethods } from './utils.js'
import createRoutes from './route_creator.js'
import ComponentManager from './component_manager.js'
import TemplateManager from './template_manager.js'
import CookiesPromptFN from './components/cookiesPrompt.js'

export default async function init (mountpoint, config) {
  const siteconf = await loadSiteConf(config)
  Object.assign(siteconf, config, { user: null, toast: '' })
  const componentManager = ComponentManager(siteconf)
  const templateManager = TemplateManager(siteconf)
  const store = Store(siteconf)
  const methods = getMethods(siteconf, store)
  methods.initUser(store)
  
  const router = new VueRouter({
    mode: 'history',
    routes: await createRoutes(siteconf, componentManager, templateManager, methods)
  })
  router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0)
    next()
  })

  new Vue({
    data: siteconf,
    computed: {
      userLogged: function () { return siteconf.user !== null }
    },
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
    methods,
    template: `
    <div>
      <SiteHeader />
      <CookiesPrompt />
      <router-view :key="$route.fullPath" />
      <SiteFooter />
      <div v-if="toast" id="snackbar">{{ toast }}</div>
    </div>
    `
  }).$mount(mountpoint)
}

