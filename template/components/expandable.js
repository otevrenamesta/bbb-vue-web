export default {
  data() {
    return {
      visible: false
    }
  },
  props: ['data', 'path'],
  template: `
  <section :class="data.component" @click="$store.dispatch('edit', {data, path})">
    <h1><a href="javascript:void(0)" @click="visible = !visible">{{ data.title }}</a></h1>
    <b-collapse v-model="visible">
      <vue-markdown>{{ data.content }}</vue-markdown>
    </b-collapse>
  </section>
  `
}