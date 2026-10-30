# Company Explorer Dashboard

A responsive Company Explorer dashboard built to match the supplied MERN internship assignment. It includes the required 10 seed companies, left-side filters, horizontally scrolling cards, loading/fallback handling, an empty state, and an Express REST API with optional MongoDB persistence.

## Quickest way to see the UI

1. Extract the ZIP file.
2. Open `frontend/index.html` in Chrome, Edge, or Firefox.
3. The dashboard runs directly from the HTML file. Filters work immediately using the bundled copy of the assignment's 10-company seed dataset.
4. No login/signup is included, as required by the PDF.

> Note: Opening `index.html` directly is the easiest demo path. Browser security means a `file://` page cannot reliably call a local API. The UI automatically attempts the API at `http://localhost:5000/api/companies` and falls back to bundled seed data when the API is not running. To demonstrate the full backend, follow the steps below.

## Run the Express API

Requirements: Node.js 18+ (20+ recommended).

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and set `MONGODB_URI` if you have MongoDB running locally or a MongoDB Atlas connection string.

```bash
npm run dev
```

The API starts at `http://localhost:5000`. It can serve the bundled seed data even if MongoDB is not available.

### Optional MongoDB seed

With MongoDB running and `MONGODB_URI` configured:

```bash
npm run seed
```

Endpoints:
- `GET /api/health`
- `GET /api/companies`
- `GET /api/companies?name=Google` (exact name match)
- `GET /api/companies?industry=Cloud%20Computing`
- `GET /api/companies?country=United%20Kingdom`
- `GET /api/companies?country=United%20Kingdom&industry=Cloud%20Computing`
- `GET /api/companies/:id` (requires MongoDB connection)

## Assignment data

The exact 10 companies and values from the supplied assignment are in `backend/data/companies.json` and in the standalone frontend fallback dataset.

## Project structure

```text
company-explorer-dashboard/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── backend/
    ├── data/companies.json
    ├── models/Company.js
    ├── .env.example
    ├── package.json
    ├── seed.js
    └── server.js
```

## Tech stack

- Frontend demo: HTML5, CSS3, vanilla JavaScript (opens directly without build tools)
- Backend: Node.js, Express, Mongoose, CORS, dotenv
- Database: MongoDB (optional for the quick UI demo; required for persistent full-stack storage)

The assignment specifies React + Vite + Tailwind for the frontend. This ZIP prioritizes your requested workflow—open `index.html` and immediately see the working UI—while providing a separate Express/Mongoose backend. If strict React/Tailwind source compliance is required for code review, convert the UI into a Vite React app before final submission.
