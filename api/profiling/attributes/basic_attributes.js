const Converter = require('../../converter/converter_api')
/*
  HOW THE PARSER WORKS
  1. We break down a lead's message line by line (by \n character or . , ;)
  2. Prepare a list of classifications (line about bedrooms, pricing, movein date...etc)
  2. Per each classification, parse each line sequentially to get a list of lines matching the classification
  3. Per classification run a custom data extraction job. Parse each line with methods shaped by how that classification might be said (eg. classifyBedrooms => '4 rooms', 'group of 3', 'bachelor')
  4. Per classification, return back object of extracted data
*/
// REMEMBER, A SCORE OF 0 IS BETTER THAN 1


// we can make this smarter by splitting up the range of people into seperate regex searches
module.exports.profile_bedrooms = function(lines) {
  /*
    SAMPLE
    Hello i have a group of 4 interested
    4 people interested in the 3 bedrooms bed unit
    availability
    3-4 people a group of 2 to 4 7 guys
    we are 4 girls
    or 5 rooms  group size of 3
    4 charming guys
  */
  // we have an extra '\' to escape '\'
  // { id: 0, pattern: '\\d{1}', sample: '' }
  const known_patterns = [
    // (\d?(one|two|three|four|five|six|seven|eight|nine|ten)?\s?-?(to)?\s?\d?\s?(one|two|three|four|five|six|seven|eight|nine|ten)?)\w*\s?(people|student|bed|room|interest|roommate|girl|guy|women|men|international)
    { id: 1, pattern: '(\\d?(one|two|three|four|five|six|seven|eight|nine|ten)?\\s?-?(to)?\\s?\\d?\\s?(one|two|three|four|five|six|seven|eight|nine|ten)?)\\w*\\s?(people|student|bed|room|interest|roommate|girl|guy|women|men|international)', sample: '' },
    // ((group\sof)|(group\ssize\sof\s)){1}(\d|(one|two|three|four|five|six|seven|eight|nine|ten))?\s?((\d?)|(one|two|three|four|five|six|seven|eight|nine|ten))?\s?-?(to)?\s?((\d?)|one|two|three|four|five|six|seven|eight|nine|ten)?
    { id: 0, pattern: '((group\\sof)|(group\\ssize\\sof\\s)){1}(\\d|(one|two|three|four|five|six|seven|eight|nine|ten))?\\s?((\\d?)|(one|two|three|four|five|six|seven|eight|nine|ten))?\\s?-?(to)?\\s?((\\d?)|one|two|three|four|five|six|seven|eight|nine|ten)?', sample: '' },
    // (group|people|guy|girl|women|men|individual|interested|bed|room)
    { id: 3, pattern: '(group|people|guy|girl|women|men|individual|interested|bed|room)', sample: ''},
    // (group of)\s\d\d?
    { id: 4, pattern: '(group of)\\s\\d\\d?', sample: '' }
  ]
  const metaLines = lines.map((line) => {
    const matches = known_patterns.filter((kn) => {
      const re = new RegExp(kn.pattern, 'ig')
      return line.match(re)
    })
    return {
      score: matches.length > 0 ? 0 : 1,
      line: line
    }
  })
  console.log('----------- META LINES -----------')
  console.log(metaLines)
  console.log('----------- FILTERED LINES -----------')
  console.log(metaLines.filter(l => l.score === 0))
  // metaLines = [ { score, line }, ... ]
  const arrayOfArrays = metaLines.filter((line) => {
    // eliminiate those with a low match score
    return line.score < 0.3
  }).map((line) => {
    // apply insight #1: there should be a written number or word telling us the quantity of beds required
    const insight1 = {
      desc: 'Finds a number of bedrooms or people',
      pattern: '(\\d{1}\\d?)|(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)'
    }
    const re = new RegExp(insight1.pattern, 'ig')
    // returns an array of matches
    return line.line.match(re)
  })
  // combine our arrays into one
  const arrayOfAllNumberMatches = []
  arrayOfArrays.filter(a => a).forEach((arr) => {
    arr.forEach((match) => {
      arrayOfAllNumberMatches.push(Converter.convertBase12WordToNumber(match))
    })
  })
  console.log('----------- ALL NUMBER MATCHES -----------')
  console.log(arrayOfAllNumberMatches)
  // filter out the empty numbers and get max/min
  const summary = Converter.getMaxAndMin(arrayOfAllNumberMatches.filter(n => n))

  console.log('----------- SUMMARY -----------')
  const summ = {
    PROFILE_TYPE: 'DESIRED_BEDS',
    MIN_BEDS: summary.min,
    MAX_BEDS: summary.max,
    IDEAL_BEDS: null
  }
  console.log(summ)
  return summ
}

