var nodemailer = require('nodemailer');
var express = require('express')
var router = express.Router()
const bodyParser = require('body-parser')
const withBody = bodyParser.json()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Make Moves', error: '', success: '' })
})

router.post('/', withBody, async function (req, res, next) {
  // console.log(req.body)

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,
      pass: process.env.ePass
    }
  });

  const data  = req.body

  const text = `Product: ${data.product}
  Size: ${data.productSize}
  Name: ${data.name}
  Phone number: ${data.phoneNumber}
  Address: ${data.address}
  Deliver time: ${data.time}`
  
  const mailOptions = {
    from: process.env.email,
    to: 'makemoves.am@gmail.com',
    subject: data.product,
    text: text
  };
  
  await transporter.sendMail(mailOptions)


  res.render('index', {
    error: '',
    title: 'Make Moves',
    success: 'Your order successfully submited',
  })
})

module.exports = router
