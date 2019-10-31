const requireAll = require('require-all')
const camelCase = require('lodash.camelcase')

// Requires all the "*.model.js" files in the current folder
// eg. when the models directory contains files /registration.model.js and /person.model.js they will be exported as an object of classes { Registration, Person }
const models = requireAll({
  dirname: __dirname,
  filter: /^(.+).model\.js$/,
  map: (name) => name.charAt(0).toUpperCase() + camelCase(name.slice(1))
})

module.exports = models
