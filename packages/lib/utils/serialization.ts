export function serializeDate(d: Date | null): string | null {
  return d !== null ? d.toISOString() : null;
}

export function serializeJson<T>(obj: T): string {
  return JSON.stringify(obj);
}
