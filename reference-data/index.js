const requireAll = require('require-all')

// Requires all the "*.data.js" files in the current folder
// eg. when the models directory contains files /registration.model.js and /person.model.js they will be exported as an object of classes { Registration, Person }
module.exports = requireAll({
  dirname: __dirname,
  filter: /^(.+).\.data\.js$/
})
