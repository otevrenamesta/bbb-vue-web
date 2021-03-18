export default {
  props: ['data', 'path'],
  computed: {
    html: function() {
      const c = this.$props.data.content
      return c ? marked(c) : ''
    }
  },
  template: `
  <div :class="data.class" v-html="html" />
  `
}