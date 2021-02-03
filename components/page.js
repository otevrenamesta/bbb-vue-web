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
<div>
  <component v-for="(i, idx) in page.components" :key="idx" 
    :is="i.component" :data="i" :path="page.path + '.components.' + idx">
  </component>
</div>
  `
}