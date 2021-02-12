export default {
  props: ['data', 'path'],
  template: `
  <section id="imageGrid" class="px-lg-5">
    <div class="row" @click="$store.dispatch('edit', {data, path})">
      <div v-for="i in data.list" class="col py-3 px-lg-5">
        <img :src="i.url" :alt="i.name" />
      </div>
    </div>
  </section>
  `
}