# API Routes Documentation

This document reflects routes mounted in `server.js`.

## Base API modules
- `/api/auth` → `server/routes/authRoutes.js`
- `/api/admin` → `server/routes/adminRoutes.js`
- `/api/teachers` → `server/routes/teacherRoutes.js`
- `/api/students` → `server/routes/studentRoutes.js`

## System/health endpoints
- `GET /api/status`
  - Returns API status and timestamp.

- `GET /api/db-status`
  - Validates MySQL connectivity.
  - Returns DB version, selected database name, and table count.

## Module-level route detail
Because endpoint-level definitions are in route files, keep this section updated whenever route handlers change:

### Auth routes (`authRoutes.js`)
- Authentication and token-related operations.

### Admin routes (`adminRoutes.js`)
- Admin management operations.

### Teacher routes (`teacherRoutes.js`)
- Teacher records and operations.

### Student routes (`studentRoutes.js`)
- Student records and operations.

## Recommended next step
Add a per-endpoint matrix (Method, Path, Auth, Request Body, Response, Errors) by extracting each route declaration from the four files above.
