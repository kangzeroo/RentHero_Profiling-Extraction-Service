const parserAPI = require('../api/parsing/parseEmail')

// accepts a message location, which is a file's keyname in a specified s3 bucket
// returns an array of forwarded messages (aka the convo thread seperated into chunks)
module.exports = function(event, context, callback) {
  // ---------------------------------------------------------------
  //                    INITIAL INFO GRABBING
  // ---------------------------------------------------------------
  console.log('------ LAMBDA EVENT OBJECT ------')
  console.log(event)
  console.log('------ LAMBDA CONTEXT OBJECT ------')
  console.log(context)
  console.log('------ SES MESSAGE ID ------')
  const SES_MESSAGE_LOCATION = JSON.parse(event.body).message_location
  const LEAD_CHANNEL = JSON.parse(event.body).lead_channel
  console.log('SES_MESSAGE_LOCATION: ', SES_MESSAGE_LOCATION)
  console.log('LEAD_CHANNEL: ', LEAD_CHANNEL)
  // console.log('------ OVERRIDDEN ENV VARS ------')
  // console.log('api-gateway to lambda stage: ', event.requestContext.stage)
  // process.env.NODE_ENV = event.requestContext.stage
  console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
  // process.env.S3_BUCKET = require(`../creds/${event.requestContext.stage}/s3_creds`).s3_bucket().bucketname
  console.log('s3-bucket: ', process.env.S3_BUCKET)
  /*
    SES_MESSAGE_LOCATION = 'agent_emails/ADSLGJ8689SDKJHFG6787HD'
  */

  parserAPI.parseEmail(SES_MESSAGE_LOCATION, LEAD_CHANNEL)
    .then((data) => {
      console.log('------ ALL WAS SUCCESSFUL ------')
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Successfully parsed this email!',
          data: data
        }),
      };
      callback(null, response);
    })
    .catch((err) => {
      console.log('------ CRITICAL ERROR OCCURRED ------')
      const response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Failed to parse this email!',
          data: err
        }),
      };
      callback(null, response);
    })
}
