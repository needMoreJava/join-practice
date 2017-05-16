const chai = require('chai')
const assert = chai.assert
const { join } = require('../src/01_game')

describe('01 Games', () => {
  describe('#join', () => {
    let platforms, games, joinTable
    beforeEach(() => {
      platforms = [
        { id: 1, name: 'Nintendo Switch' },
        { id: 2, name: 'Playstation 4' },
        { id: 3, name: 'Xbox One' },
        { id: 4, name: 'PC' }
      ]

      games = [
        { id: 1, name: 'Injustice 2' },
        { id: 2, name: 'Mario Kart 8 Deluxe' },
        { id: 3, name: 'Prey' },
        { id: 4, name: 'Civilization VI' }
      ]

      joinTable = [
        { game_id: 1, platform_id: 2 },
        { game_id: 1, platform_id: 3 },
        { game_id: 2, platform_id: 1 },
        { game_id: 3, platform_id: 2 },
        { game_id: 3, platform_id: 3 },
        { game_id: 3, platform_id: 4 },
        { game_id: 4, platform_id: 4 }
      ]
    })

    it('Returns an array which has a length equal to the resource that is inputted first',
    () => {
      const result = join(platforms, 'platform_id', games, 'game_id', joinTable, 'games')
      assert.equal(result.length, platforms.length)
    })

    it('The newKey points towards an array of 0 - N items',
    () => {
      const result = join(platforms, 'platform_id', games, 'game_id', joinTable, 'games')
      const hasArrayAsValue = result.every(row => Array.isArray(row.games))
      assert.isTrue(hasArrayAsValue)
    })

    it('Returns a nested resource under the newKey',
    () => {
      const result = join(platforms, 'platform_id', games, 'game_id', joinTable, 'games')
      const expected = [
        {
          id: 1,
          name: 'Nintendo Switch',
          games: [
            { id: 2, name: 'Mario Kart 8 Deluxe' }
          ]
        },
        {
          id: 2,
          name: 'Playstation 4',
          games: [
            { id: 1, name: 'Injustice 2' },
            { id: 3, name: 'Prey' }
          ]
        },
        {
          id: 3,
          name: 'Xbox One',
          games: [
            { id: 1, name: 'Injustice 2' },
            { id: 3, name: 'Prey' }
          ]
        },
        {
          id: 4,
          name: 'PC',
          games: [
            { id: 3, name: 'Prey' },
            { id: 4, name: 'Civilization VI' }
          ]
        }
      ]

      assert.sameDeepMembers(result, expected)
    })

    it('The resources can be swapped and it still correctly nests the values',
    () => {
      const result = join(games, 'game_id', platforms, 'platform_id', joinTable, 'platforms')
      const expected = [
        {
          id: 1,
          name: 'Injustice 2',
          platforms: [
            { id: 2, name: 'Playstation 4' },
            { id: 3, name: 'Xbox One' }
          ]
        },
        {
          id: 2,
          name: 'Mario Kart 8 Deluxe',
          platforms: [
            { id: 1, name: 'Nintendo Switch' }
          ]
        },
        {
          id: 3,
          name: 'Prey',
          platforms: [
            { id: 2, name: 'Playstation 4' },
            { id: 3, name: 'Xbox One' },
            { id: 4, name: 'PC' }
          ]
        },
        {
          id: 4,
          name: 'Civilization VI',
          platforms: [
            { id: 4, name: 'PC' }
          ]
        }
      ]

      assert.sameDeepMembers(result, expected)
    })
  })
})
