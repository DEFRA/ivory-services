const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const TestHelper = require('../../test-helper')
const registrationNumber = require('./registration-number-generator')

lab.experiment(TestHelper.getFile(__filename), () => {
  lab.experiment('registrationNumber', () => {
    lab.test('bad should be true', async () => {
      Code.expect(await registrationNumber.isClean('1ARSEMX3')).to.equal(false)
    })

    lab.test('bad should be false', async () => {
      Code.expect(await registrationNumber.isClean('1FTREEX3')).to.equal(true)
    })

    lab.test('includesAtLeastOneOf passes for charaters', async () => {
      Code.expect(await registrationNumber.includesAtLeastOneOf('12345A78', 'ACDEFGHJ'.split(''))).to.equal(true)
    })

    lab.test('includesAtLeastOneOf passes for numbers', async () => {
      Code.expect(await registrationNumber.includesAtLeastOneOf('12345A78', '234679'.split(''))).to.equal(true)
    })

    lab.test('isAllowed passes when correct', async () => {
      Code.expect(await registrationNumber.isAllowed('12345A78')).to.equal(true)
    })

    lab.test('isAllowed fails when not allowed', async () => {
      Code.expect(await registrationNumber.isAllowed('1ARSEMX3')).to.equal(false)
      Code.expect(await registrationNumber.isAllowed('12345678')).to.equal(false)
      Code.expect(await registrationNumber.isAllowed('ABCDEFGHI')).to.equal(false)
      Code.expect(await registrationNumber.isAllowed('1FTREEX3')).to.equal(true)
    })

    lab.test('random', async () => {
      for (let i = 0; i < 20; i++) {
        const id = await registrationNumber.random()
        Code.expect(await registrationNumber.isClean(id)).to.equal(true)
        Code.expect(await registrationNumber.isAllowed(id)).to.equal(true)
        Code.expect(id.length).to.equal(8)
      }
    })
  })
})
