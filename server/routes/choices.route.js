
const { Choice } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Choice)

module.exports = handlers.routes({
  path: '/choices',
  params: Choice.params,
  schema: Choice.schema,
  label: Choice.name
})
