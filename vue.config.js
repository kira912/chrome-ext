module.exports = {
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup'
    },
    standalone: {
      template: 'public/browser-extension.html',
      entry: './src/standalone/main.js',
      title: 'Standalone',
      filename: 'index.html'
    }
  },

  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/background.js'
        },
        contentScripts: {
          entries: {
            performance: [
              'src/content-scripts/performance.js'
            ],
            browserPolyfill: [
              'src/content-scripts/browser-polyfill.min.js'
            ]
          }
        }
      }
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
}
