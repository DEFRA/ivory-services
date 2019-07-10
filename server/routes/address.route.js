
const Joi = require('@hapi/joi')
const { Address } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Address)

module.exports = handlers.routes({
  path: '/addresses',
  params: Address.params,
  schema: Joi.object(Address.schema).label('Address')
})
