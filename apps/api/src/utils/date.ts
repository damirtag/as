export function reviveDates(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      obj[key] = new Date(value);
      continue;
    }

    if (typeof value === 'object') {
      obj[key] = reviveDates(value);
    }
  }

  return obj;
}