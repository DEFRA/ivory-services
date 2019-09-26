const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Boom = require('@hapi/boom')
const TestHelper = require('../../test-helper')
const path = '/items'
const { Item } = require('../models')

const { emptyMessage } = TestHelper

lab.experiment(TestHelper.getFile(__filename), () => {
  const routesHelper = TestHelper.createRoutesHelper(lab, __filename, {
    mocks: {
      id: 'a5754ea4-aee8-40d3-a0d7-e7681ed8ef3a',
      model: new Item({
        description: 'A description of the item containing ivory',
        itemType: 'item-type',
        ageExemptionDeclaration: true,
        ageExemptionDescription: 'age exemption',
        volumeExemptionDeclaration: true,
        volumeExemptionDescription: 'volume exemption'
      })
    }
  })

  /** *********************** GET All *************************** **/
  routesHelper.getRequestTests({ lab, Model: Item, url: path })

  /** ********************** GET By Id ************************** **/
  routesHelper.getByIdRequestTests({ lab, Model: Item, url: path })

  /** ************************* POST **************************** **/
  routesHelper.postRequestTests({ lab, Model: Item, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is posted', async ({ context }) => {
      const { request, server } = context
      const message = `${emptyMessage('description')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request({ description: '' })), expectedResponse)
    })
  })

  /** ************************ PATCH **************************** **/
  routesHelper.patchRequestTests({ lab, Model: Item, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is patched', async ({ context }) => {
      const { mocks, request, server } = context
      const message = `${emptyMessage('description')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request(mocks.id, { description: '' })), expectedResponse)
    })
  })

  /** ************************ DELETE *************************** **/
  routesHelper.deleteRequestTests({ lab, Model: Item, url: path })
})
