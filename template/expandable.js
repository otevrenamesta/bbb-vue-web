export default {
  props: ['data', 'path'],
  template: `
  <section :class="data.component">
    <h1>{{ data.title }}</h1>
    <p>{{ data.content }}</p>
  </section>
  `
}