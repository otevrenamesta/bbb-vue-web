const path = require('path')
const BS = require('browser-sync')
// const HttpProxy = require('http-proxy-middleware')
const bs = BS.create()
// const SRC_DIR = path.resolve(path.join(__dirname, '../src'))
const DEV_DIR = path.resolve(__dirname)
const INDEX_DIR = path.resolve(__dirname + '/..')
// const NODE_MODULES = path.resolve(path.join(__dirname, '../node_modules'))

// const middlewarez = []
// try {
//   const proxies = JSON.parse(process.env.PROXIES)
//   for (let i in proxies) {
//     middlewarez.push({
//       route: i,
//       handle: HttpProxy.createProxyMiddleware({ target: proxies[i], changeOrigin: true })
//     })
//   }
// } catch (_) {}

async function init () {
  bs.init({
    server: [ DEV_DIR, INDEX_DIR ],
    port: 8080,
    single: true,
    open: false,
    ui: false,
    // serveStatic: [{
    //   route: '/data',
    //   dir: process.env.DATA_FOLDER
    // }],
    // middleware: middlewarez
  })
  bs.watch(DEV_DIR + '/index.html').on('change', bs.reload)
  bs.watch(INDEX_DIR + '/**/*.js').on('change', function (filepath, file) {
    bs.reload(filepath)
  })
}
init()