export default (siteconf, templateManager) => function _create (component, cfg) {
  return async function () {
    const template = await templateManager.get(cfg.layout)
    const data = Object.assign({}, cfg, { children: [ 
      Object.assign({}, cfg, { component })
    ]})

    return {
      data: () => ({ data }),
      metaInfo () {
        return {
          title: cfg.title,
          meta: [
            { vmid: 'description', name: 'description', content: this.$data.data.desc },
            { vmid: 'keywords', name: 'keywords', content: this.$data.data.keywords }
          ]
        }
      },
      template
    }
  }
}