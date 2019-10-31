const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Person = require('../models/person.model')
const { uuid } = require('ivory-shared').utils

const person = {
  addressId: uuid(),
  fullName: 'Person full name',
  email: 'Person@email.com'
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

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
})
