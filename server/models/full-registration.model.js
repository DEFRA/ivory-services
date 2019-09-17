
const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

const { cloneAndMerge } = require('ivory-shared').utils
const { params, schema } = require('./registration.model')

const address = Joi.object(require('./address.model').schema).label('Person-Address')
const item = Joi.object(require('./item.model').schema).label('Registration-Item')
const person = Joi.object(cloneAndMerge(require('./person.model').schema, { address, addressId: null })).label('Registration-Person')

const fullRegistration = cloneAndMerge(schema, { owner: person, agent: person, item, ownerId: null, agentId: null, itemId: null })

module.exports = class FullRegistration extends BaseModel {
  static get params () {
    return params
  }

  static get schema () {
    return fullRegistration
  }
}
