# Testing Guide

## Current test status
- Root `npm test` is currently a placeholder and does not run test suites.

## Recommended final QA test plan

### 1. Functional tests
- Auth flows:
  - Valid login
  - Invalid login
  - Unauthorized access to protected resources
- CRUD flows for:
  - Students
  - Teachers
  - Admin-managed entities
- Health endpoints:
  - `/api/status`
  - `/api/db-status`

### 2. API validation tests
- Input validation for malformed payloads
- Missing required fields
- Boundary values
- Error message consistency

### 3. UI tests
- Navigation across main screens
- Form behavior and feedback states
- Responsive layout checks (mobile/tablet/desktop)

### 4. Performance tests
- Baseline response time for key endpoints
- Concurrent requests to student/teacher listing routes
- Frontend build size and first-load timing

### 5. Security tests
- JWT/token misuse scenarios
- SQL injection attempts on query parameters/body
- XSS checks on text input/output rendering
- CORS behavior from disallowed origins

## Results documentation template
For every executed case record:
- Test ID
- Module
- Scenario
- Expected Result
- Actual Result
- Status (Pass/Fail)
- Defect Reference
