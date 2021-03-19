export default {
  props: ['data', 'path'],
  computed: {
    html: function() {
      const c = _.isString(this.$props.data)
        ? this.$props.data 
        : this.$props.data.content
      return c ? marked.parseInline(c) : ''
    }
  },
  template: `
  <div :class="data.class" v-html="html" />
  `
}