const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const Boom = require('@hapi/boom')
const cloneDeep = require('lodash.clonedeep')
const TestHelper = require('../../test-helper')
const path = '/full-registrations'
const models = require('../models')
const { FullRegistration, Registration, Person, Address, Item, Photo } = models
const { uuid, cloneAndMerge } = require('defra-hapi-utils').utils

const UNKNOWN_GUID = uuid()
const INVALID_GUID = 'INVALID-GUID'

function stubGetById (Model, data) {
  const { id } = data
  const options = { id: null }
  Object.entries(data).forEach(([key, val]) => {
    if (val instanceof Array) {
      options[key] = null
    }
  })
  const model = new Model(cloneAndMerge(data, options))
  model.id = id
  return model
}

function validate (registration, flag) {
  return Object.assign({}, registration, { validForPayment: flag })
}

lab.experiment(TestHelper.getFile(__filename), () => {
  TestHelper.createRoutesHelper(lab, __filename, {
    mocks: {
      id: uuid(),
      registration: new FullRegistration({
        agentActingAs: 'Agent acting as',
        ownerType: 'someone-else',
        status: 'draft',
        dealingIntent: 'hire',
        owner: {
          id: uuid(),
          address: {
            id: uuid(),
            postcode: 'WA4 1AB',
            addressLine1: '12',
            addressLine2: 'Tiny street',
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
            addressLine1: '12',
            addressLine2: 'Tiny street',
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
          description: 'item description',
          itemType: 'musical-pre-1975-less-than-20-percent',
          ageExemptionDeclaration: true,
          ageExemptionDescription: 'age exemption',
          volumeExemptionDeclaration: true,
          volumeExemptionDescription: 'volume exemption',
          photos: [
            {
              id: uuid(),
              filename: 'first.jpg',
              rank: 0
            },
            {
              id: uuid(),
              filename: 'second.jpg',
              rank: 1
            }
          ]
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
    sandbox.stub(Registration.prototype, 'save').value(async () => this)

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
    sandbox.stub(Person.prototype, 'save').value(async () => this)
    sandbox.stub(Address, 'getById').value(async (id) => {
      switch (id) {
        case agentAddress.id:
          return stubGetById(Address, agentAddress)
        case ownerAddress.id:
          return stubGetById(Address, ownerAddress)
      }
    })
    sandbox.stub(Address.prototype, 'save').value(async () => this)
    sandbox.stub(Item, 'getById').value(async () => stubGetById(Item, item))
    sandbox.stub(Item.prototype, 'save').value(async () => this)
    sandbox.stub(Photo, 'getAll').value(async () => item.photos.map((photo) => stubGetById(Photo, photo)))
    sandbox.stub(Photo.prototype, 'delete').value(async () => true)
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
        payload: validate(mocks.registration, true)
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
        payload: validate(mocks.registration, true)
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
        payload: validate(mocks.registration, true)
      })
    })

    lab.test('responds with the updated registration when {id} is an existing guid and deletes orphaned photos', async ({ context }) => {
      const { mocks, request, server, sandbox } = context
      sandbox.stub(Registration, 'getById').value(async () => mocks.registration)
      sandbox.stub(Registration.prototype, 'save').value(async () => mocks.registration)
      const photo = {
        id: uuid(),
        filename: 'to-delete.jpg',
        rank: 0
      }
      sandbox.stub(Photo, 'getAll').value(async () => [photo])
      const deletedPhotoIds = []
      sandbox.stub(Photo, 'delete').value(async (id) => {
        deletedPhotoIds.push(id)
        return true
      })

      TestHelper.testResponse(await server.inject(request(mocks.id, mocks.registration)), {
        statusCode: 200,
        payload: validate(mocks.registration, true)
      })

      Code.expect(deletedPhotoIds).to.include(photo.id)
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
