const sinon = require('sinon')
const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Registration = require('../models/registration.model')
const Person = require('../models/person.model')
const Item = require('../models/item.model')
const { uuid } = require('defra-hapi-utils').utils

const registration = {
  itemId: uuid(),
  ownerId: uuid(),
  agentId: uuid(),
  paymentId: uuid(),
  ownerType: 'i-own-it',
  dealingIntent: 'hire',
  status: 'draft'
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(({ context }) => {
    const sandbox = sinon.createSandbox()
    sandbox.stub(Person, 'validForPayment').value(() => data.ownerId && data.agentId)
    sandbox.stub(Item, 'validForPayment').value(() => !!data.itemId)
    data = Object.assign({}, registration)
    context.sandbox = sandbox
  })

  lab.afterEach(async ({ context }) => {
    // Restore the sandbox to make sure the stubs are removed correctly
    context.sandbox.restore()
  })

  TestHelper.modelTableTest(lab, Registration)

  lab.test('Registration data validates correctly', async () => {
    const { value } = Registration.validate(data, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(registration).forEach((field) => {
    lab.test(`Registration data invalidates ${field} correctly`, async () => {
      data[field] = 1234
      const { error } = Registration.validate(data, { abortEarly: false })
      Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
    })
  })

  lab.test('Registration data invalidates itemId field correctly', async () => {
    data.itemId = 'invalid guid'
    const { error } = Registration.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('itemId'))
  })

  lab.test('Registration data invalidates ownerId field correctly', async () => {
    data.ownerId = 'invalid guid'
    const { error } = Registration.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('ownerId'))
  })

  lab.test('Registration data invalidates agentId field correctly', async () => {
    data.agentId = 'invalid guid'
    const { error } = Registration.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('agentId'))
  })

  lab.test('Registration data invalidates unknown field correctly', async () => {
    data.unknown = 'blah'
    const { error } = Registration.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain('"unknown" is not allowed')
  })

  lab.test('Registration parameter validate correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Registration.validateParams(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })

  lab.test('Registration valid for payment', async () => {
    Code.expect(Registration.validForPayment(data)).to.equal(true)
  })

  lab.test('Registration not valid for payment if it doesn\'t exist', async () => {
    Code.expect(Registration.validForPayment()).to.equal(false)
  })

  const requiredFields = ['itemId', 'ownerId', 'agentId', 'dealingIntent', 'ownerType', 'status']
  requiredFields.forEach((field) => {
    lab.test(`Registration not valid for payment when "${field}" is missing`, async () => {
      delete data[field]
      Code.expect(Registration.validForPayment(data)).to.equal(false)
    })
  })

  lab.test('Registration not valid for payment when agent is missing and owner type is someone else', async () => {
    delete data.agentId
    data.ownerType = 'someone-else'
    Code.expect(Registration.validForPayment(data)).to.equal(false)
  })
})
