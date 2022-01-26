export default function (siteconf, templateManager, componentManager) {
  
  return function _createAppPageComponent (component, cfg, requiredTemplates) {
  
    // tohle je ta hlavni aplikacni komponenta, ktera je obalovana touhle AppPAge
    // v tomhle pripade ma jinde templates, takze to je funkce,
    // ktera bere objekt s nactenyma templates (a ty je treba nacist)
    async function _createAppComponent () {
      const templates = {}
      await Promise.all(requiredTemplates.map(name => {
        return templateManager.get(name, cfg.templates).then(t => {
          templates[name] = t
        })
      }))
      return component(templates)
    }
    
    return async function () {
      const template = await templateManager.get(cfg.layout)
      const children = componentManager.prepareComponents(cfg.children || [])
      const data = Object.assign({}, cfg, { children: _.union(children, [ 
        Object.assign({}, cfg, { 
          component: requiredTemplates ? await _createAppComponent() : component 
        })
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
}