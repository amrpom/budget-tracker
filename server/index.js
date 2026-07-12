const express = require('express');
const db = require('./db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const transactionsRouter = require('./routes/transactions');
const authRouter = require('./routes/auth');
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser()); // must come before routes, otherwise they try to read cookies before being able to parse them
app.use('/transactions', transactionsRouter);
app.use('/auth', authRouter);

app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM transactions');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});