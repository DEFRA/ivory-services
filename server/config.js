const Joi = require('@hapi/joi')

// Define environment options
const DEVELOPMENT = 'development'
const TEST = 'test'
const PRODUCTION = 'production'

// Define logging levels
const ERROR = 'error'
const INFO = 'info'
const DEBUG = 'debug'
const dotenv = require('dotenv')
dotenv.config() // Load variables from .env before any other code (especially before requiring the config.js)

const DEFAULT_PORT = 3010

// Define the config schema
const schema = Joi.object({
  port: Joi.number().default(DEFAULT_PORT),
  env: Joi.string().valid(DEVELOPMENT, TEST, PRODUCTION).default(DEVELOPMENT),

  // Persistence
  postgresEnabled: Joi.bool().default(true),
  postgresUser: Joi.when('postgresEnabled', { is: true, then: Joi.string().min(6).required() }),
  postgresPassword: Joi.when('postgresEnabled', { is: true, then: Joi.string().min(6).required() }),
  postgresDatabase: Joi.when('postgresEnabled', { is: true, then: Joi.string().min(6).required() }),
  postgresHost: Joi.when('postgresEnabled', { is: true, then: Joi.string().min(2).required() }),
  postgresPort: Joi.when('postgresEnabled', { is: true, then: Joi.number().required() }),

  // Logging
  logLevel: Joi.string().valid(ERROR, INFO, DEBUG).default(INFO),
  airbrakeEnabled: Joi.bool().default(true),
  airbrakeHost: Joi.when('airbrakeEnabled', { is: true, then: Joi.string().uri().required() }),
  airbrakeKey: Joi.when('airbrakeEnabled', { is: true, then: Joi.string().min(32).required() }),
  airbrakeLogLevel: Joi.string().valid(ERROR, INFO, DEBUG).default(INFO),

  // Initialise database
  dropCreateAndInitialiseDatabase: Joi.when('env', {
    is: PRODUCTION,
    then: Joi.forbidden(),
    otherwise: Joi.bool().valid(true, false).default(false)
  })
})

// Build the config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,

  // Persistence
  postgresEnabled: process.env.POSTGRES_ENABLED,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresUser: process.env.POSTGRES_USER,
  postgresDatabase: process.env.POSTGRES_DATABASE,
  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: process.env.POSTGRES_PORT,

  // Logging
  logLevel: process.env.LOG_LEVEL,
  airbrakeEnabled: process.env.AIRBRAKE_ENABLED,
  airbrakeHost: process.env.AIRBRAKE_HOST,
  airbrakeKey: process.env.AIRBRAKE_PROJECT_KEY,
  airbrakeLogLevel: process.env.AIRBRAKE_LOG_LEVEL,

  // Initialise database
  dropCreateAndInitialiseDatabase: process.env.DROP_CREATE_AND_INITIALISE_DATABASE
}

// Validate the config
const { value, error } = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

// Add reference data within config
value.loggingLevels = { DEBUG, INFO, ERROR }

// Add some helper props to the validated config
value.isDev = value.env === DEVELOPMENT
value.isProd = value.env === PRODUCTION
value.isTest = value.env === TEST
value.isDebug = value.airbrakeLogLevel === DEBUG
value.isInfo = value.airbrakeLogLevel === INFO
value.isError = value.airbrakeLogLevel === ERROR

value.dataStore = 'in-memory'

// Export the validated config
module.exports = value
