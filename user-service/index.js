import express from 'express';
import bodyParser from 'body-parser';
import pkg from 'pg';
const { Client } = pkg;
import fetch from 'node-fetch';
import 'dotenv/config'

const app = express();
const APP_PORT = process.env.SERVER_PORT || 3000;
app.use(bodyParser.json());

const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect();

app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id';
    const values = [name, email];

    try {
        const result = await db.query(query, values);
        const userId = result.rows[0].id;
        res.json({ id: userId });

        const userActionData = { userId, action: 'user_created' };
        await sendUserActionToHistoryService(userActionData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.put('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3';
    const values = [name, email, userId];

    try {
        await db.query(query, values);
        res.json({ message: 'User updated successfully' });

        const userActionData = { userId, action: 'user_updated' };
        await sendUserActionToHistoryService(userActionData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user' });
    }
});


app.get('/users', async (req, res) => {
    const query = 'SELECT * FROM users';

    try {
        const result = await db.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

async function sendUserActionToHistoryService(data) {
    try {
        await fetch('http://localhost:3001/user-history', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error sending user action data to history service', error);
    }
}

app.listen(APP_PORT, () => {
    console.log(`User service is running on port ${APP_PORT}`);
});
