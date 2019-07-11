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
const schema = {
  port: Joi.number().default(DEFAULT_PORT),
  env: Joi.string().valid(DEVELOPMENT, TEST, PRODUCTION).default(DEVELOPMENT),

  // Persistence
  postgresPassword: Joi.string().required,

  // Logging
  logLevel: Joi.string().valid(ERROR, INFO, DEBUG).default(INFO),
  airbrakeEnabled: Joi.bool().default(true),
  airbrakeHost: Joi.when('airbrakeEnabled', { is: true, then: Joi.string().uri().required() }),
  airbrakeKey: Joi.when('airbrakeEnabled', { is: true, then: Joi.string().min(32).required() }),
  airbrakeLogLevel: Joi.string().valid(ERROR, INFO, DEBUG).default(INFO)
}

// Build the config
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,

  // Persistence
  postgresPassword: process.env.POSTGRES_PASSWORD,

  // Logging
  logLevel: process.env.LOG_LEVEL,
  airbrakeEnabled: process.env.AIRBRAKE_ENABLED,
  airbrakeHost: process.env.AIRBRAKE_HOST,
  airbrakeKey: process.env.AIRBRAKE_PROJECT_KEY,
  airbrakeLogLevel: process.env.AIRBRAKE_LOG_LEVEL
}

// Validate the config
const { value, error } = Joi.validate(config, schema, {
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
