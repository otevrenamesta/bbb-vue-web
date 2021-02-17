import hero from './components/hero.js'
import imageGrid from './components/imageGrid.js'
import newsPreview from './components/newsPreview.js'
import expandable from './components/expandable.js'
import carousel from './components/carousel.js'
import masonry from './components/masonry.js'
import youtube from './components/youtube.js'
import accordion from './components/accordion.js'
import fullWidthSection from './components/full_width_section.js'
import toNejZProgramu from './components/nej_z_programu.js'

import defaultLayout from './layout/default.js'
import pageLayout from './layout/page.js'
import article from './layout/article.js'
Vue.component('bbbLayoutDefault', defaultLayout)
Vue.component('bbbLayoutPage', pageLayout)
Vue.component('bbbLayoutArticle', article)

Vue.component('hero', hero)
Vue.component('imageGrid', imageGrid)
Vue.component('newsPreview', newsPreview)
Vue.component('expandable', expandable)
Vue.component('carousel', carousel)
Vue.component('masonry', masonry)
Vue.component('youtube', youtube)
Vue.component('accordion', accordion)
Vue.component('fullWidthSection', fullWidthSection)
Vue.component('toNejZProgramu', toNejZProgramu)

export default { hero, imageGrid, newsPreview }
