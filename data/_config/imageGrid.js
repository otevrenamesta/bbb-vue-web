export default [
  {
    "name": "list",
    "label": "Seznam obrázků",
    "component": "dyn-listeditor",
    // rowcomponent: 'obrazekInfo',
    "form": [
      {
        "name": "url",
        "component": "dyn-input",
        "label": "Odkaz",
        "rules": 'required'
      },
      {
        "name": "name",
        "component": "dyn-input",
        "label": "Název"
      }
    ]
  }
]