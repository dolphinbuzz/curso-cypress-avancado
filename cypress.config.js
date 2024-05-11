const { defineConfig } = require('cypress')

module.exports = defineConfig({

  viewportWidth: 1280,
  viewportHeight: 880,
  video: false,
  
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'https://wlsf82-hacker-stories.web.app',
  },
})
