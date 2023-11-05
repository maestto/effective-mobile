import express from 'express'
const router = express.Router()

import db from '../../db-config/index.js'
import { sendUserActionToHistoryService } from "./utils/index.js"

router.post('/', async (req, res) => {
    const { name, email } = req.body
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id'
    const values = [name, email]

    try {
        const result = await db.query(query, values)
        const userId = result.rows[0].id
        res.json({ id: userId })

        const userActionData = { userId, action: 'user_created' }
        await sendUserActionToHistoryService(userActionData)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error creating user' })
    }
})

router.put('/:id', async (req, res) => {
    const userId = req.params.id
    const { name, email } = req.body
    const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3'
    const values = [name, email, userId]

    try {
        await db.query(query, values)
        res.json({ message: 'User updated successfully' })

        const userActionData = { userId, action: 'user_updated' }
        await sendUserActionToHistoryService(userActionData)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error updating user' })
    }
})

router.get('/', async (req, res) => {
    const query = 'SELECT * FROM users'

    try {
        const result = await db.query(query)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error fetching user-history' })
    }
})

export default router