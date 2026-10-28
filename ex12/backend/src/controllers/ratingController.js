import { pool } from '../db/pool.js';
import { parsePositiveId, parseScore } from '../validation.js';

export async function getMyRatings(request, response) {
  const { rows } = await pool.query(
    'SELECT "menuId", score FROM public.rating WHERE "userId" = $1',
    [request.user.userId],
  );
  response.json(rows);
}

export async function rateMenu(request, response) {
  const menuId = parsePositiveId(request.params.menuId);
  const score = parseScore(request.body?.score);
  if (menuId === null) return response.status(400).json({ error: 'menuId must be a positive integer.' });
  if (score === null) return response.status(400).json({ error: 'score must be an integer from 1 to 5.' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO public.rating ("userId", "menuId", score) VALUES ($1, $2, $3)
       ON CONFLICT ("userId", "menuId") DO UPDATE SET score = EXCLUDED.score
       RETURNING "menuId", score`,
      [request.user.userId, menuId, score],
    );
    response.json(rows[0]);
  } catch (error) {
    if (error.code === '23503') return response.status(404).json({ error: 'Menu item not found.' });
    throw error;
  }
}
