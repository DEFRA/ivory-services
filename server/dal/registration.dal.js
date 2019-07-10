const dataStore = {}
const BaseDal = require('./baseDal')

module.exports = class RegistrationDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
