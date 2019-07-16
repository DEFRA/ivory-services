const dataStore = {}
const BaseDal = require('./baseDal')

module.exports = class ItemDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
