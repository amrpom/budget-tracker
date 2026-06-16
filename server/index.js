const express = require('express');
const db = require('./db');

const app = express();
const transactionsRouter = require('./routes/transactions');
const port = 3001;

app.use(express.json());
app.use('/transactions', transactionsRouter);

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