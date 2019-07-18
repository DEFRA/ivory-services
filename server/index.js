const Hapi = require('@hapi/hapi')
const config = require('./config')
const { logger } = require('defra-logging-facade')
const loadReferenceData = require('../reference-data/loadReferenceData')

const serverOptions = {
  port: config.port,
  routes: {
    validate: {
      options: {
        abortEarly: false
      }
    }
  }
}

function startHandler (server) {
  logger.info(`Log level: ${config.logLevel}`)
  if (config.loadReferenceData) {
    loadReferenceData(server.info.uri)
  }
}

async function createServer () {
  // Create the hapi server
  const server = Hapi.server(serverOptions)

  // Add a reference to the server in the config
  config.server = server

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

  server.events.on('start', () => startHandler(server))

  return server
}

module.exports = createServer
