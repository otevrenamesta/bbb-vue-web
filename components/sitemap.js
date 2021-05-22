const pageList = {
  props: ['pages'],
  template: `
  <ul class="sitemaplist">
    <li v-for="i, idx in pages" :key="idx">
      <router-link :to="i.id"><h5>{{ i.title }}</h5></router-link>
      <span>{{ i.desc }}</span>
      <sitemapPageList v-if="i.children" :pages="i.children" />
    </li>
  </ul>
  `
}

export default {
  data: function () {
    return {
      tree: null,
      loading: true
    }
  },
  created: async function () {
    try {
      const reqs = await Promise.all([
        axios.get(`${this.$store.state.site.serviceUrl}routes.json`),
        axios.get(`${this.$store.state.site.serviceUrl}metainfo.json`)
      ])
      this.$data.tree = _buildTree(reqs[0].data, reqs[1].data)
      this.$data.loading = false
    } catch (_) {
    }
    Vue.component('sitemapPageList', pageList)
  },
  props: ['data'],
  template: `
  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
  <sitemapPageList v-else :pages="tree" />
  `
}

function _buildTree(pages, metas) {
  function _insert2Tree (node, subtree, path) {
    const existing = _.find(subtree, i => i.foldername === path[0])
    if (existing && path.length > 1) {
      existing.children = existing.children || []
      _insert2Tree(node, existing.children, _.rest(path))
    } else {
      const meta = metas[node.data]
      subtree.push({
        id: node.path,
        title: meta.title,
        desc: meta.desc,
        foldername: path[0]
      })
    }
  }
  const sorted = _.sortBy(pages, 'path')
  const meta = metas['index.yaml']
  const tree = [{ id: '/', title: meta.title, desc: meta.desc, foldername: '' }]
  _.map(_.rest(sorted), i => {
    const parts = i.path.split('/')
    _insert2Tree(i, tree, parts)
  })
  return tree
}