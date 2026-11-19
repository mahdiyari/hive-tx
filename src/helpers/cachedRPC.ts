import { callRPC } from './call.js'

/** Long enough to share data between back-to-back calls, short next to Hive's 3s block time */
const CACHE_MS = 2000

const cache = new Map<string, { time: number; result: Promise<unknown> }>()

/**
 * `callRPC` with a short cache. Concurrent callers share one request; failures are not cached.
 */
export const cachedRPC = <T = any>(method: string, params: unknown[] | object = []): Promise<T> => {
  const key = method + JSON.stringify(params)
  const now = Date.now()
  const hit = cache.get(key)
  if (hit && now - hit.time <= CACHE_MS) {
    return hit.result as Promise<T>
  }
  // Drop expired entries so lookups of many accounts do not pile up
  for (const [k, entry] of cache) {
    if (now - entry.time > CACHE_MS) cache.delete(k)
  }
  const result = callRPC<T>(method, params)
  cache.set(key, { time: now, result })
  result.catch(() => cache.delete(key))
  return result
}

/** An account object you already have, or the account fetched by name */
export const fetchAccount = async <T extends object>(account: string | T): Promise<T> => {
  if (typeof account !== 'string') return account
  const [found] = await cachedRPC<T[]>('condenser_api.get_accounts', [[account]])
  if (!found) throw new Error(`Account not found: ${account}`)
  return found
}
