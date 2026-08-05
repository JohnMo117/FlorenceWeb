# User Manual

## Accessing FlorenceWeb
1. Start backend and frontend services.
2. Open the frontend URL (typically `http://localhost:5173`).

## Logging in
- Use the login interface (`views/pages/login.ejs` legacy page or React login flow).
- Submit credentials.

## Main usage areas
- Student management
- Teacher management
- Admin operations
- Florence Connect / informational pages

## Typical workflow
1. Authenticate user.
2. Navigate to target module (students/teachers/admin).
3. Perform create/read/update/delete operations as permitted.
4. Confirm operation result and validation messages.

## If errors occur
- Retry action after confirming required fields.
- Check whether session token/authorization is still valid.
- Contact system administrator if persistent.
