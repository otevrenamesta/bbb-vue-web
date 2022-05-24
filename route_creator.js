import PageCreator from './components/page.js'
import DetailPageCreator from './components/detailPage.js'
import AppPageCreator from './app_page.js'
import { setToken } from './utils.js'

async function _getYAMLRoutes (siteconf, pageCreator) {
  const routes = []
  async function _loadFolder (folder) {
    const promises = []
    const contentReq = await axios.get(siteconf.dataUrl + 'pages/' + folder)
    _.map(contentReq.data, i => {
      const match = i.name.match(/^(\w+).yaml$/)
      if (i.type === 'file' && match) {
        const path = folder + (i.name === 'index.yaml' ? '/' : match[1])
        routes.push({ 
          path: path.replace(/(\/){2,}/g, '/'), 
          component: () => pageCreator(folder + '/' + i.name)
        })
      } else if (i.type === 'directory') {
        promises.push(_loadFolder(`${folder}/${i.name}/`))
      }
    })
    return Promise.all(promises)
  }
  await _loadFolder('/')
  return routes
}

export default async function createRoutes (siteconf, componentManager, templateManager) {
  const pageCreator = PageCreator(siteconf, templateManager, componentManager)
  const detailPageCreator = DetailPageCreator(siteconf, templateManager, componentManager)
  
  const webRoutes = await _getYAMLRoutes(siteconf, pageCreator)
  _.map(siteconf.detailpages, i => {
    const route = i.component
      ? { path: i.path, component: () => componentManager.load(i.component) }
      : { path: `${i.path}:id`, component: () => detailPageCreator(i) }
    webRoutes.push(route)
  })

  const createAppPage = AppPageCreator(siteconf, templateManager, componentManager)
  const promises = _.map(siteconf.apps, async i => {
    const mod = await componentManager.load(i.module)
    mod.setup(webRoutes, i.path, i, createAppPage)
  })
  await Promise.all(promises)
  webRoutes.push({ 
    path: `/_t/:t?`, 
    beforeEnter: (to, from, next) => {
      setToken(to.params.t || to.query.t)
      next('/')
    }
  })

  return webRoutes
}