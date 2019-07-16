
const Joi = require('@hapi/joi')
const { Choice } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Choice)

module.exports = handlers.routes({
  path: '/choices',
  params: Choice.params,
  schema: Joi.object(Choice.schema).label('Choice')
})
