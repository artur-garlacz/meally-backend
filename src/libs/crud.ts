export interface Crud<T> {
  upsert(item: T): Promise<T>;
  get(_: { id: string }): Promise<T | null>;
  getAll(): Promise<{ items: T[] }>;
  remove(_: { id: string }): Promise<void>;
}
