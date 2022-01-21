export default (siteconf, templateManager, componentManager) => function _create (component, cfg) {
  return async function () {
    const template = await templateManager.get(cfg.layout)
    const children = componentManager.prepareComponents(cfg.children || [])
    const data = Object.assign({}, cfg, { children: _.union(children, [ 
      Object.assign({}, cfg, { component })
    ])})

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