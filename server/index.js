const express = require('express')
const cors = require('cors')
const path = require('path')

const route = require('./src/route/index')
const { TEMP_DIR, PUBLIC_DIR, CLIENT_BUILD_DIR } = require('./src/config/path')

require('./src/models/sync')

const app = express()

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'
const ENV = process.env.NODE_ENV || 'development'

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static
app.use('/temp', express.static(TEMP_DIR))
app.use('/public', express.static(PUBLIC_DIR))

// API
app.use('/api', route)

// Frontend build
app.use(express.static(CLIENT_BUILD_DIR))

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get(/^\/.*$/, (req, res) => {
  res.sendFile(path.join(CLIENT_BUILD_DIR, 'index.html'))
})

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/ in ${ENV} mode`)
})
