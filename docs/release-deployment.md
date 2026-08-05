# Release & Deployment

## Release process
1. Code freeze and branch stabilization
2. Dependency and security review
3. QA final execution
4. Build frontend (`client/dist`)
5. Deploy backend + DB configuration
6. Post-deploy smoke tests
7. Hypercare monitoring period

## Pre-release checklist
- [ ] Remove dead/commented temporary code
- [ ] Verify `.env` values for target environment
- [ ] Confirm DB connectivity
- [ ] Complete docs updates
- [ ] Run lint/build checks in `client/`

## Deployment sequence (recommended)
1. Pull release commit/tag
2. Install root dependencies (`npm install`)
3. Install client dependencies and build frontend
4. Set `NODE_ENV=production`
5. Start backend process
6. Verify `/api/status` and `/api/db-status`
7. Open app and complete smoke flow

## Handover artifacts
- Updated README and docs/*
- Environment variable list
- Deployment steps
- QA report and known issues
