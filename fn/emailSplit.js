const axios = require('axios')

const DEVELOPER_ACCESS_KEY = process.env.DEVELOPER_ACCESS_KEY
const headers = {
  headers: {
    Authorization: `Bearer ${DEVELOPER_ACCESS_KEY}`
  }
}

module.exports = function(event, context, callback) {
  console.log('==============> STARTED FROM THE BOTTOM')
  const params = JSON.parse(event.body)
  console.log(params)
  console.log(params.content)
  console.log(context)

  const TARGET_TEXT = preprocess(params.content)
  initDialogFlow()
    .then((data) => {
      console.log(data.data)
      return callDialogFlow(TARGET_TEXT)
    })
    .then((allResults) => {
      console.log('==============> NOW WE HERE')
      const response = {
        statusCode: 200,
        body: JSON.stringify(allResults),
      };
      callback(null, response);
    })
    .catch((err) => {
      console.log('======== ERROR OCCURRED - STILL AT THE BOTTOM ========')
      console.log(err)
      callback(null, err);
    })
}

const initDialogFlow = () => {
  const params = {
    'event': {
      'name': 'renthero-landlord-ai-init',
      'data': {
        'ad_id': 'PLACEHOLDER_AD_ID'
      }
    },
    'timezone':'America/New_York',
    'lang':'en',
    'sessionId': 'PLACEHOLDER_SESSION_ID',
  }
  return axios.post(`https://api.dialogflow.com/api/query?v=20150910`, params, headers)
}

const callDialogFlow = (texts) => {
  const p = new Promise((res, rej) => {
    const allTexts = texts.map((text) => {
      const params = {
        "contexts": [],
        "lang": "en",
        "query": text,
        "sessionId": 'PLACEHOLDER_SESSION_ID',
        "timezone": "America/New_York"
      }
      return axios.post(`https://api.dialogflow.com/api/query?v=20150910`, params, headers)
    })
    Promise.all(allTexts).then((data) => {
      // console.log(data)
      console.log('======== SUCCESSFULLY HIT DIALOGFLOW FOR ALL SENTENCES ========')
      const allResults = data.map(d => d.data)
      console.log(allResults)
      res(allResults)
    })
    .catch((err) => {
      console.log('======== ERROR OCCURRED ========')
      rej(err)
    })
  })
  return p
}

const preprocess = (string) => {
  // this function could be improved to actually split on . , ! ?
  var seperators = []
  var segments = []

  //stores index location of punctuation, so string can be seperated at those indices
  for (var i = 0; i < string.length; i++) {
    if (string[i] === '.' || string[i] === '!' || string[i] === '?') {
      seperators.push(i)
    }
  }

  //adds seperated strings to segments list object for the start, middle and end elements
  for (var n = 0; n < seperators.length; n++) {
    if ((n-1) < 0) {

      segments.push(string.slice(0,seperators[n]) + string[seperators[n]])
    }
    else if (n >= seperators.length) {
      segments.push(string.slice(seperators[n-1]+1,string.length) + string[len(seperators)+1])
    }
    else {
      segments.push(string.slice(seperators[n-1]+1,seperators[n]) + string[seperators[n]])
    }
  }

  return segments
}
