
const { Payment } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Payment)

module.exports = handlers.routes({
  path: '/payments',
  params: Payment.params,
  schema: Payment.schema,
  label: Payment.name
})
