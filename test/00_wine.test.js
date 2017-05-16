const chai = require('chai')
const assert = chai.assert
const { oneToMany, belongsTo } = require('../src/00_wine')

describe('00 Wine', () => {
  let countries, wines
  beforeEach(() => {
    countries = [
      { id: 1, name: 'USA' },
      { id: 2, name: 'Chile' },
      { id: 3, name: 'South Africa' },
      { id: 4, name: 'New Zealand' }
    ]

    wines = [
      { id: 1, name: 'Restless Earth', country_id: 1 },
      { id: 2, name: 'Objet D\'Art', country_id: 1 },
      { id: 3, name: 'To Be Honest', country_id: 1 },
      { id: 4, name: 'Alma Libre', country_id: 2 },
      { id: 5, name: 'Cape Route', country_id: 3 },
      { id: 6, name: 'Outer Sounds', country_id: 4 },
    ]
  })

  describe('#oneToMany', () => {
    let result
    beforeEach(() => {
      result = oneToMany(wines, countries, 'wines', 'country_id')
    })

    it('Returns an array which has a length equal to the "many" resource',
    () => {
      assert.equal(result.length, countries.length)
    })

    it('The newKey points towards an array of 0 - N items',
    () => {
      const hasArrayAsValue = result.every(row => Array.isArray(row.wines))
      assert.isTrue(hasArrayAsValue)
    })

    it('Returns a single nested resource under the newKey',
    () => {
      const expected = [
        {
          id: 1,
          name: 'USA',
          wines: [
            { id: 1, name: 'Restless Earth', country_id: 1 },
            { id: 2, name: 'Objet D\'Art', country_id: 1 },
            { id: 3, name: 'To Be Honest', country_id: 1 }
          ]
        },
        {
          id: 2,
          name: 'Chile',
          wines: [{ id: 4, name: 'Alma Libre', country_id: 2 }]
        },
        {
          id: 3,
          name: 'South Africa',
          wines: [{ id: 5, name: 'Cape Route', country_id: 3 }]
        },
        {
          id: 4,
          name: 'New Zealand',
          wines: [{ id: 6, name: 'Outer Sounds', country_id: 4 }]
        }
      ]

      assert.sameDeepMembers(result, expected)
    })
  })

  describe('#belongsTo', () => {
    let result
    beforeEach(() => {
      result = belongsTo(wines, countries, 'country', 'country_id')
    })

    it('Returns an array which has a length equal to the "one" resource',
    () => {
      assert.equal(result.length, wines.length)
    })

    it('Excludes the foreignKey from the final objects in the result',
    () => {
      const doesNotHaveCountryId = result.every(row => !row.country_id)
      assert.isTrue(doesNotHaveCountryId)
    })

    it('Returns a single nested resource under the newKey',
    () => {
      const expected = [
        { id: 1, name: 'Restless Earth', country: { id: 1, name: 'USA' }},
        { id: 2, name: 'Objet D\'Art', country: { id: 1, name: 'USA' }},
        { id: 3, name: 'To Be Honest', country: { id: 1, name: 'USA' }},
        { id: 4, name: 'Alma Libre', country: { id: 2, name: 'Chile' }},
        { id: 5, name: 'Cape Route', country: { id: 3, name: 'South Africa' }},
        { id: 6, name: 'Outer Sounds', country: { id: 4, name: 'New Zealand' }}
      ]

      assert.sameDeepMembers(result, expected)
    })
  })
})
