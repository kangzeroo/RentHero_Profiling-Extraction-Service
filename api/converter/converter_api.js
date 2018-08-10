const moment = require('moment')

module.exports.convertBase12WordToNumber = function(found) {
  // found = '1' || 'one'
  const mappings = [
    { number: 1, string: 'solo' },
    { number: 1, string: 'single' },
    { number: 1, string: 'one' },
    { number: 2, string: 'two' },
    { number: 3, string: 'three' },
    { number: 4, string: 'four' },
    { number: 5, string: 'five' },
    { number: 6, string: 'six' },
    { number: 7, string: 'seven' },
    { number: 8, string: 'eight' },
    { number: 9, string: 'nine' },
    { number: 10, string: 'ten' },
    { number: 11, string: 'eleven' },
    { number: 12, string: 'twelve' }
  ]
  const match = mappings.filter((m) => {
    return m.string === found.toLowerCase() || m.number === parseInt(found)
  })
  if (match && match[0] && match[0].number) {
    return match[0].number
  } else {
    return null
  }
}

module.exports.convertBase5BathToNumber = function(found) {
  // found = '1' || 'one'
  const mappings = [
    { number: 1.0, string: 'single' },
    { number: 1.0, string: 'one' },
    { number: 1.5, string: '1.5' },
    { number: 2.0, string: 'two' },
    { number: 2.5, string: '2.5' },
    { number: 3.0, string: 'three' },
    { number: 3.5, string: '3.5' },
    { number: 4.0, string: 'four' },
    { number: 4.5, string: '4.5' },
    { number: 5.0, string: 'five' },
    // ensuite is last because of the case where we have '3 ensuites'. we do not want to overwrite the 3 with 1
    { number: 1.0, string: 'ensuite' }
  ]
  const match = mappings.filter((m) => {
    return m.string === found.toLowerCase() || m.number === parseFloat(found)
  })
  if (match && match[0] && match[0].number) {
    return match[0].number
  } else {
    return null
  }
}

module.exports.convertBase100sPriceToNumber = function(found) {
  // found = '1' || 'one'
  const mappings = [
    { number: 1000, string: 'a thousand' },
    { number: 1000, string: 'one thousand' },
    { number: 1000, string: '1k' },
    { number: 1100, string: '1.1' },
    { number: 1200, string: '1.2' },
    { number: 1300, string: '1.3' },
    { number: 1400, string: '1.4' },
    { number: 1500, string: '1.5' },
    { number: 1600, string: '1.6' },
    { number: 1700, string: '1.7' },
    { number: 1800, string: '1.8' },
    { number: 1900, string: '1.9' },
    { number: 2000, string: 'two thousand' },
    { number: 2000, string: '2 thousand' },
    { number: 2000, string: '2k' },
    { number: 2100, string: '2.1' },
    { number: 2200, string: '2.2' },
    { number: 2300, string: '2.3' },
    { number: 2400, string: '2.4' },
    { number: 2500, string: '2.5' },
    { number: 2600, string: '2.6' },
    { number: 2700, string: '2.7' },
    { number: 2800, string: '2.8' },
    { number: 2900, string: '2.9' },
    { number: 3000, string: 'three thousand' },
    { number: 3000, string: '3 thousand' },
    { number: 3000, string: '3k' },
    { number: 3100, string: '3.1' },
    { number: 3200, string: '3.2' },
    { number: 3300, string: '3.3' },
    { number: 3400, string: '3.4' },
    { number: 3500, string: '3.5' },
    { number: 3600, string: '3.6' },
    { number: 3700, string: '3.7' },
    { number: 3800, string: '3.8' },
    { number: 3900, string: '3.9' },
    { number: 4000, string: 'four thousand' },
    { number: 4000, string: '4 thousand' },
    { number: 4000, string: '4k' },
    { number: 4000, string: '4 k' },
    { number: 4100, string: '4.1' },
    { number: 4200, string: '4.2' },
    { number: 4300, string: '4.3' },
    { number: 4400, string: '4.4' },
    { number: 4500, string: '4.5' },
    { number: 4600, string: '4.6' },
    { number: 4700, string: '4.7' },
    { number: 4800, string: '4.8' },
    { number: 4900, string: '4.9' },
    { number: 5000, string: 'five thousand' },
    { number: 5000, string: '5 thousand' },
    { number: 5000, string: '5k' },
    { number: 5000, string: '5 k' },
    { number: 5100, string: '5.1' },
    { number: 5200, string: '5.2' },
    { number: 5300, string: '5.3' },
    { number: 5400, string: '5.4' },
    { number: 5500, string: '5.5' },
    { number: 5600, string: '5.6' },
    { number: 5700, string: '5.7' },
    { number: 5800, string: '5.8' },
    { number: 5900, string: '5.9' },
    // we seperate out the hundreds last, in case we get `one thousand two hundred`
    { number: 300, string: 'three hundred' },
    { number: 400, string: 'four hundred' },
    { number: 500, string: 'five hundred' },
    { number: 600, string: 'six hundred' },
    { number: 700, string: 'seven hundred' },
    { number: 800, string: 'eight hundred' },
    { number: 900, string: 'nine hundred' }
  ]
  const allMatches = []
  const matches1 = mappings.filter((m) => {
    return m.string.replace(' ', '') === found.toLowerCase().replace(' ', '')
  }).forEach((m) => {
    allMatches.push(m.number)
  })
  if (parseInt(found)) {
    allMatches.push(parseInt(found))
  }
  console.log('------------')
  console.log(allMatches)
  if (allMatches && allMatches[0] && allMatches) {
    console.log('FOUND MATCH: ', allMatches)
    return allMatches
  } else {
    return []
  }
}


