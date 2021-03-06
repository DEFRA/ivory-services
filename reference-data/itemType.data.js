module.exports = {
  choices: [
    {
      label: 'Musical instrument made before 1975 with less than 20% ivory',
      shortName: 'musical-pre-1975-less-than-20-percent',
      hint: 'For example piano, violin bow, flute',
      ageExemptionDeclaration: 'the item was made before 1975',
      volumeExemptionDeclaration: 'the item has less than 20% ivory',
      ageExemptionLabel: 'Pre-1975',
      volumeExemptionLabel: 'Less than 20% ivory',
      display: 'Musical instrument'
    },
    {
      label: 'Item made before 1947 with less than 10% ivory',
      shortName: 'pre-1947-less-than-10-percent',
      ageExemptionDeclaration: 'the item was made before 1947',
      volumeExemptionDeclaration: 'the item has less than 10% ivory',
      ageExemptionLabel: 'Pre-1947',
      volumeExemptionLabel: 'Less than 10% ivory',
      display: 'Pre-1947 less than 10%'
    },
    {
      label: 'Portrait miniature made before 1918',
      shortName: 'portrait-miniature-pre-1918',
      ageExemptionDeclaration: 'the item was made before 1918',
      volumeExemptionDeclaration: 'the portrait miniature is less than 320 centimetres square',
      ageExemptionLabel: 'Pre-1918',
      volumeExemptionLabel: 'Less than 320 centimetres square',
      display: 'Portrait miniature'
    },
    {
      label: 'Item to be acquired by a qualifying museum',
      shortName: 'apply-to-register-to-sell-an-item-to-a-museum'
    },
    {
      label: 'Item of outstanding artistic, cultural or historical value made before 1918',
      shortName: 'apply-for-an-rmi-certificate'
    }
  ]
}
