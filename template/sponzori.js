export default {
  props: ['data'],
  template: `
  <section id="sponzori" class="px-lg-5">
    <div class="row mx-lg-n5">
      <div v-for="i in data.list" class="col py-3 px-lg-5">
        <img :src="i.url" :alt="i.name" />
      </div>
    </div>
  </section>
  `
}