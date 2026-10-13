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
