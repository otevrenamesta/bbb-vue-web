export default {
  props: ['data', 'path'],
  computed: {
    backStyle: function () {
      return `background-image: url('${this.$store.state.site.cdn}${this.$props.data.background}');`
    }
  },
  template: `
  <section id="hero" :style="backStyle">
    <div @click="$store.dispatch('edit', {data, path})" class="container" data-aos="fade-up">
      <div class="row">
        <div class="col-md-6 offset-md-6 p-5">
          <h1>{{ data.title }}</h1>
          <h2>{{ data.subtitle }}</h2>
          <p>{{ data.content }}</p>
        </div>
      </div>
    </div>
  </section>
  `
}