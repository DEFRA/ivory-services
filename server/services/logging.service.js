'use strict'

const { errbitHost, errbitKey, errbitEnabled, loggingLevels, isDebug, isTest } = require('../config')
const { DEBUG, ERROR, INFO } = loggingLevels
const AirbrakeClient = require('airbrake-js')

let airbrake
let log = (level, message, request) => {
  if (request && request.log) {
    request.log(level, message)
  } else {
    const { server } = require('../config')
    server.log(level, message)
  }
}

class LoggingService {
  static get airbrake () {
    if (!airbrake) {
      if (errbitEnabled) {
        airbrake = new AirbrakeClient({ projectId: true, projectKey: errbitKey, host: errbitHost })
      } else {
        airbrake = {
          notify: (message) => {
            log(ERROR, `airbrake: ${message}`)
          }
        }
      }
    }
    return airbrake
  }

  static logError (message, request) {
    LoggingService._log(ERROR, message, request)
  }

  static logInfo (message, request) {
    LoggingService._log(INFO, message, request)
  }

  static logDebug (message, data, request) {
    if (isDebug) {
      if (message) {
        LoggingService._log(DEBUG, message, request)
      }
      if (data) {
        LoggingService._log(DEBUG, data, request)
      }
    }
  }

  static async _log (level, error, request) {
    if (isTest) {
      return
    }
    if (level === ERROR) {
      if (typeof error === 'object') {
        await LoggingService.airbrake.notify(JSON.stringify(error))
      } else {
        await LoggingService.airbrake.notify(error)
      }
    }
    log(level, error, request)
  }
}

module.exports = LoggingService
