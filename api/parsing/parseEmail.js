const simpleParser = require('mailparser').simpleParser
const s3API = require('../s3/s3_api')
const classifyLines = require('./email_line_classifier')
const chunkLines = require('./email_section_chunker')

// parse a new email and return chronologically forwarded messages in email thread (noise removed)
// the SES_MESSAGE_ID is used to retrieve the email from S3
module.exports.parseEmail = function(s3ItemKey) {
  const p = new Promise((res, rej) => {
    s3API.grabEmail(process.env.S3_BUCKET, s3ItemKey)
      .then((s3Email) => {
        return module.exports.parseContents(s3Email)
      })
      .then((data) => {
        res(data)
      })
      .catch((err) => {
        rej(err)
      })
  })
  return p
}

// extract stuff out of the MIME email format
module.exports.parseContents = function(s3Email) {
  const p = new Promise((res, rej) => {
    let readableFormat
    const em = s3Email.Body.toString('utf8')
    simpleParser(em)
      .then((data) => {
        console.log(`------ PARSING EMAIL INTO READABLE FORMAT ------`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        readableFormat = data
        console.log(readableFormat)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>`)
        return module.exports.categorizeLines(readableFormat.text)
      })
      .then((chunks) => {
        console.log(`------ Successfully extracted the contents of the email ------`)
        console.log(chunks)
        res(chunks)
      })
      .catch((err) => {
        console.log(`------ Failed to parse email into readable format ------`)
        console.log(err)
        rej(err)
      })
  })
  return p
}

module.exports.categorizeLines = function(text) {
// module.exports.categorizeLines = function(texts) {
  const p = new Promise((res, rej) => {
    console.log(`------ GOT THE TEXT OF THE EMAIL ------`)
    console.log(text)
    console.log(`------ SEPERATED THE TEXT OF THE EMAIL ------`)
    const texts = text.split('\n')
    console.log(texts)
    classifyLines(texts)
      .then((linesAugm) => {
        // console.log(linesAugm.filter((l) => {
        //   return l.classification === 'contactInfoScore' || l.classification === 'seperaterScore' || l.classification === ''
        // }).map((l) => {
        //   return l.classification === 'seperaterScore' ? '=============================' : l.line
        // }))
        return chunkLines(linesAugm)
      })
      .then((chunks) => {
        console.log('-------- DONE')
        console.log(chunks)
        res(chunks)
      })
      .catch((err) => {
        console.log(err)
        rej(err)
      })
  })
  return p
}
