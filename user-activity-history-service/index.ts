const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
require('dotenv').config()

const app = express();
const APP_PORT = process.env.SERVER_PORT || 3001;
app.use(bodyParser.json());

const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

app.post('/user-history', async (req, res)  => {
    const { userId, action } = req.body;
    const query = 'INSERT INTO user_history (user_id, action) VALUES ($1, $2)';
    const values = [userId, action];

    try {
        await db.query(query, values);
        res.json({ message: 'User action history recorded' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error recording user action history' });
    }
});

app.get('/user-history', async (req, res): Promise<void> => {
    const userId = req.query.userId;
    const page = req.query.page || 1;
    const pageSize = 10;

    const offset = (page - 1) * pageSize;

    const query = 'SELECT * FROM user_history WHERE user_id = $1 LIMIT $2 OFFSET $3';
    const values = [userId, pageSize, offset];

    try {
        const result = await db.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching user action history' });
    }
});

app.listen(APP_PORT, (): void => {
    console.log(`User history service is running on port ${APP_PORT}`);
});
