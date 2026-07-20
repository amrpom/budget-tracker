const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, remove, exportCSV } = require('../controllers/transactions');
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, getAll);
router.get('/export', verifyToken, exportCSV);
router.get('/:id', verifyToken, getOne);
router.post('/', verifyToken, create);
router.put('/:id', verifyToken, update);
router.delete('/:id', verifyToken, remove);

module.exports = router;