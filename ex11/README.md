# EX11: Full-stack menu

This exercise contains a separate copy of the React frontend from EX9 and the Express/PostgreSQL backend from EX10. The menu page uses the backend API for reads and changes; it does not modify the original EX9 or EX10 source files.

## Start the backend

1. Open PowerShell in `C:\class4-1\webapp\ex11\backend`.
2. Install its packages with `npm install`.
3. Copy `.env.example` to `.env` and set `DATABASE_URL` for the PostgreSQL database.
4. If the database does not have the `menu` and `type` tables, use `import.sql` to create them. The menu form also needs at least one menu type.
5. Start the API with `npm run dev:server`. It listens on port `3000` by default.

## Start the frontend

1. Open another PowerShell window in `C:\class4-1\webapp\ex11\frontend`.
2. Install its packages with `npm install`.
3. Start the frontend with `npm run dev`.

The Vite development server forwards `/api` requests to the backend at `http://localhost:3000`.

## Tests

From `frontend`, run `node --test render.test.mjs src/menuApi.test.mjs`.
