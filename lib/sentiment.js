const Sentiment = require('sentiment')

const sentiment = new Sentiment()

module.exports = text => {
  const result = sentiment.analyze(text)
  return result.score
}
