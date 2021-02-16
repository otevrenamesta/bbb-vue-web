export default {
  props: ['data', 'path'],
  template: `
  <div :class="data.class" @click="$store.dispatch('edit', {data, path})">
    <vue-markdown>{{data.content}}</vue-markdown>
  </div>
  `
}