# 📚 Library Management System

A RESTful API for managing books, borrowers, and borrowing processes — built with NestJS, PostgreSQL, and Prisma.

---

## Features

### Books
- Add, update, and delete books
- List all books with pagination
- Search books by title, author, or ISBN

### Users (Borrowers)
- Register and manage borrowers
- List all borrowers (Admin only)
- View and update own profile

### Borrowing Process
- Borrow a book (as yourself or on behalf of a user)
- Return a book
- View your current borrowings
- View borrowings by user or by book
- Track due dates and overdue books

### Reports (Admin only)
- Export borrowing data for a custom date range as CSV or XLSX
- Export all overdue borrowings from last month
- Export all borrowings from last month

### Security & Performance
- JWT authentication via HTTP-only cookies
- Role-based access control (USER / ADMIN)
- Rate limiting on login and register endpoints (5 requests per minute)
- Database indexes on frequently queried fields

---

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod + nestjs-zod
- **Documentation**: Swagger UI
- **Containerization**: Docker + Docker Compose

---

## Getting Started

### Prerequisites
- Docker
- Docker Compose

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@db:5432/DB_NAME"
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_db_name
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=production
```

---

## Running with Docker

### Development

```bash
docker-compose -f docker-compose.dev.yml up --build
```

- Runs with hot reload
- Exposes port `3000` for the API and `9229` for debugging
- Database is auto-migrated and seeded on first run

### Production

```bash
docker-compose -f docker-compose.prod.yml up --build
```

- Runs the compiled NestJS app
- Database migrations and seeding run automatically on startup
- Seeding is skipped if data already exists

---

## API Documentation

Once the app is running, visit:

```
http://localhost:3000/doc
```

Swagger UI documents all endpoints with expected inputs and outputs.

---

## Default Seed Data

The database is seeded automatically on first run with:

| Role  | Email                | Password      |
|-------|----------------------|---------------|
| Admin | admin@lms.com        | password123   |
| User  | user1@example.com    | password123   |
| User  | user2@example.com    | password123   |
| ...   | user{N}@example.com  | password123   |

10 regular users, 15 books, and borrowing records with various statuses are created for testing.

---

## API Endpoints Overview

### Auth
| Method | Endpoint          | Access | Description        |
|--------|-------------------|--------|--------------------|
| POST   | /auth/login       | Public | Login              |
| POST   | /auth/register    | Public | Register           |

### Books
| Method | Endpoint          | Access | Description              |
|--------|-------------------|--------|--------------------------|
| GET    | /books            | Public | List all books           |
| GET    | /books/:id        | Public | Get a book               |
| POST   | /books            | Admin  | Add a book               |
| PATCH  | /books/:id        | Admin  | Update a book            |
| DELETE | /books/:id        | Admin  | Delete a book            |

### Users
| Method | Endpoint          | Access      | Description              |
|--------|-------------------|-------------|--------------------------|
| GET    | /users            | Admin       | List all users           |
| GET    | /users/me         | User/Admin  | Get own profile          |
| PATCH  | /users/me         | User/Admin  | Update own profile       |
| GET    | /users/:id        | Admin       | Get a user               |
| PATCH  | /users/:id        | Admin       | Update a user            |
| DELETE | /users/:id        | Admin       | Delete a user            |

### Borrowings
| Method | Endpoint                    | Access     | Description                        |
|--------|-----------------------------|------------|------------------------------------|
| POST   | /borrowings                 | User/Admin | Borrow a book                      |
| POST   | /borrowings/me              | User       | Borrow a book for yourself         |
| GET    | /borrowings                 | Admin      | List all borrowings                |
| GET    | /borrowings/me              | User       | List your borrowings               |
| GET    | /borrowings/:id             | Owner/Admin| Get a borrowing record             |
| GET    | /borrowings/user/:userId    | Admin      | List borrowings by user            |
| GET    | /borrowings/book/:bookId    | Admin      | List borrowings by book            |
| PATCH  | /borrowings/:id/return      | Owner/Admin| Return a book                      |
| DELETE | /borrowings/:id             | Admin      | Delete a borrowing record          |

### Reports (Admin only)
| Method | Endpoint                  | Description                                      |
|--------|---------------------------|--------------------------------------------------|
| GET    | /reports?from=&to=&format= | Export borrowings for a custom date range       |
| GET    | /reports/overdue?format=  | Export overdue borrowings from last month        |
| GET    | /reports/last-month?format= | Export all borrowings from last month          |

> `format` query param accepts `csv` or `xlsx`
