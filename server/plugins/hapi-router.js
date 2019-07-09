module.exports = {
  plugin: require('hapi-router'),
  options: {
    routes: './server/routes/**/*.route.js'
  }
}
