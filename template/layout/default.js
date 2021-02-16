export default {
  props: ['data', 'path'],
  template: `
    <div>
      <component v-for="(i, idx) in data.children" :key="idx" 
          :is="i.component" :data="i" :path="path + '.' + idx">
      </component>
    </div>
  `
}