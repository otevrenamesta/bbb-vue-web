export default {
  props: ['data', 'path'],
  template: `
  <div class="card-columns masonry" @click="$store.dispatch('edit', {data, path})">
    <div class="card" v-for="(i, idx) in data.list" :key="idx">
      <img :src="$store.state.site.cdn + i.url" :alt="i.name" />
    </div>
  </div>
  `
}
