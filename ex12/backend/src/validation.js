export function parsePositiveId(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const text = String(value);
  if (!/^[1-9]\d*$/.test(text)) return null;

  const id = Number(text);
  return Number.isSafeInteger(id) ? id : null;
}

export function parseMenuName(value) {
  if (typeof value !== 'string') return null;
  const name = value.trim();
  return name.length > 0 && name.length <= 150 ? name : null;
}

export function parseTypeName(value) {
  if (typeof value !== 'string') return null;
  const name = value.trim();
  return name.length > 0 && name.length <= 100 ? name : null;
}

export function parsePrice(value) {
  if (typeof value !== 'string' && typeof value !== 'number') return null;
  const text = String(value).trim();
  if (!/^\d{1,8}(?:\.\d{1,2})?$/.test(text)) return null;
  return Number(text).toFixed(2);
}

export function parseBoolean(value) {
  return typeof value === 'boolean' ? value : null;
}

export function parseUserName(value) {
  if (typeof value !== 'string') return null;
  const userName = value.trim();
  return /^[A-Za-z0-9_.-]{3,50}$/.test(userName) ? userName : null;
}

export function parseEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return email.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

// bcrypt only uses the first 72 bytes of a password.
export function parsePassword(value) {
  if (typeof value !== 'string') return null;
  const bytes = Buffer.byteLength(value, 'utf8');
  return value.length >= 8 && bytes <= 72 ? value : null;
}

export function parseRole(value) {
  return value === 'user' || value === 'admin' ? value : null;
}

export function parseScore(value) {
  return Number.isInteger(value) && value >= 1 && value <= 5 ? value : null;
}
