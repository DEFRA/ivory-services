
const Joi = require('@hapi/joi')
const { Registration } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Registration)

module.exports = handlers.routes({
  path: '/registrations',
  params: Registration.params,
  schema: Joi.object(Registration.schema).label('Registration')
})
