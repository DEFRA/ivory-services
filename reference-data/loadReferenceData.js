const { Choice, Group } = require('../server/models')

const groups = Object.entries(require('../reference-data')).map(([prop, data]) => {
  data.type = prop
  return data
})

async function load (Model, data) {
  const model = new Model(data)
  return model.save()
}

async function loadReferenceData (uri) {
  return Promise.all(groups.map(async (groupData) => {
    const { type, title, choices, hint } = groupData
    const group = await load(Group, { type, title, hint })

    const { id: groupId } = group

    return Promise.all(choices.map(async ({ label, shortName, hint, value }, rank) => load(Choice, { label, shortName, groupId, rank, hint, value })))
  }))
}

module.exports = loadReferenceData
