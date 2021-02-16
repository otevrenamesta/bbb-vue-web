export default {
  "title": "Otevřená města",
  "desc": "stranka pro TS",
  "updated_at": "2021-01-18T12:47:37.254Z",
  "layout": "bbbLayoutDefault",
  "path": "/",
  "children": [
    {
      "component": "hero",
      "background": "https://www.tributemedia.com/hubfs/Images/Blog%20Images/shutterstock_252081805.jpg",
      "title": "Otevřená města 2.0",
      "subtitle": "Organizace sdružijící otevřené samosprávy",
      "content": "Spolecne cile jsou __spoluprace__"
    },
    {
      "component": "composition",
      "class": "container",
      "children": [
        {
          "component": "MDText",
          "class": "alert alert-danger container text-center",
          "content": "Pozor __open source__ vyzaduje zmenu mysleni ;)"
        },
        {
          "component": "MDText",
          "content": "## Oblíbené"
        },
        {
          "component": "imageGrid",
          "list": [
            {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1280px-Node.js_logo.svg.png",
              "name": "NodeJs"
            },
            {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/800px-Kubernetes_logo_without_workmark.svg.png",
              "name": "K8S"
            },
            {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/800px-Postgresql_elephant.svg.png",
              "name": "Postgre"
            }
          ]
        },
        {
          "component": "newsPreview",
          "count": 3
        }
      ]
    }
  ]
}