# Final Delivery Checklist

## 1) Code cleanup
- [ ] Remove obsolete commented blocks in active modules
- [ ] Remove duplicate/legacy server entry points if no longer required (`server2.js`, `testServer.js`)
- [ ] Remove debug logs not needed in production
- [ ] Standardize package manager lockfile strategy

## 2) Dependencies & versions
- [ ] Verify root and client dependencies are current and required
- [ ] Run `npm audit` (root + client)
- [ ] Pin production-critical versions if needed

## 3) Configuration
- [ ] Finalize `.env` per environment
- [ ] Secure JWT and DB credentials
- [ ] Remove fallback secrets from production usage

## 4) QA final testing
- [ ] Functional API/module tests
- [ ] UI flow tests
- [ ] Performance baseline tests
- [ ] Security test suite
- [ ] Defect closure and sign-off

## 5) Delivery
- [ ] Deploy release build
- [ ] Run smoke checks (`/api/status`, `/api/db-status`, main app flow)
- [ ] Deliver documentation package to final users/admins
- [ ] Confirm support/hypercare ownership window
