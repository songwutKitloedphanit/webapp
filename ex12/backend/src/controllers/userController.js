import { pool } from '../db/pool.js';
import { parsePositiveId, parseRole } from '../validation.js';

export async function getUsers(_request, response) {
  const { rows } = await pool.query(
    'SELECT "userId", "userName", email, role FROM public.users ORDER BY "userId"',
  );
  response.json(rows);
}

export async function updateUserRole(request, response) {
  const userId = parsePositiveId(request.params.userId);
  const role = parseRole(request.body?.role);
  if (userId === null) return response.status(400).json({ error: 'userId must be a positive integer.' });
  if (!role) return response.status(400).json({ error: 'role must be user or admin.' });
  // Stops an admin from removing their own access and leaving nobody able to manage users.
  if (userId === request.user.userId) {
    return response.status(400).json({ error: 'You cannot change your own role.' });
  }

  const { rows } = await pool.query(
    'UPDATE public.users SET role = $1 WHERE "userId" = $2 RETURNING "userId", "userName", email, role',
    [role, userId],
  );
  if (rows.length === 0) return response.status(404).json({ error: 'User not found.' });
  response.json(rows[0]);
}
