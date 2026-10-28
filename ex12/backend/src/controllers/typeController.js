import { pool } from '../db/pool.js';
import { parsePositiveId, parseTypeName } from '../validation.js';

export async function getTypes(_request, response) {
  const { rows } = await pool.query(
    'SELECT "typeId", name FROM public."type" ORDER BY name, "typeId"',
  );
  response.json(rows);
}

export async function createType(request, response) {
  const name = parseTypeName(request.body?.name);
  if (!name) return response.status(400).json({ error: 'name must contain 1 to 100 characters.' });

  const { rows } = await pool.query(
    'INSERT INTO public."type" (name) VALUES ($1) RETURNING "typeId", name',
    [name],
  );
  response.status(201).json(rows[0]);
}

export async function updateType(request, response) {
  const typeId = parsePositiveId(request.params.typeId);
  const name = parseTypeName(request.body?.name);
  if (typeId === null) return response.status(400).json({ error: 'typeId must be a positive integer.' });
  if (!name) return response.status(400).json({ error: 'name must contain 1 to 100 characters.' });

  const { rows } = await pool.query(
    'UPDATE public."type" SET name = $1 WHERE "typeId" = $2 RETURNING "typeId", name',
    [name, typeId],
  );
  if (rows.length === 0) return response.status(404).json({ error: 'Type not found.' });
  response.json(rows[0]);
}

export async function deleteType(request, response) {
  const typeId = parsePositiveId(request.params.typeId);
  if (typeId === null) return response.status(400).json({ error: 'typeId must be a positive integer.' });

  try {
    const result = await pool.query('DELETE FROM public."type" WHERE "typeId" = $1', [typeId]);
    if (result.rowCount === 0) return response.status(404).json({ error: 'Type not found.' });
    response.status(204).end();
  } catch (error) {
    if (error.code === '23503') {
      return response.status(409).json({ error: 'This type is used by menu items and cannot be deleted.' });
    }
    throw error;
  }
}
