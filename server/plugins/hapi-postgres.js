const { Choice, Group, Address, Person, Item, Registration } = require('../dal')

// const queries = fs.readFileSync(path.join(__dirname, '../../postgres/clear.sql'), { encoding: 'UTF-8' }).split(';\n')

module.exports = {
  plugin: {
    name: 'hapi-postgres',
    register: (server) => {
      server.events.on('start', async () => {
        await Group.createTable()
        await Choice.createTable()
        await Address.createTable()
        await Person.createTable()
        await Item.createTable()
        await Registration.createTable()

        //
        // while (queries.length) {
        //   const query = queries.shift().trim()
        //   await pool.query(query)
        // }
        //
        // const { rows } = await pool.query('INSERT INTO address(addressLine1, addressLine2, town, county, country, postcode, uprn) VALUES($1, $2, $3, $4, $5, $6, $7)', ['22', 'Willowbank', 'Chippenham', 'Wiltshire', 'UK', 'SN14 6QG', 234324234])
        // console.log(rows)
        //
        // await pool.query('SELECT * FROM address ORDER BY id ASC', (err, res) => {
        //   console.log(err, res)
        //   pool.end()
        // })
      })
    }
  }
}
