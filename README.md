# Budget Tracker
A full-stack budget tracking app for managing income/expenses. Built with Next.js, Express, and PostgreSQL. Containerized with Docker.

## Features
- User auth
- Add, edit, and delete transactions (income or expense)
- Categorize transactions (Housing, Food, Transport, Entertainment, Health, Salary, Other)
- Dashboard with running balance, income/expense summary, and spending by category
- Full transaction list with edit and delete actions, plus filters per category and date range
- Each user only sees their own info
- Export transaction list to CSV (including filtered if applied)

## Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Auth**: JWT with jsonwebtoken and bcrypt
- **Containerization:** Docker, Docker Compose

## How to Run
Requires Docker installed and running.
1. Clone the repository
2. Create a .env file in the project root, filling in the DB credentials:

    - PGUSER=your_db_user
    - PGPASSWORD=your_db_password
    - PGDATABASE=your_db_name
    - JWT_SECRET=your_secret (to add this, run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
3. Create a .env file in the client/ folder, filling in the API URL:

    - NEXT_PUBLIC_API_URL=http://localhost:3001
    - API_URL=http://server:3001

4. Start containers with `docker compose up -d --build`
5. Access http://localhost:3000/dashboard in the browser.
6. To stop it, `docker compose down`. To wipe the DB volume, add the `-v` flag.

## Auth
- Passwords hashed with bcrypt before storage
- Server sets HTTP only JWT cookie
- Cookies sent with requests
- Server middleware checks for the cookie, redirects to /login if unauthenticated
- Queries to DB filtered by user_id so viewers only see their own stuff

## Workflows
- Unit tests for transactions runs automatically via GitHub Actions. To run them locally, cd to /server from the project root and run `npm test`.

### Notes
- To remote into DB, `docker exec -it $(docker compose ps -q db) psql -U postgres -d budget`
- To curl new user, `Invoke-WebRequest -Uri "http://localhost:3001/auth/signup" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com","password":"password123"}'`