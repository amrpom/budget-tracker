const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signup(req, res) {
    try {
        const { email, password } = req.body;

        const existing = await db.query('SELECT * FROM users WHERE email=$1', [email]);

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Email already in use'});
        }

        const hash = await bcrypt.hash(password, 10);

        // RETURNING in order to avoid password ending up in result of query
        const result = await db.query('INSERT INTO users(email, password) VALUES($1, $2) RETURNING id, email, created_at', [email, hash]);

        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(201).json({ message: 'Signed up successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}

async function login(req, res) {
    try {
        const {email, password} = req.body;

        const result = await db.query('SELECT * FROM users WHERE email=$1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password'});
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid email or password'});
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d'});
        
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 //matches 7 days in JWT
        });
        res.status(201).json({ message: 'Logged in successfully'});
    } catch(err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
}

module.exports = { signup, login }