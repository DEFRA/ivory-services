const BaseDal = require('./baseDal')

module.exports = class Choice extends BaseDal {
  static get table () {
    return {
      id: 'uuid default uuid_generate_v1() not null constraint choice_pk primary key',
      groupId: 'uuid constraint choice_group_id_fk references "group"',
      rank: 'integer default 0',
      label: 'varchar not null',
      heading: 'varchar',
      shortName: 'varchar not null',
      display: 'varchar',
      ageExemptionDeclaration: 'varchar',
      volumeExemptionDeclaration: 'varchar',
      hint: 'varchar',
      value: 'varchar'
    }
  }

  static convertValue (value) {
    if (typeof value !== 'string') {
      return value
    }

    switch (value.toLowerCase()) {
      case 'true':
        return true
      case 'false':
        return false
      case 'null':
        return null
      case 'undefined':
        return undefined
      default:
        if (isNaN(value)) {
          return value
        }
        if (value.includes('.')) {
          return parseFloat(value)
        } else {
          parseInt(value)
        }
    }
  }

  static dalToModel (data) {
    const model = super.dalToModel(data)
    model.value = this.convertValue(model.value)
    if (model.value === undefined) {
      delete model.value
    }
    return model
  }
}
