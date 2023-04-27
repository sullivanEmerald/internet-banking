const mailer = require('nodemailer')

require('dotenv').config({ path : './config/.env'})

var transporter = mailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS
    }
});


module.exports = transporter