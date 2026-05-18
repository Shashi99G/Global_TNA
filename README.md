# GlobalTNA — Mini Service Request Board

A full-stack web app where homeowners post service requests and tradespeople browse, filter, and manage them.

## Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | Next.js 14 (App Router)     |
| Backend  | Node.js + Express           |
| Database | MongoDB (Atlas or local)    |
| ODM      | Mongoose                    |
| Styling  | Plain CSS                   |
| Testing  | Jest + Supertest            |

---

## Project Structure

```
globaltna/
├── backend/
│   ├── middleware/errorHandler.js
│   ├── models/JobRequest.js
│   ├── routes/jobs.js
│   ├── jobs.test.js
│   ├── seed.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── globals.css
    │   ├── layout.js
    │   ├── page.js                  ← Home: job listings + filters
    │   └── jobs/
    │       ├── new/page.js          ← New job form
    │       └── [id]/page.js         ← Job detail
    ├── lib/
    │   └── api.js                   ← All API calls
    ├── jsconfig.json                ← Enables @/ import alias
    ├── .env.example
    └── package.json
```

---

## Environment Variables

### Backend — create `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/globaltna?retryWrites=true&w=majority
MONGO_URI_TEST=mongodb://localhost:27017/globaltna_test
FRONTEND_URL=http://localhost:3000
```

### Frontend — create `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier) or local MongoDB

### 1. Clone

```bash
git clone https://github.com/<your-username>/globaltna-service-board.git
cd globaltna-service-board
```

### 2. Backend

```bash
cd backend
npm install

# Windows:
copy .env.example .env
# Mac/Linux:
cp .env.example .env

# Edit .env — set your MONGO_URI

npm run dev        # dev (nodemon)
npm start          # production
```

API runs at `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install

# Windows:
copy .env.example .env.local
# Mac/Linux:
cp .env.example .env.local

npm run dev
```

App runs at `http://localhost:3000`

### 4. Seed sample data (optional)

```bash
cd backend
npm run seed
```

Inserts 10 sample jobs across all categories and statuses.

### 5. Run tests

```bash
cd backend
npm test
```

---

## API Reference

| Method   | Endpoint        | Description                                          |
|----------|-----------------|------------------------------------------------------|
| GET      | /api/jobs       | List all jobs. Optional: `?category=` `?status=` `?search=` |
| GET      | /api/jobs/:id   | Get single job                                       |
| POST     | /api/jobs       | Create job (requires `title`, `description`)         |
| PATCH    | /api/jobs/:id   | Update status only                                   |
| DELETE   | /api/jobs/:id   | Delete job                                           |

---

## Features

**Core**
- List, create, view, update status, delete job requests
- Filter by category and status
- Server-side + client-side validation
- Global error handler with proper HTTP status codes

**Bonus**
- Keyword search across title and description
- 14 unit tests (Jest + Supertest) across all endpoints
- Seed script with 10 realistic sample jobs

---

## Deployment

**Frontend → Vercel**
1. Import repo, set Root Directory to `frontend`
2. Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`

**Backend → Render**
1. New Web Service, Root Directory `backend`
2. Build: `npm install` · Start: `npm start`
3. Add env vars: `MONGO_URI`, `FRONTEND_URL`, `PORT`
