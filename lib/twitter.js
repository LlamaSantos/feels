const Twitter = require('twitter-lite')

const opts = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}
const client = new Twitter(opts)
const info = console.info.bind(console, 'twitter:')

module.exports = function(track, cb) {
  info('connecting', track)
  try {
    const stream = client.stream('statuses/filter', { track, language: 'en' })
    info('created')
    stream.on('start', () => info('start'))
    stream.on('end', () => info('end'))
    stream.on('data', async tweet => {
      cb({
        track,
        id: tweet.id,
        text: tweet.text,
        retweeted: tweet.retweeted,
        createdAt: tweet.created_at,
        user: {
          id: tweet.user.id,
          name: tweet.user.name,
          screename: tweet.user.screen_name
        },
        original: tweet
      })
    })
    stream.on('error', error => console.error('Error:', error))
    return () => stream.destroy()
  } catch (err) {
    console.error('twitter (error):', err)
  }
}
