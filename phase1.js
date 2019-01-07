const Sentiment = require('sentiment')
const phrases = require('./phrases.json')

const sentiment = new Sentiment()

const vomit = '🤮'
const startStruck = '🤩'
const shrug = '🤷'

for (let i = 0; i < phrases.length; ++i) {
  const phrase = phrases[i]
  const result = sentiment.analyze(phrase)

  if (result.score > 0) {
    console.info(`${phrase} ${startStruck}`)
  } else if (result.score === 0) {
    console.info(`${phrase} ${shrug}`)
  } else {
    console.info(`${phrase} ${vomit}`)
  }
}
