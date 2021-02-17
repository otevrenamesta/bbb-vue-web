export default {
  props: ['data', 'path'],
  template: `
  <section :class="data.class">
    <div class="container">
      <div class="row">
          <component v-for="(i, idx) in data.children" :key="idx"
            :is="i.component" :data="i" :path="path + '.children.' + idx">
          </component>
      </div>
    </div>
  </section>
  `
}
