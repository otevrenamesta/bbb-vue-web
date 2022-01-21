// const outer = {
//   props: ['class'],
//   template: '<div :class="class">{{slot}}</div>'
// }

export default {
  data() {
    return {
      myClass: null,
      innerClasses: null
    }
  },
  props: ['data'],
  mounted() {
    const parts = this.$props.data.class ? this.$props.data.class.split('>') : []
    this.$data.innerClasses = parts.length > 1 ? parts.slice(1) : null
    this.$data.myClass = parts.length > 0 ? parts[0] : null
  },
  computed: {
    restdata () {
      return Object.assign({}, this.$props.data, { class: this.$data.innerClasses.join('>') })
    }
  },
  template: `
  <div :class="myClass">
    <composition v-if="innerClasses" :data="restdata" />
    <component v-else v-for="(i, idx) in data.children" :key="idx" 
      :is="i.component" :data="i" />
  </div>
  `
}