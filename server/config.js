// Load application configuration using Dotenv
// (see https://www.npmjs.com/package/dotenv)
require('dotenv').config()

const Joi = require('@hapi/joi')

// Define environment options
const DEVELOPMENT = 'development'
const TEST = 'test'
const PRODUCTION = 'production'

// Define logging levels
const ERROR = 'error'
const INFO = 'info'
const DEBUG = 'debug'

// Define data store options
const IN_MEMORY = 'in-memory'
const DYNAMICS = 'dynamics'

const DEFAULT_PORT = 3010

// Define the config schema
const schema = {
  port: Joi.number().default(DEFAULT_PORT),
  env: Joi.string().valid(DEVELOPMENT, TEST, PRODUCTION).default(DEVELOPMENT),
  dataStore: Joi.string().valid(IN_MEMORY, DYNAMICS).default(IN_MEMORY),
  // ------ Dynamics Config ------
  authorityUrl: Joi.string().uri(),
  clientId: Joi.string().guid(),
  clientSecret: Joi.string(),
  resource: Joi.string().uri(),
  errbitHost: Joi.string().uri(),
  errbitKey: Joi.string(),
  errbitEnabled: Joi.string(),
  loggingLevel: Joi.string().valid(ERROR, INFO, DEBUG).default(INFO)
}

const {
  PORT,
  NODE_ENV,
  DATA_STORE,
  AZURE_ACTIVE_DIRECTORY_HOST,
  AZURE_ACTIVE_DIRECTORY_TENANT,
  SERVER_TO_SERVER_CLIENT_ID,
  SERVER_TO_SERVER_CLIENT_SECRET,
  DYNAMICS_RESOURCE_ADDR,
  ERRBIT_HOST,
  ERRBIT_API_KEY,
  ERRBIT_ENABLED,
  ERRBIT_LEVEL
} = process.env

// Build the config
const config = {
  port: PORT,
  env: NODE_ENV,
  dataStore: DATA_STORE,
  // ------ Dynamics Config ------
  authorityUrl: `https://${AZURE_ACTIVE_DIRECTORY_HOST}/${AZURE_ACTIVE_DIRECTORY_TENANT}`,
  clientId: SERVER_TO_SERVER_CLIENT_ID,
  clientSecret: SERVER_TO_SERVER_CLIENT_SECRET,
  resource: DYNAMICS_RESOURCE_ADDR,
  errbitHost: ERRBIT_HOST,
  errbitKey: ERRBIT_API_KEY,
  errbitEnabled: ERRBIT_ENABLED,
  loggingLevel: ERRBIT_LEVEL
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
value.isDebug = value.loggingLevel === DEBUG
value.isInfo = value.loggingLevel === INFO
value.isError = value.loggingLevel === ERROR

// Export the validated config
module.exports = value
