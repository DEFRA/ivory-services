
const Joi = require('@hapi/joi')
const { Application } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Application)

module.exports = handlers.routes({
  path: '/applications',
  params: Application.params,
  schema: Joi.object(Application.schema).label('Application')
})
