const palindrome = require('./../utils/for_testing')

describe('tests of palindrome', () => {
  test('Palindrome', () => {
    const result = palindrome('hentai')

    expect(result).toBe('iatneh')
  })

  test('Palindrome of empty string', () => {
    const result = palindrome('')

    expect(result).toBe('')
  })

  test('Palindrome of undefined', () => {
    const result = palindrome()

    expect(result).toBeUndefined()
  })
})
