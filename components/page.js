
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

function loadComponent(name) {
  const url = API + 'template/components/' + name + '.js'
  return import(url)
}

export default async function (path) {
  const dataReq = await axios.get(API + path)
  const data = jsyaml.load(dataReq.data)
  const templateReq = await axios.get(API + 'template/layout/' + data.layout + '.html')
  const components = findComponents(data, [])

  // zatim global registrace
  components.map(name => {
    Vue.component(name, () => loadComponent(name))
  })

  return {
    data: () => ({ data, path: null }),
    created: function () {
      this.$data.path = this.$router.currentRoute.path
    },
    template: templateReq.data
  }
}