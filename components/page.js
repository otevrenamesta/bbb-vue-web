/* global axios, API, _ */
import index from '../data/index.js'
import navstevnici from '../data/navstevnici.js'
import page404 from '../data/404.js'

const pageData = { index, navstevnici }

export default {
  computed: {
    page: function () {
      const p = this.$router.currentRoute.path
      const idx = p.slice(1) || 'index'
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