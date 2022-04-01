const FolderList = {
  props: ['data', 'onColapse'],
  template: `
  <div v-if="data.type === 'directory'" class="folder">
    <i class="fas" :class="data.loaded ? 'fa-minus' : 'fa-plus'" 
      @click="onColapse(data)"></i> <router-link :to="data.path">
      {{ data.title }}
    </router-link>: <span>{{ data.desc }}</span><i v-if="data.loading" class="fas fa-spinner fa-spin"></i>
    <ul style="margin-left: 2em;" v-if="data.loaded">
      <li v-for="i, idx in data.children" :key="idx">
        <FolderList :data="i" :onColapse="onColapse" />
      </li>
    </ul>
  </div>
  <div v-else>
    <router-link :to="data.path">{{ data.title }}</router-link>: <span>{{ data.desc }}</span>
  </div>
  `
}

Vue.component('FolderList', FolderList)

export default {
  data: function () {
    return {
      tree: this._createItem('/', 'directory')
    }
  },
  created: async function () {
    this.loadInfo(this.tree)
  },
  props: ['data'],
  methods: {
    _createItem: function (path, type) {
      return {
        loading: false,
        loaded: false,
        title: '', desc: '',
        path, type,
        children: []
      }
    },
    loadInfo: async function (folderInfo) {
      try {
        const filename = folderInfo.type === 'file' 
          ? folderInfo.path + '.yaml'
          : folderInfo.path + '/index.yaml'
        const url = this.$root.dataUrl + filename
        const info = await axios.get(url)
        const data = jsyaml.load(info.data)
        folderInfo.title = data.title
        folderInfo.desc = data.desc
      } catch (_) {
        folderInfo.title = folderInfo.path
      }      
      folderInfo.loading = false
    },
    loadfolder: async function (folderInfo) {
      folderInfo.loading = true
      const promises = []
      const contentReq = await axios.get(this.$root.dataUrl + 'pages/' + folderInfo.path)
      contentReq.data.map(i => {
        const match = i.name.match(/^(\w+).yaml$/)
        if (i.type !== 'directory' && match) {
          const item = this._createItem(folderInfo.path + '/' + match[1], i.type)
          folderInfo.children.push(item)
          promises.push(this.loadInfo(item))
        } else if (i.type === 'directory') {
          const item = this._createItem(folderInfo.path + '/' + i.name, i.type)
          folderInfo.children.push(item)
          promises.push(this.loadInfo(item))
        }
      })
      await Promise.all(promises)
      folderInfo.loaded = true
      folderInfo.loading = false
    },
    unloadFolder: function (f) {
      f.children.splice()
      f.loaded = false
    },
    onColapse: async function (f) {
      f.loaded ? this.unloadFolder(f) : this.loadfolder(f)
    }
  },
  template: `<FolderList v-if="tree.title" :data="tree" :onColapse="onColapse" />`
}