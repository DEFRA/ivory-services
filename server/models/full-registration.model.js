
const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

const { cloneAndMerge } = require('ivory-shared').utils
const { params, schema } = require('./registration.model')

const address = Joi.object(require('./address.model').schema).label('Person-Address')
const photo = Joi.object(cloneAndMerge(require('./photo.model').schema, { itemId: null })).label('Item-Photo')
const photos = Joi.array().items(photo).label('Item-Photos')
const item = Joi.object(cloneAndMerge(require('./item.model').schema, { photos })).label('Registration-Item')
const person = Joi.object(cloneAndMerge(require('./person.model').schema, { address, addressId: null })).label('Registration-Person')
const payment = Joi.object(require('./payment.model').schema).label('Registration-Payment')

const fullRegistration = cloneAndMerge(schema, { owner: person, agent: person, item, payment, ownerId: null, agentId: null, itemId: null, paymentId: null })

module.exports = class FullRegistration extends BaseModel {
  static get params () {
    return params
  }

  static get schema () {
    return fullRegistration
  }
}
