/**
 * FlorenceWeb — Authentication & Authorization Middleware
 *
 * Provides JWT token authentication and Role-Based Access Control (RBAC).
 */

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Secret key resolution (Multi-tiered fallback per secure coding guidelines)
function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  // Safe ephemeral secret fallback for dev/sandbox mode
  if (!global._ephemeralJwtSecret) {
    global._ephemeralJwtSecret = crypto.randomBytes(32).toString('hex');
    console.warn('SECURITY WARNING: Using ephemeral JWT secret for dev session.');
  }
  return global._ephemeralJwtSecret;
}

export const JWT_SECRET = getJwtSecret();

/**
 * Extract token from HttpOnly cookie or Authorization header.
 */
function extractToken(req) {
  // Check cookie header manually if cookie-parser is not used
  if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)session_token=([^;]+)/);
    if (match) return match[1];
  }
  // Check Authorization Bearer header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

/**
 * Middleware: Verify JWT access token.
 */
export function authenticateToken(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
    }
    req.user = user;
    next();
  });
}

/**
 * Middleware: Enforce Role-Based Access Control (RBAC).
 * @param {...string} allowedRoles - Array of permitted roles ('Admin', 'Teacher', 'Student')
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to access this resource.' });
    }
    next();
  };
}
