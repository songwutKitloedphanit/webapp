import { pool } from '../db/pool.js';
import { readBearerToken, readUserId } from '../token.js';

export async function verifyToken(request, response, next) {
  const token = readBearerToken(request.headers.authorization);
  if (!token) return response.status(401).json({ error: 'Please log in first.' });

  const userId = readUserId(token);
  if (userId === null) return response.status(401).json({ error: 'Invalid or expired token. Please log in again.' });

  // Read the role from the database so a role change applies without a new token.
  const { rows } = await pool.query(
    'SELECT "userId", "userName", email, role FROM public.users WHERE "userId" = $1',
    [userId],
  );
  if (rows.length === 0) return response.status(401).json({ error: 'This account no longer exists.' });

  request.user = rows[0];
  next();
}

export function requireAdmin(request, response, next) {
  if (request.user?.role !== 'admin') {
    return response.status(403).json({ error: 'Only admins can do this.' });
  }
  next();
}
