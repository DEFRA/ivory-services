const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Boom = require('@hapi/boom')
const TestHelper = require('../../test-helper')
const path = '/groups'
const Group = require('../models/group.model')
const { uuid } = require('ivory-shared').utils

const { emptyMessage } = TestHelper

lab.experiment(TestHelper.getFile(__filename), () => {
  const routesHelper = TestHelper.createRoutesHelper(lab, __filename, {
    mocks: {
      id: uuid(),
      model: new Group({
        type: 'Group type',
        title: 'Group title',
        description: 'Group description',
        hint: 'Group hint',
        multiple: true
      })
    }
  })

  /** *********************** GET All *************************** **/
  routesHelper.getRequestTests({ lab, Model: Group, url: path })

  /** ********************** GET By Id ************************** **/
  routesHelper.getByIdRequestTests({ lab, Model: Group, url: path })

  /** ************************* POST **************************** **/
  routesHelper.postRequestTests({ lab, Model: Group, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is posted', async ({ context }) => {
      const { request, server } = context
      const message = `${emptyMessage('description')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request({ description: '' })), expectedResponse)
    })
  })

  /** ************************ PATCH **************************** **/
  routesHelper.patchRequestTests({ lab, Model: Group, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is patched', async ({ context }) => {
      const { mocks, request, server } = context
      const message = `${emptyMessage('description')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request(mocks.id, { description: '' })), expectedResponse)
    })
  })

  /** ************************ DELETE *************************** **/
  routesHelper.deleteRequestTests({ lab, Model: Group, url: path })
})
