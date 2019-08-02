const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Boom = require('@hapi/boom')
const TestHelper = require('../../test-helper')
const path = '/people'
const { Person } = require('../models')

const INVALID_GUID = 'INVALID-GUID'
const INVALID_EMAIL = 'INVALID-EMAIL'

const { invalidGuidMessage, invalidEmailMessage, emptyMessage } = TestHelper

lab.experiment(TestHelper.getFile(__filename), () => {
  const routesHelper = TestHelper.createRoutesHelper(lab, __filename, {
    mocks: {
      id: 'a5754ea4-aee8-40d3-a0d7-e7681ed8ef3a',
      model: new Person({
        fullName: 'James Bond',
        email: 'james.bond@defra.test.gov.uk',
        addressId: '20f219ce-fcc5-4ee0-8d53-6e4476daf47a'
      })
    }
  })

  /** *********************** GET All *************************** **/
  routesHelper.getRequestTests({ lab, Model: Person, url: path })

  /** ********************** GET By Id ************************** **/
  routesHelper.getByIdRequestTests({ lab, Model: Person, url: path })

  /** ************************* POST **************************** **/
  routesHelper.postRequestTests({ lab, Model: Person, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is posted', async ({ context }) => {
      const { request, server } = context
      const message = `${emptyMessage('fullName')}. ${invalidEmailMessage('email')}. ${invalidGuidMessage('addressId')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request({ fullName: '', email: INVALID_EMAIL, addressId: INVALID_GUID })), expectedResponse)
    })
  })

  /** ************************ PATCH **************************** **/
  routesHelper.patchRequestTests({ lab, Model: Person, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is patched', async ({ context }) => {
      const { mocks, request, server } = context
      const message = `${emptyMessage('fullName')}. ${invalidEmailMessage('email')}. ${invalidGuidMessage('addressId')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request(mocks.id, { fullName: '', email: INVALID_EMAIL, addressId: INVALID_GUID })), expectedResponse)
    })
  })

  /** ************************ DELETE *************************** **/
  routesHelper.deleteRequestTests({ lab, Model: Person, url: path })
})
