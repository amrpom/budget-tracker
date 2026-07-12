require('dotenv').config({
  path: require('path').resolve(__dirname, '../.env')
});
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  database: process.env.PGDATABASE
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};