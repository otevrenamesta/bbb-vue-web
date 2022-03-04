import linksHijack from './link_hijack.js'

export function renderMD (content, self) {
  const renderer = new marked.Renderer()
  // const originalLinkRenderer = renderer.link.bind(renderer)
  function isLocal (href) {
    return href.indexOf('http') !== 0 
    && href.indexOf('.') < 0 // jen odkazy typu /a/b/c/d
    && href.indexOf('mailto') !== 0
  }
  renderer.link = (href, title, text) => {
    if (isLocal(href)) return `<a href="${href}" l="local">${text}</a>`
    const url = href.indexOf('http') === 0 ? href : `${self.$root.cdn}/${href}`
    const icon = '<i class="fas fa-external-link-alt"></i>'
    return `<a href="${url}" target="_blank">${text} ${icon}</a>`
  }
  return content.indexOf('\n') > 0 
    ? marked(content, { renderer })
    : marked.parseInline(content, { renderer })
}

export default {
  props: ['component', 'text'],
  computed: {
    html: function() {
      return this.$props.text ? renderMD(this.$props.text, this) : ''
    }
  },
  methods: {
    handleClicks: linksHijack
  },
  template: `
    <span :is="this.$props.component || 'span'"
      v-html="html" @click="handleClicks" />`
}