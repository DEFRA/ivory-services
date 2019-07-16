const createServer = require('./server')
const config = require('./server/config')
const { logger } = require('defra-logging-facade')
const loadReferenceData = require('./reference-data/load-reference-data')

createServer()
  .then((server) => {
    config.server = server

    server.events.on('start', () => {
      logger.info(`Log level: ${config.logLevel}`)
      if (config.loadReferenceData) {
        loadReferenceData(server.info.uri)
      }
    })

    return server.start()
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
