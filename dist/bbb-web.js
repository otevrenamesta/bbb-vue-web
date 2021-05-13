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
    props: ['data', 'path'],
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
    <composition v-if="innerClasses" :data="restdata" :path="path" />
    <component v-else v-for="(i, idx) in data.children" :key="idx" 
      :is="i.component" :data="i" :path="path + '.children.' + idx">
    </component>
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
    props: ['data', 'path'],
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

  /* global Vue, _, moment */
  Vue.component('MDText', MDText);
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
      },
      // startEdit: (state, edited) => {
      //   if (!state.editwindow) {
      //     state.editwindow = window.open(EDITOR, "Editor")
      //   }
      //   state.editwindow.postMessage(edited, EDITOR)
      //   state.edited = edited
      // },
      // stopEdit: function (state) {
      //   state.edited = null
      // },
    },
    actions: {
      toast: function (ctx, opts) {
        Vue.$toast.open(opts);
      },
      // edit: function (ctx, opts) {
      //   ctx.commit('startEdit', opts)
      // },
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

  // window.addEventListener("message", (event) => {
  //   // Do we trust the sender of this message?
  //   if (event.origin !== "http://example.com:8080")
  //     return;

  //   // event.source is window.opener
  //   // event.data is "hello there!"

  //   // Assuming you've verified the origin of the received message (which
  //   // you must do in any case), a convenient idiom for replying to a
  //   // message is to call postMessage on event.source and provide
  //   // event.origin as the targetOrigin.
  //   event.source.postMessage("hi there yourself!  the secret response " +
  //                            "is: rheeeeet!",
  //                            event.origin);
  // }, false);

  const ALREADY_REGISTERED = ['composition', 'MDText'];

  function findComponents(data, components) {
    return _.reduce(data.children, (acc, i) => {
      if (! _.contains(ALREADY_REGISTERED, i.component)) acc.push(i.component);
      if (i.component === 'composition') {
        return _.union(findComponents(i, acc), acc)
      }
      return acc
    }, components)   
  }

  function pageCreator (dataUrl) {
    function loadComponent(name) {
      const url = dataUrl + 'template/components/' + name + '.js';
      return import(url)
    }
    // load header and footer
    Vue.component('pageHeader', () => loadComponent('header'));
    Vue.component('pageFooter', () => loadComponent('header'));

    return async function (path) {
      const dataReq = await axios.get(dataUrl + path);
      const data = jsyaml.load(dataReq.data);
      const templateReq = await axios.get(dataUrl + 'template/layout/' + data.layout + '.html');
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
            title: this.$data.data.title,
            meta: [
              { vmid: 'description', name: 'description', content: this.$data.data.desc },
              { vmid: 'keywords', name: 'keywords', content: this.$data.data.keywords }
            ]
          }
        },
        template: templateReq.data
      }
    }
  }

  /* global Vue, VueRouter */

  async function init (mountpoint, routesUrl, dataUrl) {
    const reqs = await Promise.all([
      axios(routesUrl),
      axios(dataUrl + 'config.json')
    ]);
    const pageCreator$1 = pageCreator(dataUrl);
    const webRoutes = _.map(reqs[0].data, i => {
      return { path: i.path, component: () => pageCreator$1(i.data) }
    });
    const siteconf = reqs[1].data;
    
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
