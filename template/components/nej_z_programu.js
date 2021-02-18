export default {
  data: function () {
    return {
      posts: [
        { title: 'Vystoupeni 1', obrazek: 'http://data.vxk.cz/ts/wp-content/uploads/2020/09/1-16.jpg', den: 'patek', hodina: '20:00', content: 'kratke intro vystoupeni' },
        { title: 'Vystoupeni 2', obrazek: 'http://data.vxk.cz/ts/wp-content/uploads/2020/09/1-16.jpg', den: 'patek', hodina: '14:00', content: 'kratke intro vystoupeni2' },
        { title: 'Vystoupeni 3', obrazek: 'http://data.vxk.cz/ts/wp-content/uploads/2020/09/1-16.jpg', den: 'sobota', hodina: '16:00', content: 'kratke intro vystoupeni3' }
      ]
    }
  },
  props: ['data', 'path'],
  template: `
  <div class="row">
    <div v-for="(i, idx) in posts" :key="idx" class="col">
      <div class="card">
        <img :src="i.obrazek" class="card-img-top" :alt="i.title">
        <div class="card-body">
          <h5 class="card-title">{{ i.title }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">
            {{ i.den }} - <i>{{ i.hodina }}</i>
          </h6>
          <p class="card-text">{{ i.content }}</p>
        </div>
      </div>
    </div>
  </div>
  `
}
