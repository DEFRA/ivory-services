const createServer = require('./server')
const config = require('./server/config')
const { logger } = require('defra-logging-facade')

createServer()
  .then((server) => {
    config.server = server

    server.events.on('start', () => {
      logger.info(`Log level: ${config.logLevel}`)
    })

    return server.start()
  })
  .catch((err) => {
    console.log(err)
    process.exit(1)
  })
