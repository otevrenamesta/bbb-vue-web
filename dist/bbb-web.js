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
      if (to.match(/^https?:\/\//) || to.match(/^\/cdn\//)) {
        setTimeout(() => window.open(to, '_blank'), 500);
        return 
      }
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

  async function loadSiteConf (serviceUrl, dataUrl) {
    let siteconf = null;
    try {
      const r = await axios(serviceUrl + 'config.yaml');
      siteconf = jsyaml.load(r.data);
    } catch (err) {
      const r = await axios(dataUrl + 'config.json');
      siteconf = r.data;
    }
    return Object.assign(siteconf, { serviceUrl, dataUrl })
  }

  const KEY = '_BBB_web_user';

  function initUser () {
    let user = localStorage.getItem(KEY);
    user = user ? JSON.parse(user) : null;
    if (user) return user
    return axios('/nia/profile')
      .then(res => {
        saveUser(res.data);
        return res.data
      })
      .catch(err => {
        return null
      })
  }

  function saveUser (user) {
    localStorage.setItem(KEY, JSON.stringify(user));
  }

  var Store = (siteconf, user) => { return new Vuex.Store({
    state: {
      user,
      site: siteconf
    },
    getters: {
      mediaUrl: (state) => (media, params) => {
        const isVector = (url) => url.match(/.*.svg$/);
        const murl = _.isObject(media)
            ? `${siteconf.cdn}/${media.id}/${media.filename}`
            : media.match(/^https?:\/\//)
              ? media : `${siteconf.cdn}/${media}`;
        if (isVector(murl) || (!params && !murl.match(/^https?:\/\//))) return murl
        return `${siteconf.cdn}/api/resize/?url=${encodeURIComponent(murl)}&${params}`
      },
      userLogged: state => {
        return state.user !== null
      }
    },
    mutations: {
      profile: (state, profile) => {
        state.user = profile;
      }
    },
    actions: {
      toast: function (ctx, opts) {
        Vue.$toast.open(opts);
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

  const ALREADY_REGISTERED$1 = ['composition', 'MDText', 'sitemap'];
  const _loaded$1 = {};

  function findComponents$1(data, components) {
    return _.reduce(data.children, (acc, i) => {
      if (! _.contains(ALREADY_REGISTERED$1, i.component)) acc.push(i.component);
      if (i.component === 'composition') {
        return _.union(findComponents$1(i, acc), acc)
      }
      return acc
    }, components)
  }

  function detailPageCreator (dataUrl, siteconf) {
    function loadComponent(name) {
      if (_loaded$1[name]) return _loaded$1[name]
      const url = dataUrl + '_service/components/' + name + '.js';
      _loaded$1[name] = import(url);
      return _loaded$1[name]
    }
    // load header and footer
    Vue.component('pageHeader', () => loadComponent('header'));
    Vue.component('pageFooter', () => loadComponent('footer'));
    _.map(siteconf.globalComponents, i => {
      Vue.component(i, () => loadComponent(i));
    });

    return async function (config) {
      const templateUrl = dataUrl + '_service/layouts/' + config.layout + '.html';
      
      const templateReq = await axios.get(templateUrl);
      const components = findComponents$1(config, []);

      // zatim global registrace
      components.map(name => {
        Vue.component(name, () => loadComponent(name));
      });

      return {
        data: () => ({ item: null, config, loading: true }),
        created: async function () {
          const id = this.$router.currentRoute.params.id;
          const dataurl = config.url.replace('{{ID}}', id);
          this.$data.item = (await axios.get(dataurl)).data[0];
          this.$data.loading = false;
        },
        computed: {
          components: function () {
            return _.filter(this.$data.data.children, i => (!i.disabled))
          }
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
        template: templateReq.data
      }
    }
  }

  /* global Vue, VueRouter */

  async function init (mountpoint, serviceUrl, dataUrl) {
    const reqs = await Promise.all([
      axios(serviceUrl + 'routes.json'),
      loadSiteConf(serviceUrl, dataUrl),
    ]);
    const user = initUser();
    const siteconf = reqs[1];
    const pageCreator$1 = pageCreator(dataUrl, siteconf);
    const detailPageCreator$1 = detailPageCreator(dataUrl, siteconf);
    const webRoutes = _.map(reqs[0].data, i => {
      return { path: i.path, component: () => pageCreator$1(i.data) }
    });
    _.map(siteconf.detailpages, i => {
      const route = i.component
        ? { path: i.path, component: () => import(i.component) }
        : { path: `${i.path}:id`, component: () => detailPageCreator$1(i) };
      webRoutes.push(route);
    });
    
    const router = new VueRouter({
      mode: 'history',
      routes: webRoutes
    });
    const store = Store(siteconf, await user);

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
