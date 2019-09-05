module.exports.Pool = class Pool {
  constructor (options = {}) {
    Object.assign(this, options)
  }

  async query () {
    return {
      rowCount: 0,
      rows: []
    }
  }
}
