import linksHijack from './link_hijack.js'

export default {
  props: ['data'],
  computed: {
    html: function() {
      const html = _.isString(this.$props.data)
        ? marked(this.$props.data)
        : marked(this.$props.data.content)
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