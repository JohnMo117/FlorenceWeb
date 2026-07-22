/**
 * FlorenceWeb — Express server entry point
 *
 * Mounts the three API route modules (admin, teachers, students) and serves
 * the React client in production mode.
 *
 * TODO(security): Add JWT authentication middleware when auth is implemented.
 * TODO(security): Add CSRF protection when cookie-based auth is used.
 * TODO(security): Add rate limiting (e.g., express-rate-limit) to all API routes.
 * TODO(security): Enforce HTTPS in production.
 * TODO(security): Use a secrets manager for JWT_SECRET in production; never store on disk.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import pool, { query } from './server/db.js';

// Route modules
import authRoutes from './server/routes/authRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import teacherRoutes from './server/routes/teacherRoutes.js';
import studentRoutes from './server/routes/studentRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Expose connection pool globally on app
app.set('dbPool', pool);

// ─── Security headers middleware ────────────────────────────────────────────
app.use((_req, res, next) => {
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Basic CSP — restrict sources to self
  // TODO(security): Tighten CSP policy further based on production asset origins.
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; object-src 'none'; frame-ancestors 'none';"
  );
  // Disable unused browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// ─── CORS middleware (development) ──────────────────────────────────────────
// TODO(security): In production, update allowed origins or remove CORS entirely if served from the same origin.
const ALLOWED_ORIGINS = ['http://localhost:5173'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// ─── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));

// ─── Serve static files ─────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── API status endpoint ────────────────────────────────────────────────────
app.get('/api/status', (_req, res) => {
  res.json({ status: 'API is running', timestamp: new Date().toISOString() });
});

// ─── Database health check endpoint ─────────────────────────────────────────
app.get('/api/db-status', async (_req, res) => {
  try {
    const [rows] = await query('SELECT VERSION() AS version');
    const [tables] = await query("SHOW TABLES");
    res.json({
      status: 'Connected to MySQL',
      version: rows[0]?.version || 'Unknown',
      database: process.env.DB_NAME || 'Escuela_Ingles',
      tableCount: tables.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database health check failed:', error.message);
    res.status(503).json({
      status: 'Database connection failed',
      error: 'Unable to connect to MySQL database.',
      timestamp: new Date().toISOString(),
    });
  }
});

// ─── Mount route modules ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentRoutes);

// ─── Production: serve React client ─────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.send(
      'FlorenceWeb API is running. In development, start the Vite dev server (cd client && npm run dev).'
    );
  });
}

// ─── Centralized error handler ──────────────────────────────────────────────
// Generic error response — never expose internal details to the client.
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'An internal server error occurred.' });
});

// ─── Start server on localhost ──────────────────────────────────────────────
// Listening on 127.0.0.1, not 0.0.0.0, per security guidelines.
app.listen(port, '127.0.0.1', () => {
  console.log(`FlorenceWeb server running on http://127.0.0.1:${port}`);
});