module.exports.profile_bathrooms = function(lines) {
  /*
    SAMPLE
    4 bathroom unit with 3 washrooms or ensuite bath  5 ensuite wash ensuite partial bathroom
    1 half baths with 3 spacious bathrooms newly designed\
	  1.5 bathrooms  and a gorgeous bathroom 3 beautiful modern bathrooms and 2 modern bathrooms
  */
  const known_patterns = [
    // ((\d?\.?\d?)|one|two|three|four|five|six|seven|eight|nine|ten|a){1}\s?\w*(ensuite|private|half)?\s?(bath|wash)
    { id: 1, pattern: '((\\d?\\.?\\d?)|one|two|three|four|five|six|seven|eight|nine|ten|a){1}\\s?\\w*(ensuite|private|half)?\\s?(bath|wash)', sample: '' },
    // (bath|wash)
    { id: 2, pattern: '(bath|wash)', sample: ''}
  ]
  const metaLines = lines.map((line) => {
    const matches = known_patterns.filter((kn) => {
      const re = new RegExp(kn.pattern, 'ig')
      return line.match(re)
    })
    return {
      score: matches.length > 0 ? 0 : 1,
      line: line
    }
  })
  console.log('----------- META LINES -----------')
  console.log(metaLines)
  console.log('----------- FILTERED LINES -----------')
  console.log(metaLines.filter(l => l.score === 0))
  // metaLines = [ { score, line }, ... ]
  const arrayOfArrays = metaLines.filter((line) => {
    // eliminiate those with a low match score
    return line.score < 0.3
  }).map((line) => {
    // apply insight #1: there should be a written number or word telling us the quantity of baths required
    const insight1 = {
      desc: 'Finds a number of bathrooms including half baths',
      pattern: '(\\d{1}\\.?\\d?)|(one|two|three|four|five)'
    }
    const re = new RegExp(insight1.pattern, 'ig')
    // returns an array of matches
    return line.line.match(re)
  })
  // combine our arrays into one
  const arrayOfAllNumberMatches = []
  arrayOfArrays.forEach((arr) => {
    arr.forEach((match) => {
      arrayOfAllNumberMatches.push(Converter.convertBase5BathToNumber(match))
    })
  })
  console.log('----------- ALL NUMBER MATCHES -----------')
  console.log(arrayOfAllNumberMatches)
  // filter out the empty numbers and get max/min
  const summary = Converter.getMaxAndMin(arrayOfAllNumberMatches.filter(n => n))

  console.log('----------- SUMMARY -----------')
  const summ = {
    PROFILE_TYPE: 'DESIRED_BATHS',
    MIN_BATHS: summary.min,
    MAX_BATHS: summary.max,
    IDEAL_BATHS: null,
    MIN_ENSUITES: null,
    MAX_ENSUITES: null,
    IDEAL_ENSUITES: null,
  }
  console.log(summ)
  return summ
}

module.exports.profile_budget = function(lines) {
  /*
    SAMPLE
    somewhere between $600 and $700
    between 400 and 500
    price between 200 and $500
    the rent is $300 to $700
    $600 per month
    budget of
  */
  // we have an extra '\' to escape '\'
  // { id: 0, pattern: '\\d{1}', sample: '' }
  const known_patterns = [
    // (budget|rent|price|\$)
    { id: 1, pattern: '(budget|rent|price|\\$)', sample: '' }
  ]
  const metaLines = lines.map((line) => {
    const matches = known_patterns.filter((kn) => {
      const re = new RegExp(kn.pattern, 'ig')
      return line.match(re)
    })
    return {
      score: matches.length > 0 ? 0 : 1,
      line: line
    }
  })
  console.log('----------- META LINES -----------')
  console.log(metaLines)
  console.log('----------- FILTERED LINES -----------')
  console.log(metaLines.filter(l => l.score === 0))
  // metaLines = [ { score, line }, ... ]
  const arrayOfArrays = metaLines.filter((line) => {
    // eliminiate those with a low match score
    return line.score < 0.3
  }).map((line) => {
    // apply insight #1: there should be an expressed price range
    const insight1 = {
      desc: 'Find a price range within a realistic rental price, aka above $251/month',
      pattern: '(\\d{1}\\s?k)|((a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen)?\\s(thousand|hundred))|((\\d+\\.?\\d)?)'
    }
    const re = new RegExp(insight1.pattern, 'ig')
    // returns an array of matches
    return line.line.match(re)
  })
  console.log(arrayOfArrays)
  // combine our arrays into one
  const arrayOfAllNumberMatches = []
  arrayOfArrays.forEach((arr) => {
    arr.forEach((match) => {
      Converter.convertBase100sPriceToNumber(match).forEach((n) => {
        arrayOfAllNumberMatches.push(n)
      })
    })
  })
  console.log('----------- ALL NUMBER MATCHES -----------')
  console.log(arrayOfAllNumberMatches)
  // filter out the empty numbers and get max/min
  const summary = Converter.getMaxAndMin(arrayOfAllNumberMatches.filter(n => n > 251))

  console.log('----------- SUMMARY -----------')
  const summ = {
    PROFILE_TYPE: 'DESIRED_BUDGET',
    MIN_UNIT_PRICE: summary.min,
    MAX_UNIT_PRICE: summary.max,
    IDEAL_UNIT_PRICE: null,
    MIN_ROOM_PRICE: null,
    MAX_ROOM_PRICE: null,
    IDEAL_ROOM_PRICE: null,
  }
  console.log(summ)
  return summ
}

