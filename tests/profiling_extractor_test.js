const Profiling = require('../api/profiling/profiling_api')
const BasicAttributes = require('../api/profiling/attributes/basic_attributes')
const moment = require('moment')

// run with:
// $ node tests/profiling_extractor_test.js


// TO EXTRACT BEDROOMS
const text = `
Hello Khan,

My name is Michelle and I am one of Sherry's roommate.  Attached are the documents you asked for as well as a reference letter and recent pay stub, they are my brother's information(would be my cosigner).  If you require anything else feel free to let me know!

We are a group of 4 University of Toronto undergraduates studying Computer Science/Math and Psychology.  Our group met during first year as we all lived in the same residence so we are already acquainted and used to living together.  We are described as very neat and respectful individuals both for our space and towards other people.
We would like to sign asap.
Our situation is such: we are a group of 4 females but one of our friends is a little indecisive about whether or not she will be living downtown with us so units with only 3 bedrooms or a liveable 2+1 would be lovely to view as well.  Our budget for a 2+1 would be around $2000-$3000, 3 bedroom would be around $3000-$3500 and 4 bedroom would be around the $4000 mark.
looking to move in december
Ideally a year long lease.
Thank you so much for your time and I look forward to hearing back from you soon.
Would love to take a look this week if possible?

Best,

Michelle Luo
`

// const lines = Profiling.split_text(text)
// const desiredBeds = BasicAttributes.profile_bedrooms(lines)
// // desiredBeds = { min, max }

// // TO EXTRACT BATHROOMS
// const text = `
//   Hey there I was wondering if there were any 3 to 4 bedroom units left?
//   Ideally with 2.5 or 3 ensuite seperate bathrooms.
//   I was hoping to get a look sometime around 4 today. If thats ok with you
// `
//
// const lines = Profiling.split_text(text)
// const desiredBaths = BasicAttributes.profile_bathrooms(lines)
// // desiredBaths = { min, max }

// // TO EXTRACT BUDGET
// const text = `
//   Hey there I was wondering if there were any 3 to 4 bedroom units left?
//   Ideally with 2.5 or 3 ensuite seperate bathrooms. Around $550 to $1.5k
//   I was hoping to get a look sometime around 4 today. If thats ok with you.
//   Ideally less that 2 k
// `
//
// const lines = Profiling.split_text(text)
// const desiredBudget = BasicAttributes.profile_budget(lines)
// // desiredBudget = { min, max }


// // TO EXTRACT LOCATION
// const text = ``
//
// const lines = Profiling.split_text(text)
// const desiredLocation = BasicAttributes.profile_location(lines)
// // desiredLocation = ''


// // TO EXTRACT URGENCY
// const text = ``
//
// const lines = Profiling.split_text(text)
// const desiredUrgency = BasicAttributes.profile_urgency(lines)
// // desiredUrgency = ''


// // TO EXTRACT LEASE LENGTH
// const text = ``
//
// const lines = Profiling.split_text(text)
// const desiredLength = BasicAttributes.profile_lease_length(lines)
// // desiredLength = { min, max }


// // TO EXTRACT MOVEIN DATE
// const text = ``
//
const lines = Profiling.split_text(text)
const desiredMovein = BasicAttributes.profile_movein(lines)
// // desiredMovein = ''


// // TO EXTRACT TOUR READINESS
// const text = ``
//
// const lines = Profiling.split_text(text)
// const desiredTour = BasicAttributes.profile_tour_readiness(lines)
// // desiredTour = true || false
