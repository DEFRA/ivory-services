const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Boom = require('@hapi/boom')
const TestHelper = require('../../test-helper')
const path = '/choices'
const { Choice } = require('../models')
const { uuid } = require('defra-hapi-utils').utils

const { emptyMessage } = TestHelper

lab.experiment(TestHelper.getFile(__filename), () => {
  const routesHelper = TestHelper.createRoutesHelper(lab, __filename, {
    mocks: {
      id: uuid(),
      model: new Choice({
        groupId: uuid(),
        rank: 1,
        label: 'Choice label',
        heading: 'Choice heading',
        shortName: 'Choice shortname',
        hint: 'Choice hint',
        value: true
      })
    }
  })

  /** *********************** GET All *************************** **/
  routesHelper.getRequestTests({ lab, Model: Choice, url: path })

  /** ********************** GET By Id ************************** **/
  routesHelper.getByIdRequestTests({ lab, Model: Choice, url: path })

  /** ************************* POST **************************** **/
  routesHelper.postRequestTests({ lab, Model: Choice, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is posted', async ({ context }) => {
      const { request, server } = context
      const message = `${emptyMessage('label')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request({ label: '' })), expectedResponse)
    })
  })

  /** ************************ PATCH **************************** **/
  routesHelper.patchRequestTests({ lab, Model: Choice, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is patched', async ({ context }) => {
      const { mocks, request, server } = context
      const message = `${emptyMessage('label')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request(mocks.id, { label: '' })), expectedResponse)
    })
  })

  /** ************************ DELETE *************************** **/
  routesHelper.deleteRequestTests({ lab, Model: Choice, url: path })
})
