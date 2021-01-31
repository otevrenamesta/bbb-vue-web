/* global axios, API, _ */

export default {
  props: ['data', 'path'],
  template: `
  <section id="hero" class="d-flex flex-column justify-content-center align-items-center">
    <div @click="$store.dispatch('edit', {data, path})" class="container text-center text-md-left" data-aos="fade-up">
      <h1>{{ data.title }}</h1>
      <h2>{{ data.subtitle }}</h2>
      <p>{{ data.content }}</p>
    </div>
  </section>
  `
}