const axios = require('axios')
const RDS_MS = require(`../../creds/${process.env.NODE_ENV}/API_URLS`).RDS_MS

// grab alias_emails from original_emails, and add to db if not exists
module.exports.get_alias_email_of_lead = function(lead_id) {
  console.log(`------ Trading in lead_id for alias_email ------`)
  console.log(lead_id)
  // from_emails = [emailA, emailB]
  const headers = {
    headers: {
      Authorization: `Bearer xxxx`
    }
  }
  const p = new Promise((res, rej) => {
    axios.post(`${RDS_MS}/get_alias_email_of_lead`, { lead_id: lead_id }, headers)
      .then((data) => {
        console.log(`------ Successful POST/get_alias_email_of_lead ------`)
        console.log(data.data)
        res(data.data.alias_email)
      })
      .catch((err) => {
        console.log('------> Failed POST/get_alias_email_of_lead')
        console.log(err)
        rej(err)
      })
  })
  return p
}

// grab agent_email from staff_id
module.exports.get_agent_email_of_staff = function(staff_id) {
  console.log(`------ Trading in lead_id for alias_email ------`)
  console.log(staff_id)
  // from_emails = [emailA, emailB]
  const headers = {
    headers: {
      Authorization: `Bearer xxxx`
    }
  }
  const p = new Promise((res, rej) => {
    axios.post(`${RDS_MS}/get_agent_email_of_staff`, { staff_id: staff_id }, headers)
      .then((data) => {
        console.log(`------ Successful POST/get_agent_email_of_staff ------`)
        console.log(data.data)
        res(data.data.agent_email)
      })
      .catch((err) => {
        console.log('------> Failed POST/get_agent_email_of_staff')
        console.log(err)
        rej(err)
      })
  })
  return p
}

// grab alias_emails from original_emails, and add to db if not exists
module.exports.grab_alias_emails = function(original_emails) {
  console.log(`------ Trading in original_emails for alias_emails ------`)
  console.log(original_emails)
  // from_emails = [emailA, emailB]
  const headers = {
    headers: {
      Authorization: `Bearer xxxx`
    }
  }
  const p = new Promise((res, rej) => {
    axios.post(`${RDS_MS}/grab_alias_emails`, { original_emails: original_emails }, headers)
      .then((data) => {
        console.log(`------ Successful POST/grab_alias_emails ------`)
        console.log(data.data)
        res(data.data.pairs)
      })
      .catch((err) => {
        console.log('------> Failed POST/grab_alias_emails')
        console.log(err)
        rej(err)
      })
  })
  return p
}
