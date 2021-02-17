export default {
  props: ['data', 'path'],
  template: `
    <div class="row imageGrid" @click="$store.dispatch('edit', {data, path})">
      <div v-for="i in data.list" class="col-sm">
        <img :src="i.url" :alt="i.name" />
      </div>
    </div>
  `
}