# Admin & Operations Guide

## Services to run
- Backend API (`server.js` via `npm run devStart`)
- Frontend app (`client` via `npm run dev` for development)
- MySQL database service

## Operational checks
- API health: `GET /api/status`
- DB health: `GET /api/db-status`

## Deployment model
### Development
- Backend and frontend run separately.
- CORS allows `http://localhost:5173`.

### Production
- Build frontend (`client/dist`).
- Run backend with `NODE_ENV=production`.
- Backend serves built frontend assets.

## Logging
- Backend logs to console by default.
- Capture stdout/stderr in your process manager.

## Security hardening checklist
- Set strong `JWT_SECRET`.
- Enforce HTTPS at reverse proxy.
- Add rate limiting middleware (not yet implemented).
- Add auth/authorization middleware consistently across all protected routes.
- Tighten CSP based on deployed asset origins.

## Rollback guidance
- Keep version tags per release.
- Roll back app code first.
- Restore DB backup only if schema/data issues require it.
