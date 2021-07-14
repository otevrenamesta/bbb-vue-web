const path = require('path')
const BS = require('browser-sync')
const bs = BS.create()
// const SRC_DIR = path.resolve(path.join(__dirname, '../src'))
const DEV_DIR = path.resolve(__dirname)
const INDEX_DIR = path.resolve(__dirname + '/..')
// const NODE_MODULES = path.resolve(path.join(__dirname, '../node_modules'))
if (!process.env.DATA_FOLDER) throw new Error('process.env.DATA_FOLDER not set!!')

async function init () {
  bs.init({
    server: [ DEV_DIR, INDEX_DIR ],
    port: 8080,
    open: false,
    ui: false,
    serveStatic: [{
      route: '/data',
      dir: process.env.DATA_FOLDER
    }]
    // middleware: [{ route: '/api', handle: apiServer }]
  })
  bs.watch(DEV_DIR + '/index.html').on('change', bs.reload)
  bs.watch(INDEX_DIR + '/**/*.js').on('change', function (filepath, file) {
    bs.reload(filepath)
  })
}
init()