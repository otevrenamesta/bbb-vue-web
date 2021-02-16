export default {
  props: ['data', 'path'],
  template: `
    <div class="container">
      <section>
        <h1>{{data.title}}</h1>
      </section>
      <div class="row">
        <div class="col-sm-12 col-md-8 col-lg-9">
          <component v-for="(i, idx) in data.children" :key="idx" 
            :is="i.component" :data="i" :path="path + '.' + idx">
          </component>
        </div>

        <div class="col-sm-12 col-md-4 col-lg-3">
          <component v-for="(i, idx) in data.sidebar" :key="idx" 
            :is="i.component" :data="i" :path="path + '.sidebar.' + idx">
          </component>
        </div>
      </div>
    </div>
  `
}