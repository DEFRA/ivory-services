const Hapi = require('@hapi/hapi')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = Hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register([
    require('./plugins/hapi-router'),
    require('./plugins/hapi-robots'),
    require('./plugins/error-routes')
  ])

  if (config.isDev) {
    await server.register([
      require('blipp'),
      require('@hapi/inert'),
      require('./plugins/views'),
      require('./plugins/logging'),
      require('./plugins/hapi-swagger')
    ])
  }

  return server
}

module.exports = createServer
