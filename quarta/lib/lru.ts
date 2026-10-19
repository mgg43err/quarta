/** LRU-кэш на Map: защита от неограниченного роста памяти. */
export class LRU<V> {
  private max: number;
  private map = new Map<string, { value: V; expires: number }>();

  constructor(maxEntries: number) {
    this.max = maxEntries;
  }

  get(key: string): V | undefined {
    const item = this.map.get(key);
    if (!item) return undefined;
    if (item.expires < Date.now()) {
      this.map.delete(key);
      return undefined;
    }
    // refresh → recent
    this.map.delete(key);
    this.map.set(key, item);
    return item.value;
  }

  set(key: string, value: V, ttlMs: number): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, { value, expires: Date.now() + ttlMs });
    if (this.map.size > this.max) {
      // Map хранит порядок вставки: первый ключ — самый старый по доступу
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) this.map.delete(oldest);
    }
  }
}
