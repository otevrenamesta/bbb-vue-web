export default {
  props: ['data', 'path'],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-8">
          <component v-for="(i, idx) in data.children" :key="idx" 
            :is="i.component" :data="i" :path="path + '.' + idx + '.children'">
          </component>
        </div>

        <div class="col-4">
          <component v-for="(i, idx) in data.sidebar" :key="idx" 
            :is="i.component" :data="i" :path="path + '.' + idx + '.sidebar'">
          </component>
        </div>
      </div>
    </div>
  `
}