module.exports = {
  plugin: require('hapi-postgres-connection'),
  options: {
    connectionString: 'postgres://username:password@localhost/database'
  }
}
