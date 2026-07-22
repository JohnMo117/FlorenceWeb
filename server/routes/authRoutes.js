/**
 * Authentication API routes
 * Mounted at /api/auth
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, execute } from '../db.js';
import { JWT_SECRET, authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

const VALID_ROLES = ['Admin', 'Teacher', 'Student'];

function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function generateId(prefix = '') {
  return `${prefix}${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Helper to set secure session cookie.
 */
function setSessionCookie(res, token) {
  res.cookie?.('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }) ||
  res.setHeader(
    'Set-Cookie',
    `session_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );
}

/**
 * POST /api/auth/register
 * Register a new user (Student, Teacher, or Admin).
 */
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role, englishLevel } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    if (role && !VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(', ')}` });
    }

    const assignedRole = role || 'Student';
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Check if user already exists
    const [existing] = await query('SELECT id FROM users WHERE email = ?', [trimmedEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = generateId('usr-');
    let refId = null;

    // Create linked profile for Student or Teacher
    if (assignedRole === 'Teacher') {
      refId = generateId('T');
      await execute(
        'INSERT INTO teachers (id, name, email, subject) VALUES (?, ?, ?, ?)',
        [refId, trimmedName, trimmedEmail, 'English']
      );
    } else if (assignedRole === 'Student') {
      refId = generateId('S');
      const level = englishLevel && ['A1', 'A2', 'B1', 'B2', 'C1'].includes(englishLevel) ? englishLevel : 'A1';
      await execute(
        'INSERT INTO students (id, name, email, english_level) VALUES (?, ?, ?, ?)',
        [refId, trimmedName, trimmedEmail, level]
      );
    }

    // Insert user record
    const username = trimmedEmail.split('@')[0];
    await execute(
      `INSERT INTO users (id, username, email, password_hash, role, ref_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, username, trimmedEmail, passwordHash, assignedRole, refId]
    );

    // Issue JWT token
    const tokenPayload = {
      id: userId,
      username,
      email: trimmedEmail,
      name: trimmedName,
      role: assignedRole,
      refId,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h', algorithm: 'HS256' });
    setSessionCookie(res, token);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: userId,
        name: trimmedName,
        email: trimmedEmail,
        role: assignedRole,
        refId,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Log in with email and password.
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid email or password format.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query user by email
    const [rows] = await query(
      `SELECT u.id, u.username, u.email, u.password_hash, u.role, u.ref_id,
              COALESCE(t.name, s.name, u.username) AS name
       FROM users u
       LEFT JOIN teachers t ON u.ref_id = t.id AND u.role = 'Teacher'
       LEFT JOIN students s ON u.ref_id = s.id AND u.role = 'Student'
       WHERE u.email = ?`,
      [trimmedEmail]
    );

    if (rows.length === 0) {
      // Generic error response to prevent user enumeration
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      refId: user.ref_id,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h', algorithm: 'HS256' });
    setSessionCookie(res, token);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        refId: user.ref_id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Log out and clear session cookie.
 */
router.post('/logout', (_req, res) => {
  res.setHeader(
    'Set-Cookie',
    'session_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
  );
  res.json({ message: 'Logged out successfully.' });
});

/**
 * GET /api/auth/me
 * Get current authenticated user profile.
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
