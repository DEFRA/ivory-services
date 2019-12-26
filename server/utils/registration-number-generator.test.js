const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const registrationNumber = require('./registration-number-generator')

lab.experiment(TestHelper.getFile(__filename), () => {
  lab.experiment('registrationNumber', () => {
    lab.test('bad should be true', async () => {
      Code.expect(await registrationNumber.bad('1ARSEMX3')).to.equal(true)
    })

    lab.test('bad should be false', async () => {
      Code.expect(await registrationNumber.bad('1FTREEX3')).to.equal(false)
    })

    lab.test('includesAtLeastOneOf passes for charaters', async () => {
      const id = '12345A78'.split('')
      Code.expect(await registrationNumber.includesAtLeastOneOf(id, 'ACDEFGHJ'.split(''))).to.equal(true)
    })

    lab.test('includesAtLeastOneOf passes for numbers', async () => {
      const id = '12345A78'.split('')
      Code.expect(await registrationNumber.includesAtLeastOneOf(id, '234679'.split(''))).to.equal(true)
    })

    lab.test('get', async () => {
      const id = await registrationNumber.random()
      console.log(id)
      Code.expect(id.length).to.equal(8)
    })
  })
})
