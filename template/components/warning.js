export default {
  props: ['data'],
  template: `
  <section id="warning">
    <div class="alert alert-danger container text-center text-md-left">
      {{ data.content }}
    </div>
  </section>
  `
}