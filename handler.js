'use strict';
<<<<<<< HEAD
const parseEmail = require('./fn/parseEmail')
const profilingExtractor = require('./fn/profilingExtractor')
=======
const hello = require('./fn/hello')
const emailSplit = require('./fn/emailSplit')
>>>>>>> parent of 776f095... updated boilerplate

module.exports.parseEmail = (event, context, callback) => {
  parseEmail(event, context, callback)
};

<<<<<<< HEAD
module.exports.profilingExtractor = (event, context, callback) => {
  profilingExtractor(event, context, callback)
=======
module.exports.emailSplit = (event, context, callback) => {
  emailSplit(event, context, callback)
>>>>>>> parent of 776f095... updated boilerplate
}
