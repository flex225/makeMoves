const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const jsonwebtoken = require('jsonwebtoken')
const withBody = bodyParser.json()
const router = express.Router()
const jwtKey = process.env['JWT_KEY'] || 'shared-secret'

const withAuthUserId = [
  cookieParser(),
  (req, res, next) => {
    try {
      const claims = jsonwebtoken.verify(req.cookies['jwt'], jwtKey)
      req['authUserId'] = claims['sub']
      next()
    } catch (e) {
      res.redirect('/error')
    }
  },
]

module.exports = (client) => {
  /* GET users listing. */
  router.get('/', function (req, res, next) {
    res.render('login')
  })

  router.post('/login', withBody, async (req, res) => {
    const { username, password } = req.body
    const query = `SELECT * FROM users WHERE username=${username} AND password=${password}`
    const user = await client.query(query)
    // get user from db
    if (user) {
      const jwt = jsonwebtoken.sign({ sub: username }, jwtKey)
      res.cookie('jwt', jwt)
      res.render('messages')
    } else {
      res.redirect('/login', { error: 'Credentials are incorrenct' })
    }
  })

  router.get('/messages', ...withAuthUserId, async function (req, res, next) {
    const query = `SELECT * FROM messages`
    const messages = await client.query(query)
    res.render('messages', { messages })
  })

  router.delete('/message:id', ...withAuthUserId, async function (
    req,
    res,
    next
  ) {
    const query = `DELETE FROM messages WHERE id=${req.params.id}`
    const message = await client.query(query)
    res.redirect('/messages')
  })

  return router
}
