import hero from './hero.js'
import warning from './warning.js'
import sponzori from './sponzori.js'
import newsPreview from './newsPreview.js'
import expandable from './expandable.js'

Vue.component('hero', hero)
Vue.component('warning', warning)
Vue.component('sponzori', sponzori)
Vue.component('newsPreview', newsPreview)
Vue.component('expandable', expandable)

export default { hero, warning, sponzori, newsPreview }