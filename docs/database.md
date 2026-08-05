# Database Guide

## Engine and driver
- **Engine:** MySQL
- **Node driver:** `mysql2/promise`
- **Connection layer:** `server/db.js`

## Runtime defaults in code
`server/db.js` uses these defaults if env vars are not provided:
- Host: `localhost`
- Port: `3306`
- User: `root`
- Password: `admin12345`
- Database: `Escuela_Ingles`

> These defaults are convenient for local dev, but should be overridden via `.env` in real environments.

## Connection pool settings
- `waitForConnections: true`
- `connectionLimit: 10`
- `queueLimit: 0`

## Health check endpoint
Backend exposes:
- `GET /api/db-status`

It attempts:
- `SELECT VERSION()`
- `SHOW TABLES`

Response includes DB version, configured DB name, and table count.

## Docker database option
You can run MySQL in Docker (example):
```bash
docker run --name florence-mysql \
  -e MYSQL_ROOT_PASSWORD=your_password \
  -e MYSQL_DATABASE=Escuela_Ingles \
  -p 3306:3306 -d mysql:8
```

## Backup/restore (recommended)
Backup:
```bash
mysqldump -h localhost -u root -p Escuela_Ingles > florence_backup.sql
```
Restore:
```bash
mysql -h localhost -u root -p Escuela_Ingles < florence_backup.sql
```
