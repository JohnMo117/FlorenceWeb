# Configuration Reference

Create a `.env` file in the repository root.

## Required variables
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Escuela_Ingles
JWT_SECRET=replace_with_secure_value
```

## Variables used by code
- `PORT` → used in `server.js` (`process.env.PORT || 3000`)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` → used by `server/db.js`
- `NODE_ENV` → controls production static serving in `server.js`

## Security recommendations
- Never commit `.env`.
- Use strong, unique `JWT_SECRET`.
- Do not rely on fallback credentials from `server/db.js` in production.
- Restrict DB user permissions to minimum necessary scope.
