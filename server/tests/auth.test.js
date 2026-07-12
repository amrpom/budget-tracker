jest.mock('../db', () => ({
    query: jest.fn()
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn()
}));

const { signup, login, logout } = require('../controllers/auth');
const mockDb = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('signup', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { email: 'test@example.com', password: 'password123' }
        };
        res = {
            cookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    // first time it's called, it's blank because there is no user yet. then the second has one
    it('should create a new user and set a cookie', async () => {
        mockDb.query
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [{ id: 1, email: 'test@example.com', created_at: '2026-06-01' }] });

        bcrypt.hash.mockResolvedValue('hashedpassword');
        jwt.sign.mockReturnValue('faketoken');

        await signup(req, res);

        expect(mockDb.query).toHaveBeenCalledTimes(2);
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(jwt.sign).toHaveBeenCalled();
        expect(res.cookie).toHaveBeenCalledWith('token', 'faketoken', expect.objectContaining({ httpOnly: true }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Signed up successfully' });
    });

    it('should return 400 if email is already in use', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already in use' });
    });

    it('should return 500 on database error', async () => {
        mockDb.query.mockRejectedValue(new Error('DB connection failed'));

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal server error');
    });
});

describe('login', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { email: 'test@example.com', password: 'password123' }
        };
        res = {
            cookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should login and set a cookie', async () => {
        mockDb.query.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com', password: 'hashedpassword' }] });
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('faketoken');

        await login(req, res);

        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
        expect(res.cookie).toHaveBeenCalledWith('token', 'faketoken', expect.objectContaining({ httpOnly: true }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Logged in successfully' });
    });

    it('should return 401 if email not found', async () => {
        mockDb.query.mockResolvedValue({ rows: [] });

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });

    it('should return 401 if password is wrong', async () => {
        mockDb.query.mockResolvedValue({ rows: [{ id: 1, email: 'test@example.com', password: 'hashedpassword' }] });
        bcrypt.compare.mockResolvedValue(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });

    it('should return 500 on database error', async () => {
        mockDb.query.mockRejectedValue(new Error('DB connection failed'));

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal server error');
    });
});

describe('logout', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            clearCookie: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('should clear the cookie and return 200', async () => {
        await logout(req, res);

        expect(res.clearCookie).toHaveBeenCalledWith('token', expect.objectContaining({ httpOnly: true }));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
    });
});