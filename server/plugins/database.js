const { register } = require('hapi-postgres-connection')
module.exports = {
  plugin: {
    name: 'hapi-postgres-connection',
    register,
    options: {
      connectionString: 'postgres://username:password@localhost/database'
    }
  }
}
