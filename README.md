# Budget Tracker
A full-stack budget tracking app for managing income/expenses. Built with Next.js, Express, and PostgreSQL. Containerized with Docker.

## Features
- Add, edit, and delete transactions (income or expense)
- Categorize transactions (Housing, Food, Transport, Entertainment, Health, Salary, Other)
- Dashboard with running balance, income/expense summary, and spending by category
- Full transaction list with edit and delete actions

## Tech Stack
- **Frontend:** Next.js 15, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose

## How to Run
Requires Docker installed and running.
1. Clone the repository
2. Create a .env file in the project root, filling in the DB credentials:

    - PGUSER=your_db_user
    - PGPASSWORD=your_db_password
    - PGHOST=db
    - PGPORT=5432
    - PGDATABASE=your_db_name
3. Create a .env file in the client/ folder, filling in the API URL:

    - NEXT_PUBLIC_API_URL=http://localhost:3001
    - API_URL=http://server:3001

4. Start containers with `docker compose up -d --build`
5. Access http://localhost:3000/dashboard in the browser.
6. To stop it, `docker compose down`. To wipe the DB volume, add the `-v` flag.

## Workflows
- Unit tests for transactions runs automatically via GitHub Actions. To run them locally, cd to /server from the project root and run `npm test`.

