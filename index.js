require('dotenv').load()

const Koa = require('koa')
const Router = require('koa-router')
const ws = require('koa-websocket')
const static = require('koa-static')
const { twitter, sentiment, Store } = require('./lib')

Store().then(store => {
  const app = ws(new Koa())
  const router = new Router()

  const info = console.info.bind(console, 'app:')
  let cancel = null
  app.ws.use(
    new Router()
      .all('/stream', ctx => {
        info('Stream initialized')
        ctx.websocket.on('close', () => {
          info('closed')
          cancel && cancel()
        })
        ctx.websocket.on('message', data => {
          const message = JSON.parse(data)
          cancel = twitter(message.track, event => {
            const score = sentiment(event.text)
            event = Object.assign(event, {
              score,
              group: score > 0 ? 1 : score < 0 ? -1 : 0
            })
            store
              .publish(message.track, event)
              .then(() => {
                if (ctx.websocket.readyState === 1) {
                  ctx.websocket.send(JSON.stringify(event))
                }
              })
              .catch(err => {
                console.error('error:', err)
              })
          })
        })
      })
      .routes()
  )

  app.use(static('./dist', {}))
  app.use(router.routes())
  app.use(router.allowedMethods())

  const port = process.env.PORT || '5000'
  app.listen(port, () => console.info(`Listening on http://localhost:${port}`))
})
