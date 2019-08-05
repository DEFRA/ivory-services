const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Boom = require('@hapi/boom')
const TestHelper = require('../../test-helper')
const path = '/registrations'
const { Registration } = require('../models')
const { uuid } = require('ivory').utils

const INVALID_GUID = 'INVALID-GUID'

const { invalidGuidMessage } = TestHelper

lab.experiment(TestHelper.getFile(__filename), () => {
  const routesHelper = TestHelper.createRoutesHelper(lab, __filename, {
    mocks: {
      id: 'a5754ea4-aee8-40d3-a0d7-e7681ed8ef3a',
      model: new Registration({
        itemId: uuid(),
        ownerId: uuid(),
        agentId: uuid(),
        agentActingAs: 'Agent acting as',
        agentIsOwner: true
      })
    }
  })

  /** *********************** GET All *************************** **/
  routesHelper.getRequestTests({ lab, Model: Registration, url: path })

  /** ********************** GET By Id ************************** **/
  routesHelper.getByIdRequestTests({ lab, Model: Registration, url: path })

  /** ************************* POST **************************** **/
  routesHelper.postRequestTests({ lab, Model: Registration, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is posted', async ({ context }) => {
      const { request, server } = context
      const message = `${invalidGuidMessage('ownerId')}. ${invalidGuidMessage('agentId')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request({ ownerId: INVALID_GUID, agentId: INVALID_GUID })), expectedResponse)
    })
  })

  /** ************************ PATCH **************************** **/
  routesHelper.patchRequestTests({ lab, Model: Registration, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is patched', async ({ context }) => {
      const { mocks, request, server } = context
      const message = `${invalidGuidMessage('ownerId')}. ${invalidGuidMessage('agentId')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request(mocks.id, { ownerId: INVALID_GUID, agentId: INVALID_GUID })), expectedResponse)
    })
  })

  /** ************************ DELETE *************************** **/
  routesHelper.deleteRequestTests({ lab, Model: Registration, url: path })
})
