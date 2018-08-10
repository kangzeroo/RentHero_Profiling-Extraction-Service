const Fuse = require('fuse.js')

// REMEMBER, A SCORE OF 0 IS BETTER THAN 1


// classifyLines()
module.exports = function(lines) {
  const p = new Promise((res, rej) => {
    const classifiedLines = lines.map((line) => {
      let lineInfo = {
        line: line,
        classification: '',
        emptyScore: classifyEmpty(line),
        junkScore: classifyJunk(line),
        introScore: classifyIntro(line),
        contactInfoScore: classifyContactInfo(line),
        // messageScore: classifyMessage(line),
        seperaterScore: classifySeperator(line)
      }
      let highScore = 1

      // the order matters! all scores are 0 if matched using Regex
      if (lineInfo.emptyScore.score <= highScore && lineInfo.emptyScore.score <= 0.3) {
        lineInfo.classification = 'emptyScore'
      }
      if (lineInfo.junkScore.score <= highScore && lineInfo.junkScore.score <= 0.3) {
        lineInfo.classification = 'junkScore'
      }
      if (lineInfo.introScore.score <= highScore && lineInfo.introScore.score <= 0.3) {
        lineInfo.classification = 'introScore'
      }
      if (lineInfo.contactInfoScore.score <= highScore && lineInfo.contactInfoScore.score <= 0.3) {
        lineInfo.classification = 'contactInfoScore'
      }
      if (lineInfo.seperaterScore.score <= highScore && lineInfo.seperaterScore.score <= 0.3) {
        lineInfo.classification = 'seperaterScore'
      }
      // if (lineInfo.messageScore.score < highScore && lineInfo.messageScore.score < 0.3) {
      //   lineInfo.classification = 'messageScore'
      // }
      return lineInfo
    })
    console.log('--------------')
    console.log(classifiedLines.map((l) => l.classification))
    res(classifiedLines)
  })
  return p
}

const classifyEmpty = function(line) {
  let empty = false
  if (line === '' || line === '>' || line === '>>' || line === '>>>' || line === '>>>>') {
    empty = true
  }
  if (line === '> >' || line === '> > >' || line === '> > >' || line === '> <' || line === '> > <' || line === '> > > <') {
    empty = true
  }
  return {
    score: empty ? 0 : 1,
    line: line,
    title: empty ? 'empty' : 'unknown',
  }
}

// junk = disclaimers, legal jargon, styling
const classifyJunk = function(line) {
  const known_patterns = [
    // we have an extra '\' to escape '\'
    // { id: 0, pattern: '\\d{1}' }
    { id: 0, pattern: '(report spam)' },
    { id: 1, pattern: '(Zumper Inc)' },
    { id: 2, pattern: '(Manage your leads)' },
    { id: 3, pattern: '(Toronto, Ontario | M5V 1L9 | Canada)' },
    { id: 4, pattern: '(2018 eBay International AG)' },
    { id: 5, pattern: '(Operated by: Kijiji)' },
    { id: 6, pattern: '(Terms of Use:)' },
    { id: 7, pattern: '(Contact Kijiji:)' },
    { id: 8, pattern: '(Privacy Policy:)' },
    { id: 9, pattern: '(Read our Safety Tips:)' },
    { id: 10, pattern: '(Take steps to make your Kijiji transactions as secure)' },
    { id: 11, pattern: '(Read our Safety Tips:)' },
    { id: 12, pattern: '(Never click links in an email that ask you to sign in)' },
    { id: 13, pattern: '(All emails warning that "Your Kijiji account)' },
    { id: 14, pattern: '(PayPal transactions made through the Kijiji)' },
    { id: 15, pattern: '(PayPal’s Seller Protection. Kijiji, Ebay and Paypal do not)' },
    { id: 16, pattern: '(offer buyer protection for Kijiji items)' },
    { id: 17, pattern: '(Email Masking:)' },
    { id: 18, pattern: '(Ad no longer relevant?)' },
    { id: 19, pattern: '(Want more replies? Promote your ad through My Kijiji.)' },
    { id: 20, pattern: 'IMPORTANT TIPS FOR YOUR PROTECTION' },
    { id: 21, pattern: 'PadMapper Inc.' },
    { id: 22, pattern: '(http://|https://)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)' },
    { id: 23, pattern: 'You have received a Zumper lead' },
    { id: 24, pattern: 'You have received a Padmapper lead' },
    { id: 25, pattern: 'we now automatically mask email addresses of buyers' },
    { id: 26, pattern: 'on non-commercial ads.' },
    { id: 27, pattern: 'recommend you only use the masked email address' },
    { id: 28, pattern: 'To learn more, click here:' },
    { id: 29, pattern: 'Reminder: You can view your Ad at:' },
    { id: 30, pattern: 'You can respond to' },
    { id: 31, pattern: 'Want more replies? Promote your ad' },
    { id: 32, pattern: 'Manage My Ads email or from Kijiji.' },
    { id: 33, pattern: 'Important Kijiji Safety Notice:' },
    { id: 34, pattern: 'Your Kijiji account has expired' },
    { id: 35, pattern: 'Seller Protection. Kijiji, Ebay and Paypal do not offer buyer protection' },
    { id: 36, pattern: 'Read our Safety Tips' },
    { id: 37, pattern: 'Promote your ad' },
    { id: 38, pattern: 'Email Masking' },
    { id: 39, pattern: 'masked email address when replying to emails' },
    { id: 40, pattern: 'for Kijijiitems. See terms' },
    { id: 41, pattern: 'following our suggested safety tips.' },
    { id: 42, pattern: 'Other options:' },
    { id: 43, pattern: 'or from My Kijiji.' },
    { id: 44, pattern: 'following our suggested safety tips.' },
    { id: 45, pattern: 'expired" are fakes.' },
    { id: 46, pattern: 'Help:' },
    { id: 47, pattern: 'About:' },
    { id: 48, pattern: '.*(-|_|&)+.*' },
    { id: 49, pattern: 'Reply to lead' },
    { id: 50, pattern: 'Report spam' },
    // { id: 42, pattern: '' },
  ]
  const matches = known_patterns.filter((kn) => {
    const re = new RegExp(kn.pattern, 'ig')
    return line.match(re)
  })
  // console.log('-------> matches')
  // console.log(matches[0])
  let isJunk = matches[0] ? true : false
  if (line.length > 10 && line.indexOf(' ') === -1) {
    isJunk = true
  }
  return {
    score: isJunk ? 0 : 1,
    line: line,
    title: isJunk ? 'junk' : 'unknown',
  }
}

