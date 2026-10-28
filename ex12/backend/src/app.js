import express from 'express';
import authenRoutes from './routes/authenRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import typeRoutes from './routes/typeRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use('/api/authen', authenRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/type', typeRoutes);
app.use('/api/users', userRoutes);
app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

app.use((error, request, response, next) => {
  if (response.headersSent) return next(error);
  const status = Number.isInteger(error.status) && error.status >= 400 && error.status < 500
    ? error.status
    : 500;
  if (status >= 500) {
    console.error(`API error for ${request.method} ${request.path}:`, error);
  }
  const message = error.type === 'entity.parse.failed'
    ? 'Request body must contain valid JSON.'
    : error.type === 'entity.too.large'
      ? 'Request body is too large.'
      : 'Request failed. Check the server terminal for the cause.';
  response.status(status).json({ error: message });
});

export default app;
