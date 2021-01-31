/* global axios, API, _ */
import formComponents from '../vue-bs-dynamic-form/index.js'
import formConfigs from '../data/_config/index.js'

export default {
  data: () => {
    return {
      form: {},
      origData: null
    }
  },
  async created () {
    const component = this.$store.state.edited.data.component
    this.$data.form = formConfigs[component]
    this.$data.origData = Object.assign({}, this.$store.state.edited.data)
  },
  methods: {
    async handleSubmit () {
      try {
        await axios.put(`${API}/data`, this.$store.state.edited)
        this.$store.commit('stopEdit')
      } catch(err) {
        console.log(err)
      }
    },
    cancel () { // revert any changes
      Object.assign(this.$store.state.edited.data, this.$data.origData)
      this.$store.commit('stopEdit')
    }
  },
  components: formComponents,
  template: `
<div>
  <ValidationObserver v-slot="{ invalid }">
    <form @submit.prevent="handleSubmit">

      <component v-for="c in form" :key="c.name" 
        :is="'dyn-' + c.component" :config="c" :data="$store.state.edited.data">
      </component>

      <b-button type="submit" class="mt-3" :disabled="invalid">
        Uložit
      </b-button>
      <b-button class="mt-3" @click="cancel">
        Storno
      </b-button>
    </form>
  </ValidationObserver>
</div>
  `
}