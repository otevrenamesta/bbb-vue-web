/* global Vue, _, moment */
import composition from './components/composition.js'
import MDText from './components/mdText.js'
Vue.component('MDText', MDText)

Vue.component('markdown', {
  props: ['component', 'text'],
  computed: {
    html: function() {
      return this.$props.text.indexOf('\n') > 0
        ? marked(this.$props.text)
        : marked.parseInline(this.$props.text)
    }
  },
  template: '<span :is="component" v-html="html" />'
})

moment.locale('cs')
Vue.filter('formatDate', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY')
  }
})

Vue.filter('longDate', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
})

Vue.component('composition', composition)