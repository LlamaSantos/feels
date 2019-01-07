const React = require('react')
const { pathOr } = require('ramda')
const { useState, useEffect, createRef, useMemo } = React

let isConnected = false
let socket = null
const ref = createRef()
const value = pathOr('', ['current', 'value'])

module.exports = function Stream() {
  const [events, setEvents] = useState([0, 0, 0])

  useEffect(() => {
    if (socket) {
      socket.onmessage = event => {
        const [pos, neutral, neg] = events
        const message = JSON.parse(event.data)

        setEvents([
          message.score > 0 ? pos + 1 : pos,
          message.score === 0 ? neutral + 1 : neutral,
          message.score < 0 ? neg + 1 : neg
        ])
      }
    }
  })

  const onClick = () => {
    if (socket) {
      socket.close()
      socket = null
    }

    const track = value(ref)
    console.info('Attempting to search ', track || 'nothing')
    if (track) {
      socket = new WebSocket('ws://localhost:5000/stream')
      socket.onopen = () => {
        const track = value(ref)
        socket.send(JSON.stringify({ track }))
        isConnected = true
        setEvents([0, 0, 0])
      }
      socket.onerror = err => {
        console.log('Error:', err)
      }
    }
  }

  const [pos, neutral, neg] = events

  return (
    <div>
      <input type="text" ref={ref} placeholder="Topic to search" />
      <button onClick={onClick}>GO</button>
      <table>
        <thead>
          <tr>
            <th>Positive</th>
            <th>Neutral</th>
            <th>Negative</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{pos}</td>
            <td>{neutral}</td>
            <td>{neg}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
