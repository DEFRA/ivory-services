const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Boom = require('@hapi/boom')
const TestHelper = require('../../test-helper')
const path = '/addresses'
const { Address } = require('../models')

const { emptyMessage } = TestHelper

const emptyAddress = {
  postcode: '',
  addressLine1: '',
  addressLine2: '',
  town: '',
  county: '',
  country: '',
  uprn: ''
}

lab.experiment(TestHelper.getFile(__filename), () => {
  const routesHelper = TestHelper.createRoutesHelper(lab, __filename, {
    mocks: {
      id: 'a5754ea4-aee8-40d3-a0d7-e7681ed8ef3a',
      model: new Address({
        postcode: 'WA4 1AB',
        addressLine1: '21',
        addressLine2: 'Jump Street',
        town: 'Miami',
        county: 'Florida',
        country: 'United states of America',
        uprn: '1010101010'
      })
    }
  })

  /** *********************** GET All *************************** **/
  routesHelper.getRequestTests({ lab, Model: Address, url: path })

  /** ********************** GET By Id ************************** **/
  routesHelper.getByIdRequestTests({ lab, Model: Address, url: path })

  /** ************************* POST **************************** **/
  routesHelper.postRequestTests({ lab, Model: Address, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is posted', async ({ context }) => {
      const { request, server } = context
      const message = `${emptyMessage('addressLine1')}. ${emptyMessage('town')}. ${emptyMessage('postcode')}. ${emptyMessage('uprn')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request(emptyAddress)), expectedResponse)
    })
  })

  /** ************************ PATCH **************************** **/
  routesHelper.patchRequestTests({ lab, Model: Address, url: path }, () => {
    lab.test('responds with "Bad Data" when invalid data is patched', async ({ context }) => {
      const { mocks, request, server } = context
      const message = `${emptyMessage('addressLine1')}. ${emptyMessage('town')}. ${emptyMessage('postcode')}. ${emptyMessage('uprn')}`
      const expectedResponse = Boom.badData(message).output
      TestHelper.testResponse(await server.inject(request(mocks.id, emptyAddress)), expectedResponse)
    })
  })

  /** ************************ DELETE *************************** **/
  routesHelper.deleteRequestTests({ lab, Model: Address, url: path })
})
