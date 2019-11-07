const sinon = require('sinon')
const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Person = require('../models/person.model')
const Address = require('../models/address.model')
const { uuid } = require('ivory-shared').utils

const person = {
  addressId: uuid(),
  fullName: 'Person full name',
  email: 'Person@email.com'
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(({ context }) => {
    const sandbox = sinon.createSandbox()
    sandbox.stub(Address, 'validForPayment').value(() => !!data.addressId)
    data = Object.assign({}, person)
    context.sandbox = sandbox
  })

  lab.afterEach(async ({ context }) => {
    // Restore the sandbox to make sure the stubs are removed correctly
    context.sandbox.restore()
  })

  lab.beforeEach(() => {
    data = Object.assign({}, person)
  })

  TestHelper.modelTableTest(lab, Person)

  lab.test('Person data validates correctly', async () => {
    const { value } = Person.validate(data, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(person).forEach((field) => {
    lab.test(`Person data invalidates ${field} correctly`, async () => {
      data[field] = false
      const { error } = Person.validate(data, { abortEarly: false })
      Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
    })
  })

  lab.test('Person data invalidates addressId field correctly', async () => {
    data.addressId = 'invalid guid'
    const { error } = Person.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('addressId'))
  })

  lab.test('Person data invalidates email field correctly', async () => {
    data.email = 'invalid email'
    const { error } = Person.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidEmailMessage('email'))
  })

  lab.test('Person data invalidates unknown field correctly', async () => {
    data.unknown = 'blah'
    const { error } = Person.validate(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain('"unknown" is not allowed')
  })

  lab.test('Person parameter validate correctly', async () => {
    const data = { id: 'abc' }
    const { error } = Person.validateParams(data, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })

  lab.test('Person valid for payment', async () => {
    Code.expect(Person.validForPayment(data)).to.equal(true)
  })

  lab.test('Person not valid for payment if it doesn\'t exist', async () => {
    Code.expect(Person.validForPayment()).to.equal(false)
  })

  const requiredFields = ['fullName', 'email', 'addressId']
  requiredFields.forEach((field) => {
    lab.test(`Person not valid for payment when "${field}" is missing`, async () => {
      delete data[field]
      Code.expect(Person.validForPayment(data)).to.equal(false)
    })
  })

  lab.test('Person valid for payment if email is missing and email check skipped', async () => {
    delete data.email
    Code.expect(Person.validForPayment(data, { skip: ['email'] })).to.equal(true)
  })
})
