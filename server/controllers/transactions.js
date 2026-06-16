const db = require('../db');

async function getAll(req, res) {
	try {
		const result = await db.query('SELECT * FROM transactions');
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
}

async function create(req, res) {
	try {
		const { title, amount, type, category, date, created_at } = req.body;
		const result = await db.query(
			'INSERT INTO transactions(title, amount, type, category, date, created_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
			[title, amount, type, category, date, created_at]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
}

async function update(req, res) {
	try {
		const { id } = req.params;
		const { title, amount, type, category, date, created_at } = req.body;
		const result = await db.query(
			'UPDATE transactions SET title=$1, amount=$2, type=$3, category=$4, date=$5, created_at=$6 WHERE id=$7 RETURNING *',
			[title, amount, type, category, date, created_at, id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
}

async function remove(req, res) {
	try {
		const { id } = req.params;
		await db.query('DELETE FROM transactions WHERE id=$1', [id]);
		res.status(204).end();
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
}

module.exports = { getAll, create, update, remove };
