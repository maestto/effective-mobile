const express = require('express')
const router = express.Router()

const db = require('../../db-config/index.ts')

router.post('/', async (req, res)  => {
    const { userId, action } = req.body
    const query = 'INSERT INTO user_history (user_id, action) VALUES ($1, $2)'
    const values = [userId, action]

    try {
        await db.query(query, values)
        res.json({ message: 'User action history recorded' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error recording user action history' })
    }
})

router.get('/:id', async (req, res) => {
    const userId = req.params.id
    const page = req.query.page || 1
    const pageSize = 10

    const offset = (page - 1) * pageSize

    const query = 'SELECT * FROM user_history WHERE user_id = $1 LIMIT $2 OFFSET $3'
    const values = [userId, pageSize, offset]

    try {
        const result = await db.query(query, values)
        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error fetching user action history' })
    }
})

module.exports = router