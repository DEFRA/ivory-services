module.exports = {
  plugin: require('hapi-version-status'),
  options: {
    path: '/version',
    options: {
      tags: ['api'],
      security: true
    }
  }
}
