const requireAll = require('require-all')

// Requires all the "*.dal.js" files in the current folder
// eg. when the current directory contains files /registration.dal.js and /person.dal.js they will be exported as an object of classes { Registration, Person }
module.exports = requireAll({
  dirname: __dirname,
  filter: /^(.+).dal\.js$/,
  map: (name) => name.charAt(0).toUpperCase() + name.slice(1)
})
