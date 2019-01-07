const { getInstance } = require('nats-nerve')

let client = null

module.exports = async function(servers) {
  if (!client) {
    client = await getInstance('nats://127.0.0.1:4222', 'test-cluster', 'twit')
    console.info('client:', 'connected')
  }

  return {
    publish(topic, message) {
      return client.publisher.publish(topic, JSON.stringify(message))
    }
  }
}
