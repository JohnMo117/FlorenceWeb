# FlorenceWeb

System to manage Florence.

## Overview
FlorenceWeb is a full-stack web system with:
- **Express API backend** (`server.js`, `server/routes/*`)
- **React + Vite frontend** (`client/`)
- **Legacy/auxiliary EJS views** (`views/`)
- **MySQL database access** via `mysql2/promise` (`server/db.js`)

The backend exposes auth/admin/teacher/student APIs and, in production, serves the built React app from `client/dist`.

## Tech Stack
- **Backend:** Node.js (ES Modules), Express 5
- **Database:** MySQL (`mysql2` connection pool)
- **Auth/Security libs:** `jsonwebtoken`, `bcryptjs`
- **Frontend:** React 19, React Router, Vite
- **Templating (legacy pages):** EJS

## Repository Structure
```txt
FlorenceWeb/
├─ server.js                      # Main Express entry point
├─ server2.js                     # Alternate/legacy server file
├─ testServer.js                  # Test/auxiliary server file
├─ package.json                   # Root backend dependencies/scripts
├─ server/
│  ├─ db.js                       # MySQL pool and query helpers
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  ├─ adminRoutes.js
│  │  ├─ teacherRoutes.js
│  │  └─ studentRoutes.js
│  ├─ middleware/
│  ├─ db/
│  └─ data/
├─ client/                        # React + Vite frontend app
│  ├─ package.json
│  ├─ src/
│  └─ public/
├─ views/
│  ├─ index.ejs
│  ├─ test.ejs
│  ├─ pages/
│  │  ├─ about.ejs
│  │  ├─ florenceConnect.ejs
│  │  ├─ login.ejs
│  │  ├─ students.ejs
│  │  └─ teachers.ejs
│  └─ partials/
└─ public/                        # Server static assets
```

## Requirements
- Node.js LTS (recommended 20.x+)
- npm
- MySQL 8+ (local install or Dockerized)

## Backend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` in repo root (see `docs/configuration.md`).
3. Run backend in dev mode:
   ```bash
   npm run devStart
   ```
4. API runs at `http://127.0.0.1:3000` by default.

## Frontend Setup (React app)
1. Enter client folder and install dependencies:
   ```bash
   cd client
   npm install
   ```
2. Start Vite dev server:
   ```bash
   npm run dev
   ```
3. Default local URL is typically `http://localhost:5173`.

## Production Behavior
- If `NODE_ENV=production`, backend serves static files from `client/dist`.
- Build frontend first:
  ```bash
  cd client
  npm run build
  ```

## Available Scripts
### Root (`package.json`)
- `npm run devStart` → Start Express with nodemon (`server.js`)
- `npm test` → Placeholder test command (currently not implemented)

### Client (`client/package.json`)
- `npm run dev` → Start Vite dev server
- `npm run build` → Build React app to `client/dist`
- `npm run preview` → Preview built app
- `npm run lint` → Run ESLint

## API Base Routes
Mounted in `server.js`:
- `/api/auth`
- `/api/admin`
- `/api/teachers`
- `/api/students`

Health endpoints:
- `GET /api/status`
- `GET /api/db-status`

## Documentation
- `docs/installation.md`
- `docs/architecture.md`
- `docs/configuration.md`
- `docs/database.md`
- `docs/api-routes.md`
- `docs/user-manual.md`
- `docs/admin-operations.md`
- `docs/testing.md`
- `docs/release-deployment.md`
- `docs/changelog.md`
- `docs/final-delivery-checklist.md`

## Notes
- Root includes both `package-lock.json` and `pnpm-lock.yaml`; standardize on one package manager for consistency.
- `server/db.js` currently has fallback defaults for DB credentials; use environment variables in all environments.
