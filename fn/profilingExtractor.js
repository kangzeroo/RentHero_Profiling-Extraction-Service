
module.exports = function(event, context, callback) {
  // extracts details from messages one by one to add to the lead profile
  // ---------------------------------------------------------------
  //                    INITIAL INFO GRABBING
  // ---------------------------------------------------------------
  console.log('------ LAMBDA EVENT OBJECT ------')
  console.log(event)
  console.log('------ LAMBDA CONTEXT OBJECT ------')
  console.log(context)
  console.log('------ SES MESSAGE ID ------')
  const LEAD_ID = JSON.parse(event.body).lead_id
  console.log('LEAD_ID: ', LEAD_ID)
  // console.log('------ OVERRIDDEN ENV VARS ------')
  // console.log('api-gateway to lambda stage: ', event.requestContext.stage)
  // process.env.NODE_ENV = event.requestContext.stage
  console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
  // process.env.S3_BUCKET = require(`../creds/${event.requestContext.stage}/s3_creds`).s3_bucket().bucketname
  console.log('s3-bucket: ', process.env.S3_BUCKET)
  /*
    LEAD_ID = '47kdfsdaf-983asljfk-34ufhksfdasf'
  */

  /*
    STEPS:
    1. Use the lead_id to query DYN:CONVO_HISTORY for sender_id = lead_id
    2. concat all the messages and run them through profiling_api
    3. grab the summary of all the extracted data and save it to a new DYN:LEAD_PROFILE table
  */
}
