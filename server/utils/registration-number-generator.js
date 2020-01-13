const Filter = require('bad-words')
const filter = new Filter()

module.exports = {
  get characters () {
    // consonant alpha characters without those that could be confused with a numeral
    return 'CDFGHJKMNPRTVWXYZ'.split('')
  },

  get numbers () {
    // numeric characters without those that could be confused with an alpha character
    return '23679'.split('')
  },

  get sequence () {
    return [...this.characters, ...this.numbers]
  },

  async get () {
    const number = `${Math.floor(Math.random() * 999999)}`.padStart(6, '0')
    return `IVR${number}`
  },

  includesAtLeastOneOf (id, set) {
    return id.split('').some((char) => set.includes(char))
  },

  // Make sure no sequence of characters contain profanity
  isClean: function (id) {
    for (let pos = 0; pos < id.length; pos++) {
      for (let len = 0; len < id.length; len++) {
        const result = filter.clean(id.substr(pos, len))
        if (result.includes('*')) {
          return false
        }
      }
    }
    return true
  },

  isAllowed: function (id) {
    return this.includesAtLeastOneOf(id, this.characters) && this.includesAtLeastOneOf(id, this.numbers) && this.isClean(id)
  },

  get randomCharacter () {
    const chars = this.sequence
    return (chars[Math.floor(Math.random() * (chars.length - 1))])
  },

  random: async function () {
    let id
    let passes
    // Build array of 8 random alphanumerics
    do {
      for (id = []; id.length < 8; id.push(this.randomCharacter)) {}
      id = id.join('')
      passes = this.isAllowed(id)
    }
    // Make sure that there is at least one number and at least one character
    while (!passes)
    // Return the 8 character string
    return id
  }
}
