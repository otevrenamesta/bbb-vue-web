import linksHijack from './link_hijack.js'

export default {
  props: ['component', 'text'],
  computed: {
    html: function() {
      const text = this.$props.text || ''
      return text.indexOf('\n') > 0 ? marked(text) : marked.parseInline(text)
    },
    c: function() {
      return this.$props.component || 'span'
    }
  },
  methods: {
    handleClicks: linksHijack
  },
  template: '<span :is="c" v-html="html" @click="handleClicks" />'
}