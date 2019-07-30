module.exports = {
  // Usage: const val = getNestedVal(myObj, 'a.b.c')
  getNestedVal (nestedObj, path) {
    return path
      .split('.')
      .reduce((obj, key) => {
        return (obj && obj[key] !== 'undefined') ? obj[key] : undefined
      }, nestedObj)
  },

  cloneAndMerge (...args) {
    const obj = Object.assign({}, ...args)
    Object.entries(obj).forEach(([prop, val]) => {
      if (val === null) {
        delete obj[prop]
      }
    })
    return obj
  }
}
