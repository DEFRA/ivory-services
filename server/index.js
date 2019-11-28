const Hapi = require('@hapi/hapi')
const config = require('./config')
const { logger } = require('defra-logging-facade')
const loadReferenceData = require('../reference-data/loadReferenceData')
const { Choice, Group, Address, Person, Item, Payment, Registration, Photo } = require('./dal')

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

async function startHandler (server) {
  logger.info('Ivory service is starting...')
  logger.info(`Log level: ${config.logLevel}`)

  if (config.dropCreateAndInitialiseDatabase) {
    await Registration.dropTable()
    await Photo.dropTable()
    await Item.dropTable()
    await Choice.dropTable()
    await Group.dropTable()
    await Person.dropTable()
    await Address.dropTable()
    await Payment.dropTable()
  }

  await Group.createTable()
  await Choice.createTable()
  await Address.createTable()
  await Person.createTable()
  await Item.createTable()
  await Payment.createTable()
  await Photo.createTable()
  await Registration.createTable()

  await loadReferenceData()

  // listen on SIGTERM signal and gracefully stop the server
  process.on('SIGTERM', function () {
    logger.info('Received SIGTERM scheduling shutdown...')
    logger.info('Ivory service is stopping...')

    server.stop({ timeout: 10000 }).then(function (err) {
      logger.info('Shutdown complete')
      process.exit((err) ? 1 : 0)
    })
  })
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

  // Register the logging plugin only if not running in unit test
  if (!config.isUnitTest) {
    await server.register([
      require('./plugins/logging')
    ])
  }

  if (config.isDev || config.isTest) {
    await server.register([
      require('blipp'),
      require('@hapi/inert'),
      require('./plugins/views'),
      require('./plugins/hapi-swagger')
    ])
  }

  server.events.on('start', () => startHandler(server))

  return server
}

module.exports = createServer
module.exports.startHandler = startHandler
