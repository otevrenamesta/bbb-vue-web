/* global axios, API, _ */

export default {
  props: ['data', 'path'],
  template: `
  <div :class="data.class">
    <component v-for="(i, idx) in data.children" :key="idx" 
      :is="i.component" :data="i" :path="path + '.' + idx + '.children'">
    </component>
  </div>
  `
}