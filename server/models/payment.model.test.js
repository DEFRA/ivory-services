const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const Joi = require('@hapi/joi')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const Payment = require('../models/payment.model')

const payment = {
  paymentId: 'Payment-ID',
  paymentProvider: 'Payment Provider',
  description: 'Description',
  reference: 'Reference',
  status: 'created',
  amount: 1,
  createdDate: '2019-09-23T10:23:01:123z'
}

lab.experiment(TestHelper.getFile(__filename), () => {
  let data

  lab.beforeEach(() => {
    data = Object.assign({}, payment)
  })

  TestHelper.modelTableTest(lab, Payment)

  lab.test('Payment data validates correctly', async () => {
    const { value } = Joi.validate(data, Payment.schema, { abortEarly: false })
    Code.expect(value).to.equal(data)
  })

  Object.keys(payment).forEach((field) => {
    lab.test(`Payment data invalidates ${field} correctly`, async () => {
      data[field] = false
      const { error } = Joi.validate(data, Payment.schema, { abortEarly: false })
      switch (field) {
        case 'amount':
          return Code.expect(error.toString()).to.contain(TestHelper.invalidNumberMessage(field))
        default:
          return Code.expect(error.toString()).to.contain(TestHelper.invalidStringMessage(field))
      }
    })
  })

  lab.test('Payment data invalidates unknown field correctly', async () => {
    data.unknown = 'blah'
    const { error } = Joi.validate(data, Payment.schema, { abortEarly: false })
    Code.expect(error.toString()).to.contain('"unknown" is not allowed')
  })

  lab.test('Payment parameter validate correctly', async () => {
    data.id = 'abc'
    const { error } = Joi.validate(data, Payment.params, { abortEarly: false })
    Code.expect(error.toString()).to.contain(TestHelper.invalidGuidMessage('id'))
  })
})
