export default {
  props: ['data', 'path'],
  computed: {
    backStyle: function () {
      return `background-image: url('${this.$props.data.background}');`
    }
  },
  template: `
  <section id="hero" :style="backStyle" class="d-flex flex-column justify-content-center align-items-center">
    <div @click="$store.dispatch('edit', {data, path})" class="container text-center text-md-left" data-aos="fade-up">
      <h1>{{ data.title }}</h1>
      <h2>{{ data.subtitle }}</h2>
      <p>{{ data.content }}</p>
    </div>
  </section>
  `
}