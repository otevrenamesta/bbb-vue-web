
export default (siteconf) => {
  const _buf = {}
  const _promises = {}

  function _load (url) {
    _promises[url] = axios.get(url).then(res => {
      _buf[url] = res.data
      delete _promises[url]
      return res.data
    })
    return _promises[url]
  }

  return {
    get: function (name, templatesUrl = null) {
      const templateUrl = (templatesUrl || siteconf.templatesUrl)
        + name + (name.match(/.*.html/) ? '' : '.html')
      if (templateUrl in _buf) return new Promise(resolve => resolve(_buf[templateUrl]))
      return templateUrl in _promises
        ? _promises[templateUrl]
        : _load(templateUrl)
    }
  }
}