
const { Registration } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Registration)

module.exports = handlers.routes({
  path: '/registrations',
  params: Registration.params,
  schema: Registration.schema,
  label: Registration.name
})
