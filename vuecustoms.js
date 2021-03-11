/* global Vue, _, VueMarkdown, moment, VeeValidate, VeeValidateRules */
import composition from './components/composition.js'

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

Vue.use(VueMarkdown)
Vue.component('composition', composition)