const config = require('../config')

const squeezeConfig = [{
  'error': '*',
  'log': '*',
  'ops': '*',
  'request': '*',
  'response': '*'
}]

module.exports = {
  plugin: require('@hapi/good'),
  options: {
    ops: {
      // Log ops stats every 30 seconds
      interval: 30000
    },
    reporters: {
      // Output to console
      consoleReporter: [
        {
          module: '@hapi/good-squeeze',
          name: 'Squeeze',
          args: squeezeConfig
        }, {
          module: '@hapi/good-console',
          args: [
            {
              format: 'YYYY-MM-DD HH:mm:ss',
              utc: false
            }]
        }, 'stdout'],

      // Output to file
      fileReporter: [
        {
          module: '@hapi/good-squeeze',
          name: 'Squeeze',
          args: squeezeConfig
        }, {
          module: '@hapi/good-squeeze',
          name: 'SafeJson'
        }, {
          module: 'good-file',
          args: ['./log/' + config.env + '.log']
        }]
    }
  }
}
