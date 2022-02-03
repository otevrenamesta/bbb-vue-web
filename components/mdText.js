import linksHijack from './link_hijack.js'

export default {
  props: ['data'],
  computed: {
    html: function() {
      const renderer = new marked.Renderer()
      const originalLinkRenderer = renderer.link.bind(renderer)
      const self = this
      renderer.link = (href, title, text) => {
        if (href.indexOf('http') !== 0 && href.indexOf('.') >= 0) {
          const url = `${self.$root.cdn}/${href}`
          const icon = '<i class="fas fa-external-link-alt"></i>'
          return `<a href="${url}" target="_blank">${text} ${icon}</a>`
        } else {
          return originalLinkRenderer(href, title, text)
        }
      }

      const md = _.isString(this.$props.data) 
        ? this.$props.data 
        : this.$props.data.content
      const html = marked(md, { renderer })
      return html || ''
    }
  },
  methods: {
    handleClicks: linksHijack
  },
  template: `
  <div class="MDText" :class="data.class" v-html="html" @click="handleClicks" />
  `
}