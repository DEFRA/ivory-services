const dataStore = {}
const BaseDal = require('./baseDal')

module.exports = class GroupDal extends BaseDal {
  static get dataStore () {
    return dataStore
  }
}
