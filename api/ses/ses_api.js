const axios = require('axios')
const mailcomposer = require('mailcomposer')
const path = require('path')
const pathToAWSConfig = path.join(__dirname, '../..', 'creds', process.env.NODE_ENV, 'aws_config.json')
const aws_config = require(pathToAWSConfig)
const AWS = require('aws-sdk')
AWS.config.update(aws_config)


// From Agent to Lead
module.exports.sendForthEmails = function(mail){
  console.log('------ SENDING OUT THE EMAILS ------')
  const ses = new AWS.SES()
  const p = new Promise((res, rej) => {
    mail.build((err, message) => {
      if (err) {
        rej({ message: `Error creating raw email with mailcomposer: ${err}`, err: err })
      }
      const params = { RawMessage: { Data: message }}
      console.log('params: ', params)
      ses.sendRawEmail(params, function(err, data) {
        if (err) {
          rej({ message: `Error sending raw email with SES: ${err}`, err: err })
          return
        }
        console.log(`------ SES SUCCESSFULLY SENT FORTH EMAIL ------`)
        console.log(data)
        res(data)
      })
    })
  })
  return p
}
