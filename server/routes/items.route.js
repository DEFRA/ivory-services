
const { Item } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Item)

module.exports = handlers.routes({
  path: '/items',
  params: Item.params,
  schema: Item.schema,
  label: Item.name
})
