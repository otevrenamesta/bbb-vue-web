export default {
  data: function () {
    return {
      posts: [
        { title: 'Vystoupeni 1', den: 'patek', hodina: '20:00', content: 'kratke intro vystoupeni' },
        { title: 'Vystoupeni 2', den: 'patek', hodina: '14:00', content: 'kratke intro vystoupeni2' },
        { title: 'Vystoupeni 3', den: 'sobota', hodina: '16:00', content: 'kratke intro vystoupeni3' }
      ]
    }
  },
  props: ['data', 'path'],
  template: `
  <div class="row">
    <div v-for="(i, idx) in posts" :key="idx" class="col">
      <h3>{{ i.title }}</h3>
      <h4>{{ i.den }} - <i>{{ i.hodina }}</i></h4>
      <p>{{ i.content }}</p>
    </div>
  </div>
  `
}
