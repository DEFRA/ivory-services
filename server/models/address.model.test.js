const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
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
    const { value } = Address.validate(data, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(address).forEach((field) => {
    lab.test(`Address data invalidates ${field} correctly`, async () => {
      data[field] = false
      const { error } = Address.validate(data, { abortEarly: false })
      Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
    })
  })

  lab.test('Address data invalidates unknown field correctly', async () => {
    data.unknown = 'blah'
    const { error } = Address.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain('"unknown" is not allowed')
  })

  lab.test('Address parameter validate correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Address.validateParams(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })

  lab.test('Address valid for payment', async () => {
    Code.expect(Address.validForPayment(data)).to.equal(true)
  })

  lab.test('Address not valid for payment if it doesn\'t exist', async () => {
    Code.expect(Address.validForPayment()).to.equal(false)
  })

  const requiredFields = ['addressLine1', 'town', 'postcode']
  requiredFields.forEach((field) => {
    lab.test(`Address not valid for payment when "${field}" is missing`, async () => {
      delete data[field]
      Code.expect(Address.validForPayment(data)).to.equal(false)
    })
  })
})
