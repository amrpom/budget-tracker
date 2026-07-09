CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     title VARCHAR(255) NOT NULL,
     amount NUMERIC(10, 2) NOT NULL,
     type VARCHAR(10) NOT NULL,
     category VARCHAR(50) NOT NULL,
     date DATE NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
);