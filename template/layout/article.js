export default {
  props: ['data', 'path'],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-8">
          <component v-for="(i, idx) in data.children" :key="idx" 
            :is="i.component" :data="i" :path="path + '.' + idx">
          </component>
        </div>

        <div class="col-4">
          <component v-for="(i, idx) in data.sidebar" :key="idx" 
            :is="i.component" :data="i" :path="path + '.sidebar.' + idx">
          </component>
        </div>
      </div>
    </div>
  `
}