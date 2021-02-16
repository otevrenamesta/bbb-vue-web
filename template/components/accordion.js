export default {
  data() {
    return {
      visible: 0
    }
  },
  methods: {
    isCollapsed(idx) {
      return this.$data.visible === idx
    }
  },
  props: ['data', 'path'],
  template: `
  <section :class="data.component" @click="$store.dispatch('edit', {data, path})">

    <div class="accordion">
      <div class="card" v-for="(i, idx) in data.sections" :key="idx">
        <div class="card-header">
          <h2 class="mb-0">
            <button class="btn btn-link btn-block text-left" type="button" 
                  @click="visible = idx">
              {{ i.title }}
            </button>
          </h2>
        </div>
        <div class="collapse" :class="{show: isCollapsed(idx)}">
          <div class="card-body">
            <vue-markdown>{{ i.content }}</vue-markdown>
          </div>
        </div>
      </div>
    </div>

  </section>
  `
}