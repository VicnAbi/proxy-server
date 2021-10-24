const express = require('express')
const corsAnywhere = require("cors-anywhere")
const dotenv = require('dotenv')
dotenv.config()

const host = '0.0.0.0'
const port = 9000

const isProd = process.env.NODE_ENV === 'production'

// proxy
const proxy = corsAnywhere
  .createServer({
    originWhitelist: isProd ? [
      'https://vicnabi.github.io/Nabidex'
    ] : [],
    requireHeader: isProd ? ['Origin'] : [],
    removeHeaders: [],
  })
  .listen(port + 1, host, () => {
    console.log(`Running CORS Anywhere on ${port + 1}`)
  })

// express
const app = express()
app.get('/twitch/*', function(req, res) {
  req.url = req.url.replace('/twitch', '/https://api.twitch.tv/helix')
  req.headers['Authorization'] = `Bearer ${process.env.TWITCH_TOKEN}`
  req.headers['Client-Id'] = process.env.TWITCH_CLIENT_ID
  proxy.emit('request', req, res)
})
app.get('/github/*', function(req, res) {
  req.url = req.url.replace('/github', '/https://api.github.com')
  req.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
  proxy.emit('request', req, res)
})
app.get('/holodex/*', function(req, res) {
  req.url = req.url.replace('/holodex', '/https://holodex.net')
  req.headers['X-APIKEY'] = `${process.env.HOLODEX_TOKEN}`
  proxy.emit('request', req, res)
})
app.listen(port, () => {
  console.log(`Running Express on ${port}`)
})