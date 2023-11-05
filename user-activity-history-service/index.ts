require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')

const db = require('./db-config/index.ts')
const userHistory = require('./routes/user-history/index.ts')

db.connect()

const app = express()
const APP_PORT = process.env.SERVER_PORT || 3001

app.use(bodyParser.json())
app.use('/user-history', userHistory)

app.listen(APP_PORT, () => {
    console.log(`User history service is running on port ${APP_PORT}`)
})