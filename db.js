const { Client } = require('pg')

module.exports = () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  client.connect().then(() => {
    console.log('Connected to database')
  })
  client.query()

  return client
}
