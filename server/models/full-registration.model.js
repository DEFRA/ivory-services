
const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

const { cloneAndMerge } = require('ivory-shared').utils
const { params, schema } = require('./registration.model')

const address = Joi.object(require('./address.model').schema).label('Person-Address')
const item = Joi.object(require('./item.model').schema).label('Registration-Item')
const payment = Joi.object(require('./payment.model').schema).label('Registration-Payment')
const person = Joi.object(cloneAndMerge(require('./person.model').schema, { address, addressId: null })).label('Registration-Person')

const fullRegistration = cloneAndMerge(schema, { owner: person, agent: person, item, payment, ownerId: null, agentId: null, itemId: null, paymentId: null })

module.exports = class FullRegistration extends BaseModel {
  static get params () {
    return params
  }

  static get schema () {
    return fullRegistration
  }
}
