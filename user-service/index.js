import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'

import db from './db-config/index.js'
import usersRoutes from './routes/users/index.js'

db.connect()

const app = express()
const APP_PORT = process.env.SERVER_PORT || 3000

app.use(bodyParser.json())
app.use('/users', usersRoutes)

app.listen(APP_PORT, () => {
    console.log(`User service is running on port ${APP_PORT}`)
})
