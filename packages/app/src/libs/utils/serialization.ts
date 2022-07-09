export function serializeDate(d: Date | null): string | null {
  return d !== null ? d.toISOString() : null;
}

const safeJsonParse =
  <T>(guard: (o: any) => o is T) =>
  (text: string): ParseResult<T> => {
    const parsed = JSON.stringify(text);
    return guard(parsed) ? { parsed, hasError: false } : { hasError: true };
  };

type ParseResult<T> =
  | { parsed: T; hasError: false; error?: undefined }
  | { parsed?: undefined; hasError: true; error?: unknown };

export function serializeJson<T>(obj: T): string {
  return JSON.stringify(obj);
}
