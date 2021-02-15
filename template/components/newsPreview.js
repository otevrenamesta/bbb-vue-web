export default {
  data: function () {
    return {
      posts: [
        { title: 'Novinka 1', published: '1-2-2020', content: 'Dlouha zprava o novince 1' },
        { title: 'Novinka 3', published: '1-2-2020', content: 'Dlouha zprava o novince 2' },
        { title: 'Novinka 2', published: '1-2-2020', content: 'Dlouha zprava o novince 3' }
      ]
    }
  },
  props: ['data', 'path'],
  template: `
  <section id="newsPreview">
    <div class="row align-items-start" @click="$store.dispatch('edit', {data, path})">
      <div v-for="(i, idx) in posts" :key="idx" class="col">
        <h2>{{ i.title }}</h2>
        <h4>{{ i.published }}</h4>
        <p>{{ i.content }}</p>
      </div>
    </div>
  </section>
  `
}