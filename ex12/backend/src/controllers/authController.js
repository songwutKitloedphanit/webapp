import bcrypt from 'bcrypt';
import { pool } from '../db/pool.js';
import { signToken } from '../token.js';
import { parseEmail, parsePassword, parseUserName } from '../validation.js';

export async function register(request, response) {
  const userName = parseUserName(request.body?.userName);
  const email = parseEmail(request.body?.email);
  const password = parsePassword(request.body?.password);

  if (!userName) return response.status(400).json({ error: 'userName must be 3 to 50 letters, numbers, dots, dashes, or underscores.' });
  if (!email) return response.status(400).json({ error: 'email must be a valid email address.' });
  if (!password) return response.status(400).json({ error: 'password must contain at least 8 characters and at most 72 bytes.' });

  const { rows } = await pool.query(
    'SELECT 1 FROM public.users WHERE "userName" = $1 OR email = $2',
    [userName, email],
  );
  if (rows.length > 0) return response.status(409).json({ error: 'Duplicate Username or Email' });

  const hashPassword = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      'INSERT INTO public.users ("userName", email, password) VALUES ($1, $2, $3)',
      [userName, email, hashPassword],
    );
  } catch (error) {
    // Another request may register the same name between the check and the insert.
    if (error.code === '23505') return response.status(409).json({ error: 'Duplicate Username or Email' });
    throw error;
  }
  response.status(201).json({ message: 'User created successfully' });
}

export async function login(request, response) {
  const { userName, password } = request.body ?? {};
  if (typeof userName !== 'string' || typeof password !== 'string') {
    return response.status(400).json({ error: 'userName and password are required.' });
  }

  const { rows } = await pool.query(
    'SELECT "userId", password FROM public.users WHERE "userName" = $1',
    [userName.trim()],
  );
  if (rows.length === 0) return response.status(404).json({ error: 'Unknown Username' });

  const isMatch = await bcrypt.compare(password, rows[0].password);
  if (!isMatch) return response.status(404).json({ error: 'Password Incorrect' });

  response.status(200).json({ message: 'Login Success', token: signToken(rows[0].userId) });
}

export function home(request, response) {
  response.status(200).json({ user: request.user });
}
