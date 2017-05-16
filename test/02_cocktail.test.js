const chai = require('chai')
const assert = chai.assert
const { alreadyJoined } = require('../src/02_cocktail')

xdescribe('01 Games', () => {
  describe('#alreadyJoined', () => {
    let cocktails, result
    beforeEach(() => {
      cocktails = [
        {
          cocktail_id: 1, cocktail_name: 'Negroni',
          ingredient_id: 1, ingredient_name: 'Campari'
        },
        {
          cocktail_id: 1, cocktail_name: 'Negroni',
          ingredient_id: 2, ingredient_name: 'Sweet Vermouth'
        },
        {
          cocktail_id: 1, cocktail_name: 'Negroni',
          ingredient_id: 3, ingredient_name: 'Gin'
        },
        {
          cocktail_id: 2, cocktail_name: 'Tom Collins',
          ingredient_id: 4, ingredient_name: 'Simple Syrup'
        },
        {
          cocktail_id: 2, cocktail_name: 'Tom Collins',
          ingredient_id: 5, ingredient_name: 'Lemon Juice'
        },
        {
          cocktail_id: 2, cocktail_name: 'Tom Collins',
          ingredient_id: 6, ingredient_name: 'Club Soda'
        },
        {
          cocktail_id: 2, cocktail_name: 'Tom Collins',
          ingredient_id: 3, ingredient_name: 'Gin'
        }
      ]
    })

    it('Returns an array which has a length equal to the number of times the first foreignKey appears',
    () => {
      const result = alreadyJoined(cocktails, 'cocktail_id', 'ingredients', 'ingredient_id')
      assert.equal(result.length, 2)
    })

    it('The newKey points towards an array of 0 - N items',
    () => {
      const result = alreadyJoined(cocktails, 'cocktail_id', 'ingredients', 'ingredient_id')

      const hasArrayAsValue = result.every(row => {
        return Array.isArray(row.ingredients)
      })

      assert.isTrue(hasArrayAsValue)
    })

    it('Returns a nested resource under the newKey',
    () => {
      const result = alreadyJoined(cocktails, 'cocktail_id', 'ingredients', 'ingredient_id')

      assert.equal(result.length, 2)

      const names = result.map(cocktail => cocktail.cocktail_name)
      assert.sameMembers(names, ['Negroni', 'Tom Collins'])

      const ingredients = result.map(cocktail => cocktail.ingredients)
        .reduce((acc, curr) => acc.concat(curr))
        .map(ingredient => ingredient.ingredient_name)
      assert.includeMembers(ingredients, [
        'Campari',
        'Sweet Vermouth',
        'Gin',
        'Simple Syrup',
        'Lemon Juice',
        'Club Soda'
      ])

      const ginCount = ingredients.filter(name => name === 'Gin').length
      assert.equal(ginCount, 2)
    })

    it('The resources can be swapped and it still correctly nests the values',
    () => {
      const result = alreadyJoined(cocktails, 'ingredient_id', 'cocktails', 'cocktail_id')

      assert.equal(result.length, 6)

      const names = result.map(ingredient => ingredient.ingredient_name)
      assert.sameMembers(names, [
        'Campari',
        'Sweet Vermouth',
        'Gin',
        'Simple Syrup',
        'Lemon Juice',
        'Club Soda'
      ])

      const cocktailResults = result.map(ingredient => ingredient.cocktails)
        .reduce((acc, curr) => acc.concat(curr))
        .map(cocktail => cocktail.cocktail_name)
      assert.includeMembers(cocktailResults, ['Negroni', 'Tom Collins'])

      const negroniCount = cocktailResults.filter(name => {
        return name === 'Negroni'
      }).length
      assert.equal(negroniCount, 3)

      const tomCollinsCount = cocktailResults.filter(name => {
        return name === 'Tom Collins'
      }).length
      assert.equal(tomCollinsCount, 4)
    })
  })
})
