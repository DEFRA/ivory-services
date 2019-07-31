const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const TestHelper = require('../../test-helper')
const utils = require('./utils')

lab.experiment(TestHelper.getFile(__filename), () => {
  let sandbox

  lab.beforeEach(() => {
    // Stub methods
    sandbox = sinon.createSandbox()
    TestHelper.stubCommon(sandbox)
  })

  lab.afterEach(async () => {
    // Restore the sandbox to make sure the stubs are removed correctly
    sandbox.restore()
  })

  lab.experiment('getNestedVal', () => {
    lab.test('undefined is returned without crashing when path to property is not complete', async () => {
      const obj = {}
      Code.expect(utils.getNestedVal(obj, 'path.does.not.exist')).to.equal(undefined)
    })

    lab.test('value is returned when path to property is complete', async () => {
      const obj = { path: { does: { exist: true } } }
      Code.expect(utils.getNestedVal(obj, 'path.does.exist')).to.equal(true)
    })
  })

  lab.experiment('cloneAndMerge', () => {
    lab.test('properties are deleted when it is overridden with null', async () => {
      const obj1 = { a: 'details', b: { c: { d: 'deep details' } }, e: 'more details' }
      const obj1String = JSON.stringify(obj1)
      const obj2 = { e: null, f: 'other details', g: { h: 'even more deep details' } }
      const obj2String = JSON.stringify(obj2)
      const obj3 = utils.cloneAndMerge(obj1, obj2)

      // Make sure neither object has been mutated
      Code.expect(JSON.stringify(obj1)).to.equal(obj1String)
      Code.expect(JSON.stringify(obj2)).to.equal(obj2String)

      // Now make sure the merge happened correctly with the e property deleted
      Code.expect(JSON.stringify(obj3)).to.equal('{"a":"details","b":{"c":{"d":"deep details"}},"f":"other details","g":{"h":"even more deep details"}}')
    })
  })
})
