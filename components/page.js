
const ALREADY_REGISTERED = ['composition', 'MDText']
const _loaded = {}

function findComponents(data, components) {
  return _.reduce(data.children, (acc, i) => {
    if (! _.contains(ALREADY_REGISTERED, i.component)) acc.push(i.component)
    if (i.component === 'composition') {
      return _.union(findComponents(i, acc), acc)
    }
    return acc
  }, components)   
}

export default function pageCreator (dataUrl, siteconf) {
  function loadComponent(name) {
    if (_loaded[name]) return _loaded[name]
    const url = dataUrl + '_components/' + name + '.js'
    _loaded[name] = import(url)
    return _loaded[name]
  }
  // load header and footer
  Vue.component('pageHeader', () => loadComponent('header'))
  Vue.component('pageFooter', () => loadComponent('footer'))
  _.map(siteconf.globalComponents, i => {
    Vue.component(i, () => loadComponent(i))
  })

  return async function (path) {
    const dataReq = await axios.get(dataUrl + path)
    const data = jsyaml.load(dataReq.data)
    const templateReq = await axios.get(dataUrl + '_layouts/' + data.layout + '.html')
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