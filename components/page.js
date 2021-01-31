/* global axios, API, _ */
import index from '../data/index.js'
import navstevnici from '../data/navstevnici.js'

const pageData = { index, navstevnici }

export default {
  computed: {
    page: function () {
      const idx = this.$router.currentRoute.params.page || 'index'
      return pageData[idx]
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