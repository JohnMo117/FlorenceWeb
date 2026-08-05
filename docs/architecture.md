# Architecture Overview

## High-level architecture
FlorenceWeb combines:
1. **Express API backend** (`server.js` + `server/routes/*`)
2. **React frontend** in `client/` (Vite)
3. **MySQL persistence layer** (`server/db.js`)
4. **EJS pages** under `views/` (legacy/support pages)

## Request flow
```txt
Client (React or API consumer)
        ↓ HTTP
Express app (server.js)
        ↓
Route modules (/api/auth, /api/admin, /api/teachers, /api/students)
        ↓
DB helper (server/db.js: query/execute)
        ↓
MySQL database
```

## Key backend components
- **`server.js`**
  - Sets security headers (CSP, frame options, etc.)
  - Applies CORS logic for `http://localhost:5173`
  - Parses JSON body
  - Serves static assets (`/public`)
  - Exposes health endpoints
  - Mounts route modules
  - Serves React build in production
  - Centralized error handler

- **`server/db.js`**
  - Creates MySQL connection pool
  - Exports `query()` and `execute()` helpers

- **`server/routes/*.js`**
  - `authRoutes.js`: authentication endpoints
  - `adminRoutes.js`: admin workflows
  - `teacherRoutes.js`: teacher-related workflows
  - `studentRoutes.js`: student-related workflows

## Frontend structure
- `client/src`: React source
- `client/public`: static frontend assets
- `client/vite.config.js`: Vite configuration

## Legacy/SSR pages
- `views/pages/*` includes:
  - `about.ejs`
  - `florenceConnect.ejs`
  - `login.ejs`
  - `students.ejs`
  - `teachers.ejs`
- `views/partials/*`: shared EJS fragments
