
const ALREADY_REGISTERED = ['composition', 'MDText']

function findComponents(data, components) {
  return _.reduce(data.children, (acc, i) => {
    if (! _.contains(ALREADY_REGISTERED, i.component)) acc.push(i.component)
    if (i.component === 'composition') {
      return _.union(findComponents(i, acc), acc)
    }
    return acc
  }, components)   
}

export default async function (path, api) {
  const dataReq = await axios.get(api + '/' + path)
  const data = jsyaml.load(dataReq.data)
  const templateReq = await axios.get(api + '/template/layout/' + data.layout + '.html')
  const components = findComponents(data, [])

  function loadComponent(name) {
    const url = api + '/template/components/' + name + '.js'
    return import(url)
  }

  // zatim global registrace
  components.map(name => {
    Vue.component(name, () => loadComponent(name))
  })

  return {
    data: () => ({ data, path: null }),
    created: function () {
      this.$data.path = this.$router.currentRoute.path
    },
    metaInfo () {
      return {
        title: this.$data.data.title,
        meta: [
          { vmid: 'description', name: 'description', content: this.$data.data.desc },
          { vmid: 'keywords', name: 'keywords', content: this.$data.data.keywords }
        ]
      }
    },
    template: templateReq.data
  }
}