module.exports.convertLeaseLengthWordToNumber = function(found) {
  // found = '1' || 'one'
  const mappings = [
    { number: 2, string: 'two' },
    { number: 3, string: 'three' },
    { number: 4, string: 'four' },
    { number: 5, string: 'five' },
    { number: 6, string: 'six' },
    { number: 6, string: '6' },
    { number: 7, string: 'seven' },
    { number: 8, string: 'eight' },
    { number: 9, string: 'nine' },
    { number: 10, string: 'ten' },
    { number: 11, string: 'eleven' },
    { number: 12, string: 'twelve' },
    { number: 12, string: '12' },
    { number: 12, string: 'a year' },
    { number: 12, string: '1 year' },
    { number: 12, string: '1-year' },
    { number: 12, string: 'a year' },
    { number: 12, string: 'one year' },
    { number: 12, string: 'one-year' },
    { number: 24, string: '24' },
    { number: 24, string: '2 year' },
    { number: 24, string: '2-year' },
    { number: 24, string: 'two year' },
    { number: 24, string: 'two-year' },
  ]
  const match = mappings.filter((m) => {
    return m.string === found.toLowerCase() || m.number === parseInt(found)
  })
  if (match && match[0] && match[0].number) {
    return [match[0].number]
  } else {
    return []
  }
}


module.exports.convertMoveinTextToDate = function(found) {
  // found = '1' || 'one'
  // jan|january|janury|feb|febuary|february|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sept|september|septembre|oct|october|nov|november|dec|december
  const mappings = [
    { date: moment().month(moment().month()+1).startOf('month').toISOString(), string: 'next month' },
    { date: moment().month(0).startOf('month').toISOString(), string: 'jan' },
    { date: moment().month(0).startOf('month').toISOString(), string: 'january' },
    { date: moment().month(0).startOf('month').toISOString(), string: 'janury' },
    { date: moment().month(1).startOf('month').toISOString(), string: 'feb' },
    { date: moment().month(1).startOf('month').toISOString(), string: 'febuary' },
    { date: moment().month(1).startOf('month').toISOString(), string: 'february' },
    { date: moment().month(1).startOf('month').toISOString(), string: 'february' },
    { date: moment().month(2).startOf('month').toISOString(), string: 'mar' },
    { date: moment().month(2).startOf('month').toISOString(), string: 'march' },
    { date: moment().month(3).startOf('month').toISOString(), string: 'apr' },
    { date: moment().month(3).startOf('month').toISOString(), string: 'april' },
    { date: moment().month(4).startOf('month').toISOString(), string: 'may' },
    { date: moment().month(5).startOf('month').toISOString(), string: 'jun' },
    { date: moment().month(5).startOf('month').toISOString(), string: 'june' },
    { date: moment().month(6).startOf('month').toISOString(), string: 'jul' },
    { date: moment().month(6).startOf('month').toISOString(), string: 'july' },
    { date: moment().month(7).startOf('month').toISOString(), string: 'aug' },
    { date: moment().month(7).startOf('month').toISOString(), string: 'august' },
    { date: moment().month(8).startOf('month').toISOString(), string: 'sept' },
    { date: moment().month(8).startOf('month').toISOString(), string: 'september' },
    { date: moment().month(8).startOf('month').toISOString(), string: 'septembre' },
    { date: moment().month(9).startOf('month').toISOString(), string: 'oct' },
    { date: moment().month(9).startOf('month').toISOString(), string: 'october' },
    { date: moment().month(10).startOf('month').toISOString(), string: 'nov' },
    { date: moment().month(10).startOf('month').toISOString(), string: 'november' },
    { date: moment().month(11).startOf('month').toISOString(), string: 'dec' },
    { date: moment().month(11).startOf('month').toISOString(), string: 'december' }
  ]
  const match = mappings.filter((m) => {
    return m.string === found.toLowerCase()
  })
  if (match && match[0] && match[0].date) {
    return [match[0].date]
  } else {
    return []
  }
}

module.exports.getMaxAndMin = function(arrayOfNumbers) {
  let summary = {
    min: 999999999999999999999999999999999999999,
    max: 0
  }
  arrayOfNumbers.forEach((num) => {
    if (num < summary.min) {
      summary.min = num
    }
    if (num > summary.max) {
      summary.max = num
    }
  })
  return summary
}
