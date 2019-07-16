
const Joi = require('@hapi/joi')
const { Group } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Group)

module.exports = handlers.routes({
  path: '/groups',
  params: Group.params,
  schema: Joi.object(Group.schema).label('Group')
})
