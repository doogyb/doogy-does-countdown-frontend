import { permuteString } from './combinations.js'

$.ajax({
  type: 'GET',
  url: 'assets/data/words_alpha.txt',
  contentType: 'text/plain',
  success: parseWords
})

let words
function parseWords (data) {
  console.log(typeof (data))
  words = new Set(data.split('\r\n'))
}

export async function solveLetters (letters) {
  const results = permuteString(letters.toLowerCase()).filter(word => words.has(word))
  const stringLengths = {}

  results.forEach(function (value, _) {
    if (!stringLengths[value.length]) {
      stringLengths[value.length] = []
    }
    stringLengths[value.length].push(value)
  })

  return stringLengths
}
