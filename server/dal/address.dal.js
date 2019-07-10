const dataStore = {}
const BaseDal = require('./baseDal')

module.exports = class AddressDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
