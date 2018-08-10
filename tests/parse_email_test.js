const parserAPI = require('../api/parsing/parseEmail')

// run tests with:

// kijiji direct
// $ NODE_ENV=development SES_MESSAGE_ID=ptvr19job3tjpc3tv12oi0bn07gbhb0up54dlp01 S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js
// kijiji fwd 1
// $ NODE_ENV=development SES_MESSAGE_ID=22n8h8jufepimcpme3sfo9d6aiqurubtnksal501 S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js
// kijiji fwd 2
// $ NODE_ENV=development SES_MESSAGE_ID=5mvobiisevmd3t53r4h4kj3d5r7pf0pv82f0ocg1 S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js

// zumper direct
// $ NODE_ENV=development SES_MESSAGE_ID=s60jmguuhicavadl353289dlaqruvur7r11t3ro1 S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js
// zumper fwd 1
// $ NODE_ENV=development SES_MESSAGE_ID=jj0ogrejiirva42931qc2heq5r7pf0pkkcra96g1 S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js
// zumper reply chain
// $ NODE_ENV=development SES_MESSAGE_ID=fm8rtmh65s0bfeo9k7v7k292sk25oi7tscqqf681 S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js
// zumper fwd 2 (gmail + outlook)
// $ NODE_ENV=development SES_MESSAGE_ID=jk3dgu2mh211vge6sjbpe5pkl541012ddq0h6b81 S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js

// padmapper fwd 2
// $ NODE_ENV=development SES_MESSAGE_ID=db0elsfb25klrieisl61tdvc6na8p7ob86014b01 S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js

// full outlook reply chain
// $ NODE_ENV=development SES_MESSAGE_ID=9r6abmgj1fe95rre9sflnnk3u484gn0j8odojdo1 S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js

console.log('====. BEGINNING PARSE EMAIL TEST!')
parserAPI.parseEmail(`emails/${process.env.SES_MESSAGE_ID}`)
  .then((data) => {
    console.log('====. COMPLETED PARSE EMAIL TEST!')
    console.log(data)
  })
  .catch((err) => {
    console.log('====. FAILED PARSE EMAIL TEST!')
    console.log(err)
  })


// run test with:
// $ NODE_ENV=development SES_MESSAGE_ID=none S3_BUCKET=myrenthelper-emails node tests/parse_email_test.js
// const split_text = require('../samples/emails/emails_as_split_text')
// console.log('====. BEGINNING CATEORIZE LINES TEST!')
// parserAPI.categorizeLines(split_text.zumper_direct)
//   .then((data) => {
//     console.log('====. COMPLETED CATEORIZE LINES TEST!')
//     console.log(data)
//   })
//   .catch((err) => {
//     console.log('====. FAILED CATEORIZE LINES TEST!')
//     console.log(err)
//   })
