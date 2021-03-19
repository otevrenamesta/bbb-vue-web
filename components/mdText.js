export default {
  props: ['data', 'path'],
  computed: {
    html: function() {
      const html = _.isString(this.$props.data)
        ? marked(this.$props.data)
        : marked(this.$props.data.content)
      return html || ''
    }
  },
  template: `
  <div :class="data.class" v-html="html" />
  `
}