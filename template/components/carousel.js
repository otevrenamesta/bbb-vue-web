export default {
  props: ['data', 'path'],
  template: `
  <div @click="$store.dispatch('edit', {data, path})">
    <b-carousel      
      style="text-shadow: 0px 0px 2px #000"
      fade
      indicators
      img-width="1024"
      img-height="480"
    >
      <b-carousel-slide v-for="(i, idx) in data.list" :key="idx" 
        :caption="i.name" :img-src="$store.state.site.cdn + i.url">
      </b-carousel-slide>
    </b-carousel>
  </div>
  `
}
