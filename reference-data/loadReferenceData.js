const wreck = require('@hapi/wreck')
const { logger } = require('defra-logging-facade')

const groups = Object.entries(require('./index')).map(([prop, data]) => {
  data.type = prop
  return data
})

async function load (uri, data) {
  const res = await wreck.request('POST', uri, { payload: data })
  return wreck.read(res, { json: true })
}

async function loadReferenceData (uri) {
  Promise.all(groups.map(async (groupData) => {
    const { type, title, choices, hint } = groupData
    const group = await load(`${uri}/groups`, { type, title, hint })
    logger.debug({ group })

    const { id: groupId } = group

    return Promise.all(choices.map(async ({ label, shortName, hint }, rank) => {
      const choice = await load(`${uri}/choices`, { label, shortName, groupId, rank, hint })
      logger.debug({ choice })
    }))
  }))
}

module.exports = loadReferenceData
