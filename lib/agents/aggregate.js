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
  let lastHours = -1
  let lastMinutes = -1
  let list = [0, 0, 0]

  let tid = null
  const sub = client.subscribe(
    '#ChampionshipSunday,#ChiefsKingdom,#GoPats,@Patriots,@Chiefs,#EverythingWeGot,#LetsRoll',
    { deliverAllAvailable: true },
    message => {
      if (tid) clearTimeout(tid)
      const event = JSON.parse(message.getData().toString())
      const occuredAt = new Date(event.createdAt)

      if (
        lastHours !== occuredAt.getUTCHours() ||
        lastMinutes !== occuredAt.getUTCMinutes()
      ) {
        if (lastHours !== -1 && lastMinutes !== -1) {
          let date = new Date(
            occuredAt.getFullYear(),
            occuredAt.getMonth(),
            occuredAt.getDate(),
            occuredAt.getHours(),
            occuredAt.getMinutes()
          ).toLocaleString('en-us', { timeZone: 'America/Denver' })

          console.info(`${date}\t${list[0]}\t${list[1]}\t${list[2]}`)
        }
        lastHours = occuredAt.getUTCHours()
        lastMinutes = occuredAt.getUTCMinutes()
        list = [0, 0, 0]
      }

      if (event.score > 0) {
        list[0]++
      } else if (event.score < 0) {
        list[2]++
      } else {
        list[1]++
      }

      tid = setTimeout(() => {
        sub.close()
        process.exit(0)
      }, 10000) //60001)
    }
  )
}

main()
