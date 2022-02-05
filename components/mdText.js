import linksHijack from './link_hijack.js'
import { renderMD } from './markdown.js'

export default {
  props: ['data'],
  computed: {
    html: function() {
      const md = _.isString(this.$props.data) 
        ? this.$props.data 
        : this.$props.data.content
      return md ? renderMD(md, this) : ''
    }
  },
  methods: {
    handleClicks: linksHijack
  },
  template: `
  <div class="MDText" :class="data.class" v-html="html" @click="handleClicks" />
  `
}