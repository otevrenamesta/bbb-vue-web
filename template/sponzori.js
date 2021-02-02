export default {
  props: ['data'],
  template: `
  <section id="sponzori">
    <div class="row">
      <div v-for="i in data.list" class="col-4">
        <img :src="i.url" :alt="i.name" />
      </div>
    </div>
  </section>
  `
}