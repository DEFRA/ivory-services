const { name, description, version } = require('../../package.json')

module.exports = {
  plugin: require('hapi-swagger'),
  options: {
    info: {
      title: `Documentation for ${name}`,
      description,
      version
    }
  }
}
