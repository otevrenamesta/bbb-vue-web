var initBBBWeb = (function () {
  'use strict';

  /* global axios, _ */

  // const outer = {
  //   props: ['class'],
  //   template: '<div :class="class">{{slot}}</div>'
  // }

  var composition = {
    data() {
      return {
        myClass: null,
        innerClasses: null
      }
    },
    props: ['data'],
    mounted() {
      const parts = this.$props.data.class ? this.$props.data.class.split('>') : [];
      this.$data.innerClasses = parts.length > 1 ? parts.slice(1) : null;
      this.$data.myClass = parts.length > 0 ? parts[0] : null;
    },
    computed: {
      restdata () {
        return Object.assign({}, this.$props.data, { class: this.$data.innerClasses.join('>') })
      }
    },
    template: `
  <div :class="myClass">
    <composition v-if="innerClasses" :data="restdata" />
    <component v-else v-for="(i, idx) in data.children" :key="idx" 
      :is="i.component" :data="i" />
  </div>
  `
  };

  function linksHijack (event) {
    // https://dennisreimann.de/articles/delegating-html-links-to-vue-router.html
    // ensure we use the link, in case the click has been received by a subelement
    let { target } = event;
    while (target && target.tagName !== 'A') target = target.parentNode;
    // handle only links that occur inside the component and do not reference external resources
    if (target && target.matches(".MDText a:not([href*='://'])") && target.href) {
      // some sanity checks taken from vue-router:
      // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
      const { altKey, ctrlKey, metaKey, shiftKey, button, defaultPrevented } = event;
      // don't handle with control keys
      if (metaKey || altKey || ctrlKey || shiftKey) return
      // don't handle when preventDefault called
      if (defaultPrevented) return
      // don't handle right clicks
      if (button !== undefined && button !== 0) return
      // don't handle if `target="_blank"`
      if (target && target.getAttribute) {
        const linkTarget = target.getAttribute('target');
        if (/\b_blank\b/i.test(linkTarget)) return
      }
      // don't handle same page links/anchors
      const url = new URL(target.href);
      const to = url.pathname;
      if (window.location.pathname !== to && event.preventDefault) {
        event.preventDefault();
        this.$router.push(to);
      }
    }
  }

  var MDText = {
    props: ['data'],
    computed: {
      html: function() {
        const html = _.isString(this.$props.data)
          ? marked(this.$props.data)
          : marked(this.$props.data.content);
        return html || ''
      }
    },
    methods: {
      handleClicks: linksHijack
    },
    template: `
  <div class="MDText" :class="data.class" v-html="html" @click="handleClicks" />
  `
  };

  var markdown = {
    props: ['component', 'text'],
    computed: {
      html: function() {
        const text = this.$props.text || '';
        return text.indexOf('\n') > 0 ? marked(text) : marked.parseInline(text)
      },
      c: function() {
        return this.$props.component || 'span'
      }
    },
    methods: {
      handleClicks: linksHijack
    },
    template: '<span :is="c" v-html="html" @click="handleClicks" />'
  };

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
  };

  var sitemap = {
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
        ]);
        this.$data.tree = _buildTree(reqs[0].data, reqs[1].data);
        this.$data.loading = false;
      } catch (_) {
      }
      Vue.component('sitemapPageList', pageList);
    },
    props: ['data'],
    template: `
  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
  <sitemapPageList v-else :pages="tree" />
  `
  };

  function _buildTree(pages, metas) {
    function _insert2Tree (node, subtree, path) {
      const existing = _.find(subtree, i => i.foldername === path[0]);
      if (existing && path.length > 1) {
        existing.children = existing.children || [];
        _insert2Tree(node, existing.children, _.rest(path));
      } else {
        const meta = metas[node.data];
        subtree.push({
          id: node.path,
          title: meta.title,
          desc: meta.desc,
          foldername: path[0]
        });
      }
    }
    const sorted = _.sortBy(pages, 'path');
    const meta = metas['index.yaml'];
    const tree = [{ id: '/', title: meta.title, desc: meta.desc, foldername: '' }];
    _.map(_.rest(sorted), i => {
      const parts = i.path.split('/');
      _insert2Tree(i, tree, parts);
    });
    return tree
  }

  /* global Vue, _, moment */
  Vue.component('MDText', MDText);
  Vue.component('sitemap', sitemap);
  Vue.component('markdown', markdown);

  moment.locale('cs');

  function _formatDate (value) {
    if (value) {
      value = _.isString(value) ? moment(value) : value;
      return value.format('DD.MM.YYYY')
    }
  }
  Vue.filter('formatDate', _formatDate);
  Vue.filter('date', _formatDate);

  Vue.filter('longDate', function (value) {
    if (value) {
      value = _.isString(value) ? moment(value) : value;
      return value.format('DD.MM.YYYY HH:mm')
    }
  });

  Vue.component('composition', composition);

  /* global Vue, Vuex, localStorage, LOGGED_USER, axios, _ */
  const loadedUsers = {};

  Vue.filter('username', function (uid) {
    return loadedUsers[uid] || 'unknown'
  });

  var Store = (router, siteconf) => { return new Vuex.Store({
    state: {
      user: null,
      site: siteconf,
      editwindow: null,
      edited: null
    },
    getters: {
      mediaUrl: (state) => (media, params) => {
        const p = params 
          ? _.isArray(params) ? params.join('&') : params
          : '';
        return _.isString(media)
          ? media.match(/^https?:\/\//)
            ? `${siteconf.cdn}/?url=${encodeURIComponent(media)}&${p}`
            : `${siteconf.cdn}/${media}?${p}`
          : `${siteconf.cdn}/${media.id}/${media.filename}?${p}`
      }
      // userLogged: state => {
      //   return state.user !== null
      // },
      // UID: state => (state.user.id),
      // isMember: state => group => {
      //   try {
      //     return LOGGED_USER.groups.indexOf(group) >= 0
      //   } catch (_) {
      //     return false
      //   }
      // }
    },
    mutations: {
      profile: (state, profile) => {
        state.user = profile;
      }
    },
    actions: {
      toast: function (ctx, opts) {
        Vue.$toast.open(opts);
      },
      loadusers: function (ctx, opts) {
        const toBeLoaded = _.filter(opts, i => !(i in loadedUsers));
        return new Promise(resolve => {
          toBeLoaded.length === 0 ? resolve() : setTimeout(() => {
            console.log(`loaded: ${JSON.stringify(toBeLoaded)}`);
            _.each(toBeLoaded, uid => {
              loadedUsers[uid] = 'jssjfls' + uid;
            });
            resolve();
          }, 300);
        })
      }
    }
  })};

  const ALREADY_REGISTERED = ['composition', 'MDText', 'sitemap'];
  const _loaded = {};

  function findComponents(data, components) {
    return _.reduce(data.children, (acc, i) => {
      if (! _.contains(ALREADY_REGISTERED, i.component)) acc.push(i.component);
      if (i.component === 'composition') {
        return _.union(findComponents(i, acc), acc)
      }
      return acc
    }, components)   
  }

  function pageCreator (dataUrl, siteconf) {
    function loadComponent(name) {
      if (_loaded[name]) return _loaded[name]
      const url = dataUrl + '_service/components/' + name + '.js';
      _loaded[name] = import(url);
      return _loaded[name]
    }
    // load header and footer
    Vue.component('pageHeader', () => loadComponent('header'));
    Vue.component('pageFooter', () => loadComponent('footer'));
    _.map(siteconf.globalComponents, i => {
      Vue.component(i, () => loadComponent(i));
    });

    return async function (path) {
      const dataReq = await axios.get(dataUrl + path);
      const data = jsyaml.load(dataReq.data);
      const url = dataUrl + '_service/layouts/' + data.layout + '.html';
      const templateReq = await axios.get(url);
      const components = findComponents(data, []);

      // zatim global registrace
      components.map(name => {
        Vue.component(name, () => loadComponent(name));
      });

      return {
        data: () => ({ data, path: null }),
        created: function () {
          this.$data.path = this.$router.currentRoute.path;
        },
        computed: {
          components: function () {
            return _.filter(this.$data.data.children, i => (!i.disabled))
          }
        },
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
        template: templateReq.data
      }
    }
  }

  /* global Vue, VueRouter */

  async function init (mountpoint, serviceUrl, dataUrl) {
    const reqs = await Promise.all([
      axios(serviceUrl + 'routes.json'),
      axios(dataUrl + 'config.json')
    ]);
    const siteconf = reqs[1].data;
    Object.assign(siteconf, { serviceUrl, dataUrl });
    const pageCreator$1 = pageCreator(dataUrl, siteconf);
    const webRoutes = _.map(reqs[0].data, i => {
      return { path: i.path, component: () => pageCreator$1(i.data) }
    });
    
    const router = new VueRouter({
      mode: 'history',
      routes: webRoutes
    });
    const store = Store(router, siteconf);

    new Vue({
      router,
      store,
      metaInfo: {
        // if no subcomponents specify a metaInfo.title, this title will be used
        title: siteconf.defaulttitle || '--',
        // all titles will be injected into this template
        titleTemplate: `%s | ${siteconf.title}`
      },
      template: `<router-view :key="$route.fullPath" />`
    }).$mount(mountpoint);
  }

  return init;

}());
