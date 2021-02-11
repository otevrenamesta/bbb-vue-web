export default {
  props: ['data', 'path'],
  template: `
  <div :class="data.class">
    <vue-markdown>{{data.content}}</vue-markdown>
  </div>
  `
}