const AWS = require('aws-sdk')
const path = require('path')
const pathToAWSConfig = path.join(__dirname, '../..', 'creds', process.env.NODE_ENV, 'aws_config.json')
const aws_config = require(pathToAWSConfig)
AWS.config.update(aws_config)
const extractionAPI = require('../extraction/extraction_api')
const rdsAPI = require('../rds/rds_api')

module.exports.grabEmail = function(bucket, key){
  console.log(`------ GRABBING EMAIL FROM S3 at Bucket:${bucket} and Key:${key} ------`)
  const p = new Promise((res, rej) => {
    const s3 = new AWS.S3()
    var params = {
      Bucket: bucket,
      Key: key
    }
    s3.getObject(params, function(err, data) {
       if (err) {
         console.log(`------ Failed GET/${bucket}:${key} ------`)
         console.log(err, err.stack)
         rej(err)
       } else {
         console.log(`------ Successful GET/${bucket}:${key} ------`)
         console.log(data)
         res(data)
       }
    })
  })
  return p
}

module.exports.grabBulkAttachments = function(arrayOfS3Links) {
  const p = new Promise((res, rej) => {
    const arrayOfPromises = arrayOfS3Links.map((s3_link) => {
      return Promise.resolve(s3_link)
      // return module.exports.grabEmail('xxxx', 'xxx')
    })
    Promise.all(arrayOfPromises)
      .then((results) => {
        console.log(results)
        res([])
        // res([
        //   {
        //     filename: 'attc.filename',
        //     content: 'attc.content'
        //   }
        // ])
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

// $ NODE_ENV=development S3_BUCKET='renthero-ai-dev-emails' node api/s3/s3_api.js
module.exports.retreiveEmailSubjectCCsAndFwdHistory = function(SES_MESSAGE_ID) {
  const p = new Promise((res, rej) => {
    console.log('retreiveEmailSubjectCCsAndFwdHistory')
    // needs to exchange the original CCs for alias emails
    let CCs
    let s3Email
    module.exports.grabEmail(process.env.S3_BUCKET, `proxy_emails/${SES_MESSAGE_ID}`)
      .then((email) => {
        console.log(email)
        return extractionAPI.extractEmail(email)
      })
      .then((email) => {
        console.log('-------------------------------')
        s3Email = email
        console.log(s3Email)
        const ccValue = s3Email.cc && s3Email.cc.text ? s3Email.cc.text : ''
        CCs = extractionAPI.extractPeoples(ccValue)
        return rdsAPI.grab_alias_emails(CCs)
      })
      .then((pairs) => {
        const obj = {
          cc: CCs.map((cc) => {
            return loopFindPair(cc, pairs)
          }),
          subject: s3Email.subject || '',
          fwdHistoryText: s3Email.text,
          fwdHistoryHtml: s3Email.textAsHtml
        }
        console.log(obj)
        res(obj)
      })
      .catch((err) => {
        console.log(err)
        rej(err)
      })
  })
  return p
}

const loopFindPair = (email, aliasPairs) => {
  let pair = email
  aliasPairs.forEach((prx) => {
    if (prx.original_email === email) {
      pair = prx.alias_email
    }
    if (prx.alias_email === email) {
      pair = prx.original_email
    }
  })
  return pair
}


module.exports.retreiveEmailSubjectCCsAndFwdHistory('abggrssghobn5fbe35tuae41f6cc12l7pmg34301')