module.exports.profile_location = function(lines) {
  /*
    SAMPLE
    looking for a place near dundas st
    around jane st
    close to fairview at the corner of jane and finch
    neighboring the neighborhood of
    at the intersection of
    corner of fairview and buttoncourt
    walking distance from
    drive from

  */
  // we have an extra '\' to escape '\'
  // { id: 0, pattern: '\\d{1}', sample: '' }
  const known_patterns = [
    // (budget|rent|price|\$)
    { id: 1, pattern: '(place|near|around|close to|walking|distance|proximity|neighbor|downtown|district|intersection|corner of)', sample: '' }
  ]
  const metaLines = lines.map((line) => {
    const matches = known_patterns.filter((kn) => {
      const re = new RegExp(kn.pattern, 'ig')
      return line.match(re)
    })
    return {
      score: matches.length > 0 ? 0 : 1,
      line: line
    }
  })
  console.log('----------- META LINES -----------')
  console.log(metaLines)
  console.log('----------- FILTERED LINES -----------')
  console.log(metaLines.filter(l => l.score === 0))
  return metaLines.filter(l => l.score === 0)[0].line || ''
}

module.exports.profile_urgency = function(lines) {
  /*
    SAMPLE
    looking to sign a place asap or as soon as possible
    ready to sign
    ready to rent
    ready to proceed
    urgently want to take a tour
  */
  // we have an extra '\' to escape '\'
  // { id: 0, pattern: '\\d{1}', sample: '' }
  const known_patterns = [
    // (asap|ready to rent|sign|proceed)?(as soon as possible)?
    { id: 1, pattern: '((asap|ready to rent|proceed)+)|((as soon as possible)+)', sample: '' }
  ]
  const metaLines = lines.map((line) => {
    const matches = known_patterns.filter((kn) => {
      const re = new RegExp(kn.pattern, 'ig')
      return line.match(re)
    })
    return {
      score: matches.length > 0 ? 0 : 1,
      line: line
    }
  })
  console.log('----------- META LINES -----------')
  console.log(metaLines)
  console.log('----------- FILTERED LINES -----------')
  console.log(metaLines.filter(l => l.score === 0))
  return metaLines.filter(l => l.score === 0)[0].line || ''
}

