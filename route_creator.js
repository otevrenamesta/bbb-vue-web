import PageCreator from './components/page.js'
import DetailPageCreator from './components/detailPage.js'

export default function createRoutes (routeList, siteconf) {
  const pageCreator = PageCreator(siteconf)
  const detailPageCreator = DetailPageCreator(siteconf)
  
  function _importComponent(component) {
    const url = component.match(/http*./) 
      ? component 
      : `${siteconf.dataUrl}_service/${component}`
    return import(url)
  }
  
  const webRoutes = _.map(routeList, i => {
    return { 
      path: i.path, 
      component: () => pageCreator(i.data)
    }
  })
  _.map(siteconf.detailpages, i => {
    const route = i.component
      ? { path: i.path, component: () => _importComponent(i.component) }
      : { path: `${i.path}:id`, component: () => detailPageCreator(i) }
    webRoutes.push(route)
  })
  return webRoutes
}