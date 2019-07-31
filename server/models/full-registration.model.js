const Joi = require('@hapi/joi')
const BaseModel = require('./baseModel')

const { cloneAndMerge } = require('../lib/utils')
const Registration = require('./registration.model')
const Address = require('./address.model')
const Item = require('./item.model')
const Person = require('./person.model')

const addressSchema = cloneAndMerge(Address.schema, Address.params)
const address = Joi.object(addressSchema).label('Full-Address')

const personSchema = cloneAndMerge(Person.schema, Person.params, { address, addressId: null })
const agent = Joi.object(personSchema).label('Full-Person')
const owner = Joi.object(personSchema).label('Full-Person')

const itemSchema = cloneAndMerge(Item.schema, Item.params)
const item = Joi.object(itemSchema).label('Full-Item')

const registrationSchema = cloneAndMerge(Registration.schema, { owner, agent, item, ownerId: null, agentId: null, itemId: null })

module.exports = class FullRegistration extends BaseModel {
  static get params () {
    return Registration.params
  }

  static get schema () {
    return registrationSchema
  }
}