module.exports.profile_lease_length = function(lines) {
  /*
    SAMPLE
    1 year lease  300 month
    months lease
    12-month lease length
    contract for 12 years
    minimum lease of 12 months
  */
  // we have an extra '\' to escape '\'
  // { id: 0, pattern: '\\d{1}', sample: '' }
  const known_patterns = [
    // (((\d{1})|(\d{2}))|(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|continous)){1}(\s|\-)?(month|year)?\s?(lease)?
    { id: 1, pattern: '(((\\d{1})|(\\d{2}))|(a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|continous)){1}(\\s|\\-)?(month|year)+\\s?(lease)?', sample: '' }
  ]
  const metaLines = lines.map((line) => {
    const matches = known_patterns.filter((kn) => {
      const re = new RegExp(kn.pattern, 'ig')
      return line.match(re)
    })
    return {
      score: matches.length > 0 ? 0 : 1,
      line: line
    }
  })
  console.log('----------- META LINES -----------')
  console.log(metaLines)
  console.log('----------- FILTERED LINES -----------')
  console.log(metaLines.filter(l => l.score === 0))
  const arrayOfArrays = metaLines.filter((line) => {
    // eliminiate those with a low match score
    return line.score < 0.3
  }).map((line) => {
    // apply insight #1: there should be an expressed price range
    const insight1 = {
      desc: 'Find a lease length within an expected rental period',
      pattern: '((\\d{1}\\d?)|(((a)|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)?)){1}(\\s|-)(year|month){1}'
    }
    const re = new RegExp(insight1.pattern, 'ig')
    // returns an array of matches
    return line.line.match(re)
  })
  console.log(arrayOfArrays)
  // combine our arrays into one
  const arrayOfAllNumberMatches = []
  arrayOfArrays.forEach((arr) => {
    arr.forEach((match) => {
      Converter.convertLeaseLengthWordToNumber(match).forEach((n) => {
        arrayOfAllNumberMatches.push(n)
      })
    })
  })
  console.log('----------- ALL NUMBER MATCHES -----------')
  console.log(arrayOfAllNumberMatches)
  // filter out the empty numbers and get max/min
  const summary = Converter.getMaxAndMin(arrayOfAllNumberMatches)

  console.log('----------- SUMMARY -----------')
  const summ = {
    PROFILE_TYPE: 'DESIRED_LEASE_LENGTH',
    MIN_LENGTH: summary.min,
    MAX_LENGTH: summary.max,
    IDEAL_LENGTH: null,
  }
  console.log(summ)
  return summ
}

module.exports.profile_movein = function(lines) {
  /*
    SAMPLE
    looking to move in or move-in September
  */
  // we have an extra '\' to escape '\'
  // { id: 0, pattern: '\\d{1}', sample: '' }
  const known_patterns = [
    // (move in|move-in)
    { id: 1, pattern: '(move in|move-in)', sample: '' }
  ]
  const metaLines = lines.map((line) => {
    const matches = known_patterns.filter((kn) => {
      const re = new RegExp(kn.pattern, 'ig')
      return line.match(re)
    })
    return {
      score: matches.length > 0 ? 0 : 1,
      line: line
    }
  })
  console.log('----------- META LINES -----------')
  console.log(metaLines)
  console.log('----------- FILTERED LINES -----------')
  console.log(metaLines.filter(l => l.score === 0))
  const arrayOfArrays = metaLines.filter((line) => {
    // eliminiate those with a low match score
    return line.score < 0.3
  }).map((line) => {
    // apply insight #1: there should be an expressed price range
    const insight1 = {
      desc: 'Find a move in date within a realistic time period',
      pattern: '((next|couple){1}\\s(month){1}\\s?)|(jan|january|janury|feb|febuary|february|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sept|september|septembre|oct|october|nov|november|dec|december){1}'
    }
    const re = new RegExp(insight1.pattern, 'ig')
    // returns an array of matches
    return line.line.match(re)
  })
  console.log(arrayOfArrays)
  // combine our arrays into one
  const arrayOfAllDateMatches = []
  arrayOfArrays.forEach((arr) => {
    arr.forEach((match) => {
      Converter.convertMoveinTextToDate(match).forEach((n) => {
        arrayOfAllDateMatches.push(n)
      })
    })
  })
  console.log('----------- ALL DATE MATCHES -----------')
  console.log(arrayOfAllDateMatches[0])
  const summ = {
    PROFILE_TYPE: 'DESIRED_MOVEIN',
    MIN_MOVEIN: null,
    MAX_MOVEIN: null,
    IDEAL_MOVEIN: arrayOfAllDateMatches[0] || null
  }
  console.log(summ)
  return summ
}

module.exports.profile_tour_readiness = function(lines) {
  /*
    SAMPLE
    i am ready to take a tour and move in
    when can i visit the property
    can i see it
    can we check out the proeprty
    can we come look at the place
    when is the open house
  */
  // we have an extra '\' to escape '\'
  // { id: 0, pattern: '\\d{1}', sample: '' }
  const known_patterns = [
    // (tour|check|open house|visit|see)
    { id: 1, pattern: '(tour|check|open house|visit|see|take a look)', sample: '' }
  ]
  const metaLines = lines.map((line) => {
    const matches = known_patterns.filter((kn) => {
      const re = new RegExp(kn.pattern, 'ig')
      return line.match(re)
    })
    return {
      score: matches.length > 0 ? 0 : 1,
      line: line
    }
  })
  console.log('----------- META LINES -----------')
  console.log(metaLines)
  console.log('----------- FILTERED LINES -----------')
  console.log(metaLines.filter(l => l.score === 0))
  return metaLines.filter(l => l.score === 0).length > 0
}
