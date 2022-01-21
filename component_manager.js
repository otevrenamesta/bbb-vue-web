const ALREADY_REGISTERED = ['composition', 'MDText', 'sitemap']

function addJSSuffix(component) {
  return component.match(/.*.js/) ? component : `${component}.js`
}

export default (siteconf) => {
  const _buf = {}
  const _promises = {}

  function _load (name) {
    const url = name.match(/http*./) ? name
      : addJSSuffix(siteconf.dataUrl + '_service/components/' + name)
    _promises[name] = import(url).then(module => {
      _buf[name] = module
      delete _promises[name]
      return module
    })
    return _promises[name]
  }

  function load (url) {
    if (url in _buf) return _buf[url]
    return url in _promises ? _promises[url] : _load(url)
  }

  function loadfn (url) {
    return () => load(url)
  }

  function prepareComponents(children) {
    const active = _.filter(children, i => !i.disabled)
    return _.map(active, i => {
      if (i.component === 'composition') {
        i.children = prepareComponents(i.children)
      } else if (!_.contains(ALREADY_REGISTERED, i.component)) {
        i.component = loadfn(i.component)
      }
      return i
    })
  }

  // register global components
  _.map(siteconf.globalComponents, async name => {
    const Component = await load(name)
    Vue.component(name, Component.default)
  })

  return {
    load,
    prepareComponents
  }
}