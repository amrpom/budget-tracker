jest.mock('../db', () => ({
    query: jest.fn()
}));

const mockDb = require('../db');

describe('getAll', () => {
    const { getAll } = require('../controllers/transactions');
    let req, res;

    beforeEach(() => {
        req = { userId: 1 };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return all transactions', async () => {
        const fakeTransactions = [
            { id: 1, user_id: 1, title: 'Rent', amount: 1200, type: 'expense', category: 'Housing', date: '2026-06-01' },
            { id: 2, user_id: 1, title: 'Salary', amount: 5200, type: 'income', category: 'Salary', date: '2026-06-01' }
        ];

        mockDb.query.mockResolvedValue({ rows: fakeTransactions });

        await getAll(req, res);

        expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM transactions WHERE user_id=$1', [1]);
        expect(res.json).toHaveBeenCalledWith(fakeTransactions);
    });

    it('should return 500 on database error', async () => {
        mockDb.query.mockRejectedValue(new Error('DB connection failed'));

        await getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
});

describe('create', () => {
    const { create } = require('../controllers/transactions');
    let req, res;

    beforeEach(() => {
        req = {
            userId: 1,
            body: {
                title: 'Groceries',
                amount: 87.40,
                type: 'expense',
                category: 'Food',
                date: '2026-06-03',
                created_at: '2026-06-03T00:00:00.000Z'
            }
        };

        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should create a transaction', async () => {
        const fakeTransaction = { id: 3, ...req.body };
        mockDb.query.mockResolvedValue({ rows: [fakeTransaction] });

        await create(req, res);

        expect(mockDb.query).toHaveBeenCalledWith(
            'INSERT INTO transactions(user_id, title, amount, type, category, date, created_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [req.userId, req.body.title, req.body.amount, req.body.type, req.body.category, req.body.date, req.body.created_at]
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(fakeTransaction);
    });

    it('should return 500 on database error', async () => {
        mockDb.query.mockRejectedValue(new Error('DB connection failed'));

        await create(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
});

describe('update', () => {
    const { update } = require('../controllers/transactions');
    let req, res;

    beforeEach(() => {
        req = {
            userId: 1,
            params: { id: '1' },
            body: {
                title: 'Updated Rent',
                amount: 1300,
                type: 'expense',
                category: 'Housing',
                date: '2026-06-01',
                created_at: '2026-06-01T00:00:00.000Z'
            }
        };
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should update a transaction and return it', async () => {
        const fakeTransaction = { id: 1, ...req.body };
        mockDb.query.mockResolvedValue({ rows: [fakeTransaction] });

        await update(req, res);

        expect(mockDb.query).toHaveBeenCalledWith(
            'UPDATE transactions SET title=$1, amount=$2, type=$3, category=$4, date=$5, created_at=$6 WHERE id=$7 AND user_id=$8 RETURNING *',
            [req.body.title, req.body.amount, req.body.type, req.body.category, req.body.date, req.body.created_at, '1', req.userId]
        );
        expect(res.json).toHaveBeenCalledWith(fakeTransaction);
    });

    it('should return 500 on database error', async () => {
        mockDb.query.mockRejectedValue(new Error('DB connection failed'));

        await update(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
});

describe('remove', () => {
    const { remove } = require('../controllers/transactions');
    let req, res;

    beforeEach(() => {
        req = {
            userId: 1,
            params: { id: '1' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            end: jest.fn()
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should delete a transaction and return 204', async () => {
        mockDb.query.mockResolvedValue({ rows: [{ id: 1}] });

        await remove(req, res);

        expect(mockDb.query).toHaveBeenCalledWith(
            'DELETE FROM transactions WHERE id=$1 AND user_id=$2 RETURNING id',
            ['1', 1]
        );
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
    });

    it('should return 500 on database error', async () => {
        mockDb.query.mockRejectedValue(new Error('DB connection failed'));

        await remove(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
});