const React = require('react')
const { render } = require('react-dom')
const { Router } = require('@reach/router')

const Streamer = require('./streamer')

render(
  <Router>
    <Streamer path="/" track="gene" />
  </Router>,
  document.getElementById('app')
)
