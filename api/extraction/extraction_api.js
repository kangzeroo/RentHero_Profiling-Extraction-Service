const simpleParser = require('mailparser').simpleParser
const rdsAPI = require('../rds/rds_api')

// Grab the email saved to S3
module.exports.extractEmail = function(S3Email){
  const p = new Promise((res, rej) => {
    console.log(`------ EXTRACTING EMAIL FROM S3 BASE64 ENCODING ------`)
    const em = S3Email.Body.toString('utf8')
    simpleParser(em)
      .then((data) => {
        console.log(`------ PARSING EMAIL INTO READABLE FORMAT ------`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(data)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        res(data)
      })
      .catch((err) => {
        console.log(`------ Failed to parse email into readable format ------`)
        console.log(err)
        rej(err)
      })
  })
  return p
}

// Extract emails from headers such as '"Junior Heffe" <juniorheffe@gmail.com>'
module.exports.extractPeoples = function(headerValue) {
  console.log(`------ EXTRACTING PEOPLE FROM EMAIL HEADERS ------`)
  let ppl = []
  if (headerValue.indexOf('<') > -1) {
    ppl = headerValue.split(',').map((text) => {
      return text.slice(text.indexOf('<')+1, text.indexOf('>'))
    })
  } else {
    ppl = headerValue.replace(' ', '').split(',')
  }
  console.log(ppl)
  return ppl.map(p => p.replace(' ', ''))
}

module.exports.retreiveEmailParticipantsForStaffResponse = function(SENDER_ID, PROXY_EMAIL, STAFF_ID) {
  console.log('sender_id: ', SENDER_ID)
  console.log('proxy_email: ', PROXY_EMAIL)
  console.log('staff_id: ', STAFF_ID)
  /*
    // In this case, CONVO_HISTORY_ITEM will always be a message from a lead. The target email that our realtor is responding to
    CONVO_HISTORY_ITEM = {
        SES_MESSAGE_ID: email_id,
        SENDER_ID: lead_id,
        SENDER_CONTACT: lead_email,
        SENDER_TYPE: 'LEAD_ID',
        RECEIVER_ID: agent_id,
        RECEIVER_CONTACT: agentEmail,
        RECEIVER_TYPE: 'AGENT_ID',
        TIMESTAMP: moment().toISOString(),
        MEDIUM: 'EMAIL',
        PROXY_ID: proxy_id,
        PROXY_CONTACT: proxyEmail,
        MESSAGE: message
    }
  */
  const p = new Promise((res, rej) => {
    let alias_email
    let agent_email
    rdsAPI.get_alias_email_of_lead(SENDER_ID)
      .then((al_email) => {
        alias_email = al_email
        return rdsAPI.get_agent_email_of_staff(STAFF_ID)
      })
      .then((ag_email) => {
        agent_email = ag_email
        res({
          tagged_recipient_email: `TAG___${alias_email}`,
          agent_email: agent_email,
          proxy_email: PROXY_EMAIL
        })
      })
      .catch((err) => {
        console.log(err)
        rej(err)
      })
  })
  return p
}