// intro = a lead from..., a lead is interested in...
const classifyIntro = function(line) {
  const known_patterns = [
    // we have an extra '\' to escape '\'
    // { id: 0, pattern: '\\d{1}' }
    { id: 1, pattern: '(ad on kijiji)' },
    { id: 2, pattern: '(reply to \\w+)' },
    { id: 3, pattern: 'This message was sent to' },
  ]
  const matches = known_patterns.filter((kn) => {
    const re = new RegExp(kn.pattern, 'ig')
    return line.match(re)
  })
  // console.log('-------> matches')
  // console.log(matches[0])
  return {
    score: matches[0] ? 0 : 1,
    line: line,
    title: matches[0] ? 'intro/outro' : 'unknown',
  }
}

// contact_info = the phone or email of a lead
const classifyContactInfo = function(line) {
  const known_patterns = [
    // we have an extra '\' to escape '\'
    // { id: 0, pattern: '\\d{1}' }
    { id: 'to', pattern: '(to:){1}.*(<*.*@{1}.+>*)*' },
    { id: 'from', pattern: '(from:){1}.*(<*.*@{1}.+>*)*' },
    { id: 'cc', pattern: '(cc:){1}.*(<*.*@{1}.+>*)*' },
    { id: 'subject', pattern: '(subject:){1}.*' },
    { id: 'sent', pattern: '(sent:){1}.*' },
    { id: 'date', pattern: '(date:){1}.*' },
    { id: 'wrote', pattern: '.+\\s{1}(wrote:){1}' },
  ]
  const matches = known_patterns.filter((kn) => {
    const re = new RegExp(kn.pattern, 'ig')
    return line.match(re)
  })
  // console.log('-------> matches')
  const matchedAs = matches[0] ? matches[0].id : ''
  // console.log(matchedAs)
  return {
    score: matchedAs ? 0 : 1,
    line: line,
    title: matchedAs ? matchedAs : 'unknown',
  }
}

// content = the actual message the tenant is trying to say
const classifyMessage = function(line) {

}

const classifySeperator = function(line) {
  const known_patterns = [
    { id: 1, pattern: '.+\\s{1}(wrote:){1}' },
    { id: 2, pattern: '(--+|__+|==+)(\\s?\\w*\\s?\\w*\\s?)?(--+|__+|==+)' },
    { id: 3, pattern: 'wrote:' },
  ]
  const matches = known_patterns.filter((kn) => {
    const re = new RegExp(kn.pattern, 'ig')
    return line.match(re)
  })
  // console.log('-------> matches')
  // console.log(matches)
  return {
    score: matches[0] ? 0 : 1,
    line: line,
    title: matches[0] ? 'seperator' : 'unknown',
  }
}


// const classifySeperator = function(line) {
//   const known_values = [
//     { id: 1, text: '-----------------' },
//     { id: 2, text: '------- forward -------'},
//     { id: 3, text: '________________________________' }
//   ]
//   const options = {
//     shouldSort: true,
//     tokenize: true,
//     includeScore: true,
//     threshold: 0.3,
//     location: 0,
//     distance: 100,
//     maxPatternLength: 32,
//     minMatchCharLength: 1,
//     keys: [
//       "text"
//     ]
//   }
//   // const fuse = new Fuse(known_seperators.map(s => { text: s }), options)
//   const fuse = new Fuse(known_values, options)
//   const score = fuse.search(line)
//   // console.log('---------------> score')
//   const returnedScore = score[0] ? score[0].score : 1
//   // console.log(line)
//   // console.log(returnedScore)
//   return {
//     score: returnedScore,
//     line: line,
//     title: 'seperator'
//   }
// }
