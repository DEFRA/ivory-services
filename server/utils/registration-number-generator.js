const Filter = require('bad-words')
const filter = new Filter()

module.exports = {
  get characters () {
    return 'ACDEFGHJKMNPRTUVWXYZ'.split('')
  },

  get numbers () {
    return '234679'.split('')
  },

  get sequence () {
    return [...this.characters, ...this.numbers]
  },

  async get () {
    const number = `${Math.floor(Math.random() * 999999)}`.padStart(6, '0')
    return `IVR${number}`
  },

  includesAtLeastOneOf (id, set) {
    return id.some((char) => set.includes(char))
  },

  get randomCharacter () {
    const chars = this.sequence
    return (chars[Math.floor(Math.random() * (chars.length - 1))])
  },

  random: async function () {
    let id
    // Build array of 8 random alphanumerics
    do { for (id = []; id.length < 8; id.push(this.randomCharacter)) {} }
    // Make sure that there is at least one number and at least one character
    while (!this.includesAtLeastOneOf(id, this.characters) && !this.includesAtLeastOneOf(id, this.numbers) && !this.bad(id.join('')))
    // Return the 8 character string
    return id.join('')
  },

  // Make sure no sequence of characters contain profanity
  bad: function (id) {
    for (let pos = 0; pos < id.length; pos++) {
      for (let len = 0; len < id.length; len++) {
        const result = filter.clean(id.substr(pos, len))
        if (result.includes('*')) {
          return true
        }
      }
    }
    return false
  }
}
