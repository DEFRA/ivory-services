
const Joi = require('@hapi/joi')
const { Person } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Person)

module.exports = handlers.routes({
  path: '/people',
  params: Person.params,
  schema: Joi.object(Person.schema).label('Person')
})
