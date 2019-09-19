const Boom = require('@hapi/boom')
const Joi = require('@hapi/joi')
const { logger } = require('defra-logging-facade')
const { utils } = require('ivory-shared')
const { FullRegistration, Registration, Person, Item, Address } = require('../models')

function buildInData (data, payload, path) {
  data[path] = payload
  Object.entries(payload).forEach(([prop, val]) => {
    if (typeof val === 'object') {
      buildInData(data, val, `${path}.${prop}`)
      delete payload[prop]
    }
  })
  return data
}

function getModel (type) {
  switch (type) {
    case 'address': return Address
    case 'item': return Item
    case 'owner':
    case 'agent': return Person
    case 'registration': return Registration
  }
}

class Handlers {
  async getPerson (id) {
    const person = await Person.getById(id)
    if (person.addressId) {
      person.address = await Address.getById(person.addressId)
      delete person.addressId
    }
    return person
  }

  async getData (id) {
    const registration = await Registration.getById(id)
    if (!registration) {
      return Boom.notFound()
    }
    const { ownerId, agentId, itemId } = registration

    if (ownerId) {
      registration.owner = await this.getPerson(ownerId)
      delete registration.ownerId
    }

    if (agentId) {
      registration.agent = await this.getPerson(agentId)
      delete registration.agentId
    }

    if (itemId) {
      registration.item = await Item.getById(registration.itemId)
      delete registration.itemId
    }

    return registration
  }

  async handleGet (request) {
    const registrations = await Registration.getAll(request.query)
    return Promise.all(registrations.map(({ id }) => {
      return this.getData(id)
    }))
  }

  async handleGetById (request) {
    return this.getData(request.params.id)
  }

  async saveData (payload, registrationId) {
    // flatten data from payload
    const data = buildInData({}, payload, 'registration')

    // Make sure the registration has it's ID if it was passed in
    if (registrationId) {
      data.registration.id = registrationId
    }

    // sort the keys of the objects to be persisted into the order they should be saved
    const keys = Object.keys(data).sort((first, second) => first.split('.').length > second.split('.').length)

    const result = {}

    while (keys.length) {
      const key = keys.pop()
      const current = data[key]
      const Model = getModel(key.split('.').pop())

      let model
      if (current.id) {
        model = await Model.getById(current.id)
        if (!model) {
          const message = `Could not find ${Model.name} with id: ${current.id}`
          logger.warn(message)
          return Boom.badData(message)
        }
        Object.assign(model, current)

        // Conversion to a model object must be done without the id so that it passes validation
        delete model.id
        model = new Model(model)
        model.id = current.id
      } else {
        model = new Model(current)
      }
      // Now find and add the id's of the linked records
      const linked = Object.keys(result).filter((prop) => prop.startsWith(`${key}.`) && !prop.substr(key.length + 1).includes('.'))
      linked.forEach((prop) => {
        const id = utils.getNestedVal(result[prop], 'id')
        if (id) {
          const localProp = prop.split(key + '.').pop()
          model[localProp + 'Id'] = id
        }
      })
      result[key] = await model.save()
    }
    return result
  }

  async handlePost (request) {
    const result = await this.saveData(request.payload)
    return this.handleGetById({ params: { id: result.registration.id } })
  }

  async handlePatch (request) {
    const registration = await Registration.getById(request.params.id)
    if (registration) {
      const result = await this.saveData(request.payload, registration.id)
      return this.handleGetById({ params: { id: result.registration.id } })
    }
    return Boom.notFound()
  }

  async handleError (request, h, err) {
    if (err.isJoi && Array.isArray(err.details) && err.details.length > 0) {
      const { payload } = err.output
      return Boom.badData(payload.message, payload)
    }

    return h.response(err)
      .takeover()
  }

  routes ({ path, params, schema }) {
    const handleGet = this.handleGet.bind(this)
    const handleGetById = this.handleGetById.bind(this)
    const handlePost = this.handlePost.bind(this)
    const handlePatch = this.handlePatch.bind(this)
    const handleError = this.handleError.bind(this)

    const query = utils.cloneAndMerge(Registration.schema, { ownerId: null, agentId: null, itemId: null })

    return [
      {
        method: 'GET',
        path,
        handler: handleGet,
        options: {
          tags: ['api'],
          security: true,
          validate: {
            query,
            failAction: handleError
          }
        }
      }, {
        method: 'GET',
        path: `${path}/{id}`,
        handler: handleGetById,
        options: {
          tags: ['api'],
          security: true,
          validate: {
            params,
            failAction: handleError
          }
        }
      }, {
        method: 'POST',
        path,
        handler: handlePost,
        options: {
          tags: ['api'],
          security: true,
          payload: {
            allow: ['application/json']
          },
          validate: {
            payload: schema,
            failAction: handleError
          }
        }
      }, {
        method: 'PATCH',
        path: `${path}/{id}`,
        handler: handlePatch,
        options: {
          tags: ['api'],
          security: true,
          payload: {
            allow: ['application/json']
          },
          validate: {
            params,
            payload: schema,
            failAction: handleError
          }
        }
      }
    ]
  }
}

const handlers = new Handlers()

module.exports = handlers.routes({
  path: '/full-registrations',
  params: FullRegistration.params,
  schema: Joi.object(FullRegistration.schema).label('Full-Registration')
})
