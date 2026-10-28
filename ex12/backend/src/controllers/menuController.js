import { pool } from '../db/pool.js';
import { parseBoolean, parseMenuName, parsePositiveId, parsePrice } from '../validation.js';

function menuQuery(where = '') {
  return `
    SELECT m."menuId", m.name, m.price,
      m."isBestSeller", t."typeId" AS "typeId", t.name AS "typeName",
      ROUND(AVG(r.score), 1) AS "avgRating", COUNT(r.score)::int AS "ratingCount"
    FROM public.menu AS m
    INNER JOIN public."type" AS t ON t."typeId" = m."typeId"
    LEFT JOIN public.rating AS r ON r."menuId" = m."menuId"
    ${where}
    GROUP BY m."menuId", t."typeId"
  `;
}

function toMenu(row) {
  return {
    ...row,
    price: Number(row.price),
    isBestSeller: Boolean(row.isBestSeller),
    avgRating: row.avgRating === null ? null : Number(row.avgRating),
  };
}

async function findMenu(id) {
  const { rows } = await pool.query(menuQuery('WHERE m."menuId" = $1'), [id]);
  return rows[0] ? toMenu(rows[0]) : null;
}

export async function getMenus(_request, response) {
  const { rows } = await pool.query(`${menuQuery()} ORDER BY m."menuId" DESC`);
  response.json(rows.map(toMenu));
}

export async function createMenu(request, response) {
  const name = parseMenuName(request.body?.name);
  const price = parsePrice(request.body?.price);
  const typeId = parsePositiveId(request.body?.typeId);
  const bestSeller = request.body?.isBestSeller === undefined
    ? false
    : parseBoolean(request.body.isBestSeller);

  if (!name) return response.status(400).json({ error: 'name must contain 1 to 150 characters.' });
  if (price === null) return response.status(400).json({ error: 'price must be a non-negative amount with up to 2 decimal places.' });
  if (typeId === null) return response.status(400).json({ error: 'typeId must be a positive integer.' });
  if (bestSeller === null) return response.status(400).json({ error: 'isBestSeller must be a boolean.' });

  try {
    const { rows } = await pool.query(
      'INSERT INTO public.menu (name, price, "isBestSeller", "typeId") VALUES ($1, $2, $3, $4) RETURNING "menuId"',
      [name, price, bestSeller, typeId],
    );
    response.status(201).json(await findMenu(rows[0].menuId));
  } catch (error) {
    if (error.code === '23503') {
      return response.status(400).json({ error: 'typeId does not refer to an existing type.' });
    }
    throw error;
  }
}

export async function updateMenu(request, response) {
  const menuId = parsePositiveId(request.params.menuId);
  if (menuId === null) return response.status(400).json({ error: 'menuId must be a positive integer.' });
  if (!request.body || typeof request.body !== 'object' || Array.isArray(request.body)) {
    return response.status(400).json({ error: 'Request body must be a JSON object.' });
  }

  const assignments = [];
  const values = [];
  if (Object.hasOwn(request.body, 'name')) {
    const name = parseMenuName(request.body.name);
    if (!name) return response.status(400).json({ error: 'name must contain 1 to 150 characters.' });
    values.push(name);
    assignments.push(`name = $${values.length}`);
  }
  if (Object.hasOwn(request.body, 'price')) {
    const price = parsePrice(request.body.price);
    if (price === null) return response.status(400).json({ error: 'price must be a non-negative amount with up to 2 decimal places.' });
    values.push(price);
    assignments.push(`price = $${values.length}`);
  }
  if (Object.hasOwn(request.body, 'isBestSeller')) {
    const bestSeller = parseBoolean(request.body.isBestSeller);
    if (bestSeller === null) return response.status(400).json({ error: 'isBestSeller must be a boolean.' });
    values.push(bestSeller);
    assignments.push(`"isBestSeller" = $${values.length}`);
  }
  if (Object.hasOwn(request.body, 'typeId')) {
    const typeId = parsePositiveId(request.body.typeId);
    if (typeId === null) return response.status(400).json({ error: 'typeId must be a positive integer.' });
    values.push(typeId);
    assignments.push(`"typeId" = $${values.length}`);
  }
  if (assignments.length === 0) {
    return response.status(400).json({ error: 'Provide name, price, isBestSeller, or typeId to update.' });
  }

  const existing = await findMenu(menuId);
  if (!existing) return response.status(404).json({ error: 'Menu item not found.' });

  try {
    await pool.query(
      `UPDATE public.menu SET ${assignments.join(', ')} WHERE "menuId" = $${values.length + 1}`,
      [...values, menuId],
    );
    response.json(await findMenu(menuId));
  } catch (error) {
    if (error.code === '23503') {
      return response.status(400).json({ error: 'typeId does not refer to an existing type.' });
    }
    throw error;
  }
}

export async function deleteMenu(request, response) {
  const menuId = parsePositiveId(request.params.menuId);
  if (menuId === null) return response.status(400).json({ error: 'menuId must be a positive integer.' });

  const result = await pool.query('DELETE FROM public.menu WHERE "menuId" = $1', [menuId]);
  if (result.rowCount === 0) return response.status(404).json({ error: 'Menu item not found.' });
  response.status(204).end();
}
