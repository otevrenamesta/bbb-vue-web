/* global axios, API, _ */

export default {
  props: ['data'],
  template: `
  <section id="warning">
    <div class="alert alert-danger container text-center text-md-left" data-aos="fade-up">
      <p>{{ data.content }}</p>
    </div>
  </section>
  `
}