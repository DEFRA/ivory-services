
const { Person } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Person)

module.exports = handlers.routes({
  path: '/people',
  params: Person.params,
  schema: Person.schema,
  label: Person.name
})
