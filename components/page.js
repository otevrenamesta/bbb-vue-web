import page404 from '../data/404.js'
import pageData from '../data/index.js'

export default {
  computed: {
    page: function () {
      const idx = this.$router.currentRoute.path
      return idx in pageData ? pageData[idx] : page404
    }
  },
  template: `
  <component :is="page.layout" :data="page" 
      :path="$router.currentRoute.path + '.children'">
  </component>
  `
}