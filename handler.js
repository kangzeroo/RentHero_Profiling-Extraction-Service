'use strict';
const parseEmail = require('./fn/parseEmail')
const profilingExtractor = require('./fn/profilingExtractor')

module.exports.parseEmail = (event, context, callback) => {
  parseEmail(event, context, callback)
};

module.exports.profilingExtractor = (event, context, callback) => {
  profilingExtractor(event, context, callback)
}
