module.exports = {
  plugin: require('./hapi-version-status/index'),
  options: {
    path: '/version',
    options: {
      tags: ['api'],
      security: true
    }
  }
}
