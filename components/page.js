
export default function pageCreator (siteconf, templateManager, componentManager) {

  return async function (path) {
    const dataReq = await axios.get(siteconf.dataUrl + 'pages/' + path)
    const data = jsyaml.load(dataReq.data)
    data.children = componentManager.prepareComponents(data.children)
    const template = await templateManager.get(data.layout)

    return {
      data: () => ({ data, path: null }),
      metaInfo () {
        return {
          htmlAttrs: {
            lang: this.$data.data.lang || siteconf.lang || 'cs'
          },
          title: this.$data.data.title,
          meta: [
            { vmid: 'description', name: 'description', content: this.$data.data.desc },
            { vmid: 'keywords', name: 'keywords', content: this.$data.data.keywords }
          ],
          noscript: [
            { innerHTML: 'Tento web potřebuje zapnutý JavaScript.' }
          ]
        }
      },
      template
    }
  }
}