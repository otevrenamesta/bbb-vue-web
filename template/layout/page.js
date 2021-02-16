export default {
  props: ['data', 'path'],
  template: `
    <div class="container">
      <section>
        <h1>{{data.title}}</h1>
      </section>
      <div class="row">
        <div class="col-12">
          <component v-for="(i, idx) in data.children" :key="idx" 
            :is="i.component" :data="i" :path="path + '.' + idx">
          </component>
        </div>
      </div>
    </div>
  `
}