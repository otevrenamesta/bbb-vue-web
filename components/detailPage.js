
export default function detailPageCreator (siteconf, templateManager, componentManager) {

  async function _loadPage(path, siteconf) {
    const dataReq = await axios.get(siteconf.dataUrl + path)
    const data = jsyaml.load(dataReq.data)
    return data
  }

  return async function (config) {
    config = config.layout ? config : await _loadPage(config.data, siteconf)    
    const template = await templateManager.get(config.layout)
    config.children = componentManager.prepareComponents(config.children)

    return {
      data: () => ({ item: null, config, data: config, loading: true }),
      created: async function () {
        const id = this.$router.currentRoute.params.id
        const url = config.url.replace('{{ID}}', id)
        this.$data.item = (await axios.get(url)).data[0]
        this.$data.loading = false
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
      template
    }
  }
}