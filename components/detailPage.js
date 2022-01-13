const ALREADY_REGISTERED = ['composition', 'MDText', 'sitemap']
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

export default function detailPageCreator (siteconf) {
  function loadComponent(name) {
    if (_loaded[name]) return _loaded[name]
    const url = siteconf.dataUrl + '_service/components/' + name + '.js'
    _loaded[name] = import(url)
    return _loaded[name]
  }
  // load header and footer
  Vue.component('pageHeader', () => loadComponent('header'))
  Vue.component('pageFooter', () => loadComponent('footer'))
  _.map(siteconf.globalComponents, i => {
    Vue.component(i, () => loadComponent(i))
  })

  async function _loadPage(path, siteconf) {
    const dataReq = await axios.get(siteconf.dataUrl + path)
    const data = jsyaml.load(dataReq.data)
    return data
  }

  return async function (config) {
    config = config.layout ? config : await _loadPage(config.data, siteconf)
    const templateUrl = siteconf.dataUrl + '_service/layouts/' + config.layout + '.html'
    
    const templateReq = await axios.get(templateUrl)
    const components = findComponents(config, [])

    // zatim global registrace
    components.map(name => {
      Vue.component(name, () => loadComponent(name))
    })

    return {
      data: () => ({ item: null, config, data: config, loading: true }),
      created: async function () {
        const id = this.$router.currentRoute.params.id
        const url = config.url.replace('{{ID}}', id)
        this.$data.item = (await axios.get(url)).data[0]
        this.$data.loading = false
      },
      computed: {
        components: function () {
          return _.filter(this.$data.data.children, i => (!i.disabled))
        }
      },
      metaInfo () {
        return this.$data.item ? {
          htmlAttrs: {
            lang: this.$data.item.lang || siteconf.lang || 'cs'
          },
          title: this.$data.item[config.titleattr],
          meta: [
            { vmid: 'description', name: 'description', content: this.$data.item.desc },
            { vmid: 'keywords', name: 'keywords', content: this.$data.item.keywords }
          ],
          noscript: [
            { innerHTML: 'Tento web potřebuje zapnutý JavaScript.' }
          ]
        } : {}
      },
      template: templateReq.data
    }
  }
}