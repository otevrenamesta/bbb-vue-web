
export default (siteconf) => {
  const _buf = {}
  const _promises = {}

  function _load (templatename) {
    const templateUrl = siteconf.dataUrl + '_service/layouts/' + templatename + '.html'
    _promises[templatename] = axios.get(templateUrl).then(res => {
      _buf[templatename] = res.data
      delete _promises[templatename]
      return res.data
    })
    return _promises[templatename]
  }

  return {
    get: function (templatename) {
      if (templatename in _buf) return _buf[templatename]
      return templatename in _promises
        ? _promises[templatename]
        : _load(templatename)
    }
  }
}