const db = require('../db');

async function getAll(req, res) {
	try {
		const result = await db.query('SELECT * FROM transactions WHERE user_id=$1', [req.userId]);
		res.json(result.rows);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
}

async function getOne(req, res) {
	try {
		const {id} = req.params;
		const result = await db.query('SELECT * FROM transactions WHERE id=$1 AND user_id=$2', [id, req.userId]);
		if (result.rows.length === 0) {
			return res.status(404).send('Transaction not found');
		}
		res.json(result.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
}

async function create(req, res) {
	try {
		const { title, amount, type, category, date, created_at } = req.body;
		const result = await db.query(
			'INSERT INTO transactions(user_id, title, amount, type, category, date, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
			[req.userId, title, amount, type, category, date, created_at]
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
			'UPDATE transactions SET title=$1, amount=$2, type=$3, category=$4, date=$5, created_at=$6 WHERE id=$7 AND user_id=$8 RETURNING *',
			[title, amount, type, category, date, created_at, id, req.userId]
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
		// RETURNING id so it can check if anything actually got removed afterwards
		await db.query('DELETE FROM transactions WHERE id=$1 AND user_id=$2 RETURNING id', [id, req.userId]);

		if (result.rows.length === 0) {
			return res.status(404).send('Transaction not found');
		}
		res.status(204).end();
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
}

module.exports = { getAll, getOne, create, update, remove };
