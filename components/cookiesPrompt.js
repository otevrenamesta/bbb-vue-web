const KEY = 'euconsentid'
const status = localStorage.getItem(KEY) || null

export default (templateManager) => async () => {
  const t = await templateManager.get('cookies.html')
  return {
    data: function () {
      return { status }
    },
    methods: {
      accept: function () {
        localStorage.setItem(KEY, true)
        this.status = true
      },
      refuse: function () {
        localStorage.setItem(KEY, false)
        this.status = false
      }
    },
    template: t || defaultTemplate
  }
}
const defaultTemplate = `
<div v-if="status===null">
  Tento web využívá cookies. Žádné z nich neslouží pro analytické účely.
  <button @click="accept">souhlasím</button>
  <button @click="refuse">nesouhlasím</button>
</div>
`