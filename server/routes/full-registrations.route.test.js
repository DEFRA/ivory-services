const Lab = require('@hapi/lab')
const lab = exports.lab = Lab.script()
const Boom = require('@hapi/boom')
const cloneDeep = require('lodash.clonedeep')
const TestHelper = require('../../test-helper')
const path = '/full-registrations'
const models = require('../models')
const { FullRegistration, Registration, Person, Address, Item } = models
const { uuid, cloneAndMerge } = require('ivory').utils

const UNKNOWN_GUID = uuid()
const INVALID_GUID = 'INVALID-GUID'

function stubGetById (Model, data) {
  const { id } = data
  const model = new Model(cloneAndMerge(data, { id: null }))
  model.id = id
  return model
}

lab.experiment(TestHelper.getFile(__filename), () => {
  TestHelper.createRoutesHelper(lab, __filename, {
    mocks: {
      id: uuid(),
      registration: new FullRegistration({
        agentActingAs: 'Agent acting as',
        agentIsOwner: true,
        owner: {
          id: uuid(),
          address: {
            id: uuid(),
            postcode: 'WA4 1AB',
            buildingNumber: '12',
            street: 'Tiny street',
            town: 'Big town',
            county: 'Medium County',
            country: 'Little Britain',
            uprn: '123456789'
          },
          fullName: 'Owner full name',
          email: 'Owner@email.com'
        },
        agent: {
          id: uuid(),
          address: {
            id: uuid(),
            postcode: 'WA4 1AB',
            buildingNumber: '12',
            street: 'Tiny street',
            town: 'Big town',
            county: 'Medium County',
            country: 'Little Britain',
            uprn: '123456789'
          },
          fullName: 'Agent full name',
          email: 'Agent@email.com'
        },
        item: {
          id: uuid(),
          description: 'item description'
        }
      })
    }
  })

  lab.beforeEach(({ context }) => {
    // Stub retrieving the data
    const { mocks, sandbox } = context
    const { registration } = cloneDeep(mocks)

    const { agent, owner, item } = registration
    registration.agentId = agent.id
    registration.ownerId = owner.id
    registration.itemId = item.id
    delete registration.agent
    delete registration.owner
    delete registration.item
    sandbox.stub(Registration, 'getById').value(async () => stubGetById(Registration, registration))

    const { address: agentAddress } = agent
    const { address: ownerAddress } = owner
    agent.addressId = agentAddress.id
    owner.addressId = ownerAddress.id
    delete agent.address
    delete owner.address
    sandbox.stub(Person, 'getById').value(async (id) => {
      switch (id) {
        case agent.id:
          return stubGetById(Person, agent)
        case owner.id:
          return stubGetById(Person, owner)
      }
    })
    sandbox.stub(Address, 'getById').value(async (id) => {
      switch (id) {
        case agentAddress.id:
          return stubGetById(Address, agentAddress)
        case ownerAddress.id:
          return stubGetById(Address, ownerAddress)
      }
    })
    sandbox.stub(Item, 'getById').value(async () => stubGetById(Item, item))
  })

  /** ********************** GET By Id ************************** **/
  lab.experiment(`GET ${path}/{id}`, () => {
    lab.beforeEach(({ context }) => {
      context.request = (id) => ({
        method: 'GET',
        url: `${path}/${id}`
      })
    })

    lab.test('responds with the existing registration when {id} is an existing guid', async ({ context }) => {
      const { mocks, request, server } = context

      TestHelper.testResponse(await server.inject(request(mocks.id)), {
        statusCode: 200,
        payload: mocks.registration
      })
    })

    lab.test('responds with "Not Found" when {id} is an unknown guid', async ({ context }) => {
      const { request, server, sandbox } = context
      sandbox.stub(Registration, 'getById').value(async () => undefined)

      TestHelper.testResponse(await server.inject(request(UNKNOWN_GUID)), Boom.notFound().output)
    })

    lab.test('responds with "Bad Data" when {id} is an invalid guid', async ({ context }) => {
      const { request, server } = context
      TestHelper.testResponse(await server.inject(request(INVALID_GUID)), Boom.badData(TestHelper.invalidGuidMessage('id')).output)
    })

    lab.test('responds with "Bad Implementation" when the request throws an error', async ({ context }) => {
      const { mocks, request, server, sandbox } = context
      sandbox.stub(Registration, 'getById').value(async () => {
        throw new Error('failure')
      })

      TestHelper.testResponse(await server.inject(request(mocks.id)), Boom.badImplementation().output)
    })
  })

  /** ************************* POST **************************** **/
  lab.experiment(`POST ${path}`, () => {
    lab.beforeEach(({ context }) => {
      context.request = (data) => ({
        method: 'POST',
        url: path,
        payload: data
      })
    })

    lab.test(`responds with the added ${FullRegistration.name}`, async ({ context }) => {
      const { mocks, request, server } = context

      TestHelper.testResponse(await server.inject(request(mocks.registration)), {
        statusCode: 200,
        payload: mocks.registration
      })
    })

    lab.test('responds with "Bad Implementation" when the request throws an error', async ({ context }) => {
      const { mocks, request, server, sandbox } = context
      sandbox.stub(Registration.prototype, 'save').value(async () => {
        throw new Error('failure')
      })

      TestHelper.testResponse(await server.inject(request(mocks.registration)), Boom.badImplementation().output)
    })
  })

  /** ************************ PATCH **************************** **/
  lab.experiment(`PATCH ${path}/{id}`, () => {
    lab.beforeEach(({ context }) => {
      // Create PATCH request
      context.request = (id, data) => {
        return {
          method: 'PATCH',
          url: `${path}/${id}`,
          payload: data
        }
      }
    })

    lab.test('responds with the updated registration when {id} is an existing guid', async ({ context }) => {
      const { mocks, request, server, sandbox } = context
      sandbox.stub(Registration, 'getById').value(async () => mocks.registration)
      sandbox.stub(Registration.prototype, 'save').value(async () => mocks.registration)

      TestHelper.testResponse(await server.inject(request(mocks.id, mocks.registration)), {
        statusCode: 200,
        payload: mocks.registration
      })
    })

    lab.test('responds with "Not Found" when {id} is an unknown guid', async ({ context }) => {
      const { mocks, request, server, sandbox } = context
      sandbox.stub(Registration, 'getById').value(async () => undefined)

      TestHelper.testResponse(await server.inject(request(UNKNOWN_GUID, mocks.registration)), Boom.notFound().output)
    })

    lab.test('responds with "Bad Data" when {id} is an invalid guid', async ({ context }) => {
      const { mocks, request, server } = context
      TestHelper.testResponse(await server.inject(request(INVALID_GUID, mocks.registration)), Boom.badData(TestHelper.invalidGuidMessage('id')).output)
    })

    lab.test('responds with "Bad Implementation" when the request throws an error', async ({ context }) => {
      const { mocks, request, server, sandbox } = context
      sandbox.stub(Registration, 'getById').value(async () => {
        throw new Error('failure')
      })

      TestHelper.testResponse(await server.inject(request(mocks.id, mocks.registration)), Boom.badImplementation().output)
    })
  })
})
