const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Boom = require('@hapi/boom')
const TestHelper = require('../../test-helper')
const path = '/payments'
const { Payment } = require('../models')

const { emptyMessage } = TestHelper

lab.experiment(TestHelper.getFile(__filename), () => {
  const routesHelper = TestHelper.createRoutesHelper(lab, __filename, {
    mocks: {
      id: 'a5754ea4-aee8-40d3-a0d7-e7681ed8ef3a',
      model: new Payment({
        paymentId: 'Payment-ID',
        paymentProvider: 'Payment Provider',
        description: 'Description',
        reference: 'reference',
        status: 'created',
        amount: 1,
        createdDate: '2019-09-23T10:23:01:123z'
      })
    }
  })

  /** *********************** GET All *************************** **/
  routesHelper.getRequestTests({ lab, Model: Payment, url: path })

  /** ********************** GET By Id ************************** **/
  routesHelper.getByIdRequestTests({ lab, Model: Payment, url: path })

  /** ************************* POST **************************** **/
  routesHelper.postRequestTests({ lab, Model: Payment, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is posted', async ({ context }) => {
      const { request, server } = context
      const message = `${emptyMessage('description')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request({ description: '' })), expectedResponse)
    })
  })

  /** ************************ PATCH **************************** **/
  routesHelper.patchRequestTests({ lab, Model: Payment, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is patched', async ({ context }) => {
      const { mocks, request, server } = context
      const message = `${emptyMessage('description')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request(mocks.id, { description: '' })), expectedResponse)
    })
  })

  /** ************************ DELETE *************************** **/
  routesHelper.deleteRequestTests({ lab, Model: Payment, url: path })
})
