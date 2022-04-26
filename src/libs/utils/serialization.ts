export function serializeDate(d: Date | null): string | null {
  return d !== null ? d.toISOString() : null;
}

export function serializeJson(obj: object | null): string | null {
  return obj !== null ? JSON.stringify(obj) : null;
}
