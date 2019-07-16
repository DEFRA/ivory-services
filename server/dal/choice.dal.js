const dataStore = {}
const BaseDal = require('./baseDal')

module.exports = class ChoiceDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
