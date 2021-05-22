/* global Vue, _, moment */
import composition from './components/composition.js'
import MDText from './components/mdText.js'
import markdown from './components/markdown.js'
import sitemap from './components/sitemap.js'
Vue.component('MDText', MDText)
Vue.component('sitemap', sitemap)
Vue.component('markdown', markdown)

moment.locale('cs')

function _formatDate (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY')
  }
}
Vue.filter('formatDate', _formatDate)
Vue.filter('date', _formatDate)

Vue.filter('longDate', function (value) {
  if (value) {
    value = _.isString(value) ? moment(value) : value
    return value.format('DD.MM.YYYY HH:mm')
  }
})

Vue.component('composition', composition)