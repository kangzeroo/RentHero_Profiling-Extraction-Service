const LEAD_CHANNELS = require(`../../creds/${process.env.NODE_ENV}/lead_channels`).lead_channels
const EMAIL_CLIENTS = require(`../../creds/${process.env.NODE_ENV}/email_clients`).email_clients


// Determine which email client sent this message
module.exports.determineEmailClient = function(sesEmail) {
  console.log(`------ DETERMINING WHICH EMAIL CLIENT SENT THIS EMAIL ------`)
  console.log('Email Clients: ', EMAIL_CLIENTS().email_clients)
  // sesEmail.headers = [..., { name: 'Received', value: 'from CAN01-QB1-obe.outbound.protection.outlook.com (mail-eopbgr660050.outbound.protection.outlook.com [40.107.66.50]) by inbound-smtp.us-east-1.amazonaws.com with SMTP id t25a4r3fkm2fr7fabopev87v7rfoeljpg3b48ug1 for heffe@myrenthelper.com; Tue, 03 Jul 2018 06:46:57 +0000 (UTC)' }]
  const p = new Promise((res, rej) => {
    let client = 'UNKNOWN'
    const relevantHeaders = sesEmail.headers.filter((header) => {
      return header.name.toLowerCase() === 'received'
    })
    EMAIL_CLIENTS().email_clients.forEach((knownClient) => {
      relevantHeaders.forEach((header) => {
        const beg = header.value.toLowerCase().indexOf('from')
        const end = header.value.toLowerCase().indexOf('(')
        knownClient.client_email_domains.forEach((domain) => {
          if (header.value.toLowerCase().slice(beg, end).indexOf(domain.toLowerCase()) > -1) {
            client = knownClient
          }
        })
      })
    })
    console.log(`------ FINISHED ESTIMATING WHICH EMAIL CLIENT SENT THIS EMAIL ------`)
    console.log(client)
    res({
      title: 'determineEmailClient',
      client: client
    })
  })
  return p
}

// Determine which lead channel this email is coming from (eg. kijiji, direct_tenant..etc)
module.exports.determineLeadChannel = function(extractedS3Email, participants) {
  const p = new Promise((res, rej) => {
    console.log(`------ DETERMINING WHICH CHANNEL GENERATED THIS LEAD ------`)
    // our estimated LEAD_CHANNEL
    let estimated_channel = {
      channel_name: 'UNKNOWN',
      score: 0
    }
    console.log('Lead Channels: ', LEAD_CHANNELS().lead_channels)
    // check every lead channel and set a score for how likely the lead is from this channel. the highest score is our estimate
    // this function is unaffected by duplicate from-headers because the duplicated scores will be applied to all LEAD_CHANNELS, thus negating the effects of duplicate from-headers
    // this function can handle most false positives (eg. A zumper lead where the tenant says 'kijiji') as each LEAD_CHANNEL is ranked against eachother. Thus the zumper score will be much higher than the kijiji score
    LEAD_CHANNELS().lead_channels.forEach((lead_channel) => {
      console.log(`---> Checking for ${lead_channel.channel_name}`)
      let current_score = 0
      // PART 1: By Email
      // score on `process.env.LEAD_CHANNELS[0].channel_email_domains`
      // current_score increases by 5 for each mention of a known `channel_email_domain`
      participants.from.forEach((from) => {
        lead_channel.channel_email_domains.forEach((ced) => {
          if (from.toLowerCase().indexOf(ced.toLowerCase()) > -1) {
            current_score += 5
          }
        })
      })
      // PART 2: By Hint Word
      // score on `process.env.LEAD_CHANNELS[0].channel_hints`
      // current_score increases by 1 for each mention of a hint word
      lead_channel.channel_hints.forEach((hint_word) => {
        let regex = new RegExp(hint_word, 'ig')
        let matches = extractedS3Email.textAsHtml.match(regex) || []
        if (matches && matches.length > 0) {
          current_score += matches.length
        }
      })
      // PART 3: By Hint Phrase
      // score on `process.env.LEAD_CHANNELS[0].channel_phrases`
      // current_score increases by 5 for each mention of a hint phrase
      lead_channel.channel_phrases.forEach((channel_phrase) => {
        let regex = new RegExp(channel_phrase, 'ig')
        let matches = extractedS3Email.textAsHtml.match(regex) || []
        if (matches && matches.length > 0) {
          current_score += (matches.length*5)
        }
      })
      // PART 4: Rank Against Estimate
      // we replace the estimated_channel only if this LEAD_CHANNEL's current_score is higher than estimated_channel.score
      console.log(`${lead_channel.channel_name} scored: ${current_score}`)
      if (current_score > estimated_channel.score) {
        estimated_channel = {
          channel_name: lead_channel.channel_name,
          score: current_score
        }
      }
    })
    console.log(`------ FINISHED ESTIMATING CHANNEL ------`)
    console.log(estimated_channel)
    res({
      title: 'determineLeadChannel',
      channel: estimated_channel
    })
  })
  return p
}
