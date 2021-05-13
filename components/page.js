
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

export default function pageCreator (dataUrl) {
  function loadComponent(name) {
    const url = dataUrl + 'template/components/' + name + '.js'
    return import(url)
  }
  // load header and footer
  Vue.component('pageHeader', () => loadComponent('header'))
  Vue.component('pageFooter', () => loadComponent('header'))

  return async function (path) {
    const dataReq = await axios.get(dataUrl + path)
    const data = jsyaml.load(dataReq.data)
    const templateReq = await axios.get(dataUrl + 'template/layout/' + data.layout + '.html')
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
      computed: {
        components: function () {
          return _.filter(this.$data.data.children, i => (!i.disabled))
        }
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
}