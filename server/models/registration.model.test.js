const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Registration = require('../models/registration.model')
const { uuid } = require('ivory-shared').utils

const registration = {
  itemId: uuid(),
  ownerId: uuid(),
  agentId: uuid(),
  paymentId: uuid(),
  agentActingAs: 'Agent acting as',
  ownerType: 'agent',
  status: 'draft'
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(() => {
    data = Object.assign({}, registration)
  })

  TestHelper.modelTableTest(lab, Registration)

  lab.test('Registration data validates correctly', async () => {
    const { value } = Joi.validate(data, Registration.schema, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(registration).forEach((field) => {
    lab.test(`Registration data invalidates ${field} correctly`, async () => {
      data[field] = 1234
      const { error } = Joi.validate(data, Registration.schema, { abortEarly: false })
      Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
    })
  })

  lab.test('Registration data invalidates itemId field correctly', async () => {
    data.itemId = 'invalid guid'
    const { error } = Joi.validate(data, Registration.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('itemId'))
  })

  lab.test('Registration data invalidates ownerId field correctly', async () => {
    data.ownerId = 'invalid guid'
    const { error } = Joi.validate(data, Registration.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('ownerId'))
  })

  lab.test('Registration data invalidates agentId field correctly', async () => {
    data.agentId = 'invalid guid'
    const { error } = Joi.validate(data, Registration.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('agentId'))
  })

  lab.test('Registration data invalidates unknown field correctly', async () => {
    data.unknown = 'blah'
    const { error } = Joi.validate(data, Registration.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain('"unknown" is not allowed')
  })

  lab.test('Registration parameter validate correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Joi.validate(data, Registration.params, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })
})
