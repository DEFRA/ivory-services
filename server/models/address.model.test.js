const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Address = require('../models/address.model')

const address = {
  postcode: 'WA4 1AB',
  addressLine1: '12',
  addressLine2: 'Tiny street',
  town: 'Big town',
  county: 'Medium County',
  country: 'Little Britain',
  uprn: '123456789'
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(() => {
    data = Object.assign({}, address)
  })

  TestHelper.modelTableTest(lab, Address)

  lab.test('Address data validates correctly', async () => {
    const { value } = Joi.validate(data, Address.schema, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(address).forEach((field) => {
    lab.test(`Address data invalidates ${field} correctly`, async () => {
      data[field] = false
      const { error } = Joi.validate(data, Address.schema, { abortEarly: false })
      Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
    })
  })

  lab.test(`Address data invalidates unknown field correctly`, async () => {
    data.unknown = 'blah'
    const { error } = Joi.validate(data, Address.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain(`"unknown" is not allowed`)
  })

  lab.test('Address parameter validate correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Joi.validate(data, Address.params, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })
})
