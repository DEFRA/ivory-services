
const Joi = require('@hapi/joi')
const { Item } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Item)

module.exports = handlers.routes({
  path: '/items',
  params: Item.params,
  schema: Joi.object(Item.schema).label('Item')
})
