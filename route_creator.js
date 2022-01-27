import PageCreator from './components/page.js'
import DetailPageCreator from './components/detailPage.js'
import AppPageCreator from './app_page.js'

export default async function createRoutes (routeList, siteconf, componentManager, templateManager) {
  const pageCreator = PageCreator(siteconf, templateManager, componentManager)
  const detailPageCreator = DetailPageCreator(siteconf, templateManager, componentManager)
  
  const webRoutes = _.map(routeList, i => {
    return { 
      path: i.path, 
      component: () => pageCreator(i.data)
    }
  })
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

  return webRoutes
}