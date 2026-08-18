class SimpleLRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxCapacity: number;

  constructor(maxCapacity = 200) {
    this.maxCapacity = maxCapacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxCapacity) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

export const responseCache = new SimpleLRUCache<string, string>(500);

export async function executeWithConcurrencyQueue<T>(
  cacheKey: string | null,
  fn: () => Promise<T>
): Promise<T> {
  if (cacheKey) {
    const cached = responseCache.get(cacheKey);
    if (cached !== undefined) {
      return cached as unknown as T;
    }
  }

  const result = await fn();

  if (cacheKey && typeof result === 'string') {
    responseCache.set(cacheKey, result);
  }

  return result;
}
