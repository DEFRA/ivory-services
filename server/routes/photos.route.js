const Joi = require('@hapi/joi')
const { Photo } = require('../models')
const Handlers = require('./handlers')
const handlers = new Handlers(Photo)

module.exports = handlers.routes({
  path: '/photos',
  params: Photo.params,
  schema: Joi.object(Photo.schema).label('Photo')
})
