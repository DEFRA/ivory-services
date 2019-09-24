module.exports = {
  choices: [
    {
      label: 'Musical instrument made before 1975 with less than 20% ivory',
      shortName: 'musical-pre-1975-less-than-20-percent',
      hint: 'For example piano, violin bow, flute',
      ageExemptionDeclaration: 'the item was made before 1975',
      volumeExemptionDeclaration: 'the item has less than 20% ivory'
    },
    {
      label: 'Item made before 1947 with less than 10% ivory',
      shortName: 'pre-1947-less-than-10-percent',
      ageExemptionDeclaration: 'the item was made before 1947',
      volumeExemptionDeclaration: 'the item has less than 10% ivory'
    },
    {
      label: 'Portrait miniature made before 1918',
      shortName: 'portrait-miniature-pre-1918',
      ageExemptionDeclaration: 'the item was made before 1918',
      volumeExemptionDeclaration: 'the portrait miniature is less than 320cm²'
    },
    {
      label: 'Item you\'re selling or hiring to an approved museum',
      shortName: 'sell-or-hire-to-museum'
    }
  ]
}
