import jwt from 'jsonwebtoken';

function getJwtKey() {
  const key = process.env.JWT_KEY?.trim();
  if (!key) throw new Error('Missing JWT_KEY. Add a long random JWT_KEY to backend/.env.');
  return key;
}

export function signToken(userId) {
  return jwt.sign({ userId }, getJwtKey(), { expiresIn: '1h' });
}

// Returns the userId stored in the token, or null when the token is invalid or expired.
export function readUserId(token) {
  try {
    const payload = jwt.verify(token, getJwtKey());
    return Number.isSafeInteger(payload.userId) && payload.userId > 0 ? payload.userId : null;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) return null;
    throw error;
  }
}

export function readBearerToken(header) {
  if (typeof header !== 'string') return null;
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' && token && token !== 'null' ? token : null;
}
