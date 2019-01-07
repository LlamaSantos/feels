const md5 = require('md5')
const { getInstance } = require('nats-nerve')

const hashes = new Set()
async function main() {
  const client = await getInstance(
    'nats://127.0.0.1:4222',
    'test-cluster',
    'twit2'
  )

  let counter = 0

  let tid = null
  const sub = client.subscribe(
    '#CHIvsPIT',
    { deliverAllAvailable: true },
    message => {
      if (tid) clearTimeout(tid)
      const event = JSON.parse(message.getData().toString())
      const occuredAt = new Date(event.createdAt).toLocaleString('en-us', {
        timeZone: 'America/Denver'
      })

      console.info(++counter, occuredAt, event.text)

      tid = setTimeout(() => {
        sub.close()
        process.exit(0)
      }, 100) //60001)
    }
  )
}

main()
