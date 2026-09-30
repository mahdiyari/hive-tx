const MAX_ENTRIES = 100

interface CacheEntry {
  value: unknown
  storedAt: number
}

const store = new Map<string, CacheEntry>()

const stableStringify = (value: unknown): string => {
  if (Array.isArray(value)) {
    return '[' + value.map((item) => stableStringify(item)).join(',') + ']'
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const keys = Object.keys(record).sort()
    return (
      '{' +
      keys.map((key) => JSON.stringify(key) + ':' + stableStringify(record[key])).join(',') +
      '}'
    )
  }
  return JSON.stringify(value) ?? 'undefined'
}

const cloneValue = <T>(value: T): T => {
  if (typeof structuredClone !== 'function') {
    return value
  }
  try {
    return structuredClone(value)
  } catch {
    return value
  }
}

/** Stable cache key for a JSON-RPC method and its params. */
export const callCacheKey = (method: string, params: unknown) => {
  return method + ':' + stableStringify(params)
}

/**
 * Read a cached JSON-RPC result.
 * `undefined` means a miss. A cached `null` result is returned as `null`.
 */
export const readCallCache = <T>(key: string, ttl: number): T | undefined => {
  if (ttl <= 0) {
    return undefined
  }
  const entry = store.get(key)
  if (!entry) {
    return undefined
  }
  if (Date.now() - entry.storedAt > ttl) {
    store.delete(key)
    return undefined
  }
  return cloneValue(entry.value) as T
}

/** Store a JSON-RPC result. The oldest entry is dropped after {@link MAX_ENTRIES}. */
export const writeCallCache = (key: string, value: unknown) => {
  if (store.has(key)) {
    store.delete(key)
  }
  store.set(key, { value: cloneValue(value), storedAt: Date.now() })
  while (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value
    if (oldest === undefined) {
      break
    }
    store.delete(oldest)
  }
}

/** Drop every cached JSON-RPC result. */
export const clearCallCache = () => {
  store.clear()
}
