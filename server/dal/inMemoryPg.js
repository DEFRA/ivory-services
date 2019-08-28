module.exports.Pool = class Pool {
  constructor (options = {}) {
    Object.assign(this, options)
  }

  async query () {
    return {
      rows: []
    }
  }
}
