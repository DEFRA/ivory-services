const { Choice, Group } = require('../server/models')

const groups = Object.entries(require('../reference-data')).map(([prop, data]) => {
  data.type = prop
  return data
})

async function loadReferenceData () {
  return Promise.all(groups.map(async (groupData) => {
    const { type, title, choices, hint } = groupData
    const result = await Group.getAll({ type })
    const group = new Group(result.length ? result.pop() : { type })
    if (title !== undefined) group.title = title
    if (hint !== undefined) group.hint = hint
    const { id: groupId } = await group.save()

    return Promise.all(choices.map(async ({ label, shortName, hint, value, ageExemptionDeclaration, volumeExemptionDeclaration }, rank) => {
      const result = await Choice.getAll({ shortName })
      const choice = new Choice(result.length ? result.pop() : { shortName, rank, groupId })
      if (label !== undefined) choice.label = label
      if (hint !== undefined) choice.hint = hint
      if (value !== undefined) choice.value = value
      if (ageExemptionDeclaration !== undefined) choice.ageExemptionDeclaration = ageExemptionDeclaration
      if (volumeExemptionDeclaration !== undefined) choice.volumeExemptionDeclaration = volumeExemptionDeclaration
      await choice.save()
    }))
  }))
}

module.exports = loadReferenceData
