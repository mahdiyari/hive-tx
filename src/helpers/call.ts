import { config } from '../config'
import { APIMethods, APIPaths, CallResponse } from '../types'
import { sleep } from './sleep'

// ── Error Types ─────────────────────────────────────────────────────────────

export class RPCError extends Error {
  name = 'RPCError'
  data?: any
  code: number
  stack: undefined = undefined
  constructor(rpcError: { message: string; code: number; data?: any }) {
    super(rpcError.message)
    this.code = rpcError.code
    if ('data' in rpcError) {
      this.data = rpcError.data
    }
  }
}

/**
 * Transport-level error thrown by jsonRPCCall for HTTP status errors (429, 503).
 * Carries node identity and rate-limit info so callers can record health
 * exactly once without double-counting.
 */
class NodeError extends Error {
  node: string
  rateLimitMs: number
  constructor(node: string, message: string, rateLimitMs = 0) {
    super(message)
    this.node = node
    this.rateLimitMs = rateLimitMs
  }
}

/** Errors that indicate the request definitely never reached the server. */
const PRE_CONNECTION_ERRORS = ['ECONNREFUSED', 'ENOTFOUND', 'EHOSTUNREACH', 'EAI_AGAIN']

/**
 * Check if an error is a pre-connection error (request never reached server).
 *
 * Node.js fetch wraps connection failures as TypeError('fetch failed') with
 * the real error code nested in the cause chain: e.cause.code, e.cause.cause.code, etc.
 * We walk up to 5 levels deep to find the actual code.
 */
function isPreConnectionError(e: any): boolean {
  if (!e) return false
  const parts: string[] = [String(e.message || ''), String(e.code || '')]
  let cause = e.cause
  for (let depth = 0; cause && depth < 5; depth++) {
    parts.push(String(cause.code || ''), String(cause.message || ''))
    cause = cause.cause
  }
  const combined = parts.join(' ')
  return PRE_CONNECTION_ERRORS.some((code) => combined.includes(code))
}

// ── Node Health Tracker ─────────────────────────────────────────────────────

interface NodeHealth {
  consecutiveFailures: number
  lastFailureTime: number
  rateLimitedUntil: number
}

class NodeHealthTracker {
  private health = new Map<string, NodeHealth>()

  private getOrCreate(node: string): NodeHealth {
    let h = this.health.get(node)
    if (!h) {
      h = { consecutiveFailures: 0, lastFailureTime: 0, rateLimitedUntil: 0 }
      this.health.set(node, h)
    }
    return h
  }

  recordSuccess(node: string): void {
    const h = this.getOrCreate(node)
    h.consecutiveFailures = 0
  }

  recordFailure(node: string): void {
    const h = this.getOrCreate(node)
    h.consecutiveFailures++
    h.lastFailureTime = Date.now()
  }

  recordRateLimit(node: string, retryAfterMs = 10_000): void {
    const h = this.getOrCreate(node)
    h.rateLimitedUntil = Date.now() + retryAfterMs
    h.consecutiveFailures++
    h.lastFailureTime = Date.now()
  }

  isNodeHealthy(node: string): boolean {
    const h = this.health.get(node)
    if (!h) return true // unknown nodes assumed healthy

    // Rate-limited and cooldown hasn't expired
    if (h.rateLimitedUntil > Date.now()) return false

    // Too many consecutive failures within the last 30 seconds
    if (h.consecutiveFailures >= 3 && Date.now() - h.lastFailureTime < 30_000) return false

    return true
  }

  /** Return nodes sorted: healthy first (preserving order), unhealthy appended. */
  getOrderedNodes(nodes: string[]): string[] {
    const healthy: string[] = []
    const unhealthy: string[] = []
    for (const node of nodes) {
      if (this.isNodeHealthy(node)) {
        healthy.push(node)
      } else {
        unhealthy.push(node)
      }
    }
    return [...healthy, ...unhealthy]
  }
}

const rpcHealthTracker = new NodeHealthTracker()
const restHealthTracker = new NodeHealthTracker()

// ── Internal helpers ────────────────────────────────────────────────────────

/** Record a caught error on the health tracker (handles NodeError to avoid double-counting). */
function recordError(tracker: NodeHealthTracker, node: string, e: any): void {
  if (e instanceof NodeError) {
    if (e.rateLimitMs > 0) {
      tracker.recordRateLimit(node, e.rateLimitMs)
    } else {
      tracker.recordFailure(node)
    }
  } else {
    tracker.recordFailure(node)
  }
}

/**
 * Low-level JSON-RPC call to a single node. No failover.
 * Throws RPCError for blockchain rejections, NodeError for HTTP 429/503,
 * and generic Error for other transport failures.
 * @param shouldRetry - If true, retries once on the same node for transient errors.
 */
const jsonRPCCall = async (
  url: string,
  method: string,
  params: any,
  timeout = config.timeout,
  shouldRetry = false
) => {
  const id = Math.floor(Math.random() * 100_000_000)
  const body = {
    jsonrpc: '2.0',
    method,
    params,
    id
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(timeout)
    })

    // Handle HTTP-level errors before parsing JSON.
    // Throw NodeError so callers can record health exactly once.
    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After')
      const cooldownMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 10_000
      throw new NodeError(url, `HTTP 429 Rate Limited`, cooldownMs)
    }
    if (res.status === 503) {
      throw new NodeError(url, `HTTP 503 Service Unavailable`)
    }

    const result = (await res.json()) as CallResponse
    if (
      !result ||
      typeof result.id === 'undefined' ||
      result.id !== id ||
      result.jsonrpc !== '2.0'
    ) {
      throw new Error('JSONRPC id mismatch')
    }
    if ('result' in result) {
      return result.result
    }
    if ('error' in result) {
      const e = result.error
      if ('message' in e && 'code' in e) {
        throw new RPCError(e)
      }
      throw result.error
    }
    // No result and no error?
    throw result
  } catch (e) {
    if (e instanceof RPCError) {
      throw e
    }
    // NodeError should not be retried on the same node - it's an HTTP status issue
    if (e instanceof NodeError) {
      throw e
    }
    if (shouldRetry) {
      return jsonRPCCall(url, method, params, timeout, false)
    }
    throw e
  }
}

/** Small jitter delay between failover attempts to prevent thundering herd. */
function jitterDelay(): Promise<void> {
  return sleep(50 + Math.random() * 50)
}

// ── Public API: callRPC ─────────────────────────────────────────────────────

/**
 * Makes API calls to Hive blockchain nodes with automatic retry and failover support.
 * Uses per-request retry counters, node health tracking, jitter between retries,
 * and HTTP status awareness (429 rate limiting, 503).
 *
 * If the current node fails, it will automatically try the next healthy node.
 * When all nodes have been tried, wraps around to give earlier nodes another chance
 * until the full retry budget (config.retry) is exhausted.
 * RPCErrors (valid blockchain rejections) are never retried.
 *
 * @param method - The API method name (e.g., 'condenser_api.get_accounts')
 * @param params - Parameters for the API method as array or object
 * @param timeout - Request timeout in milliseconds (default: config.timeout)
 * @param retry - Maximum number of retry attempts (default: config.retry)
 * @returns Promise resolving to the API response
 * @throws {RPCError} On blockchain-level errors (bad params, missing authority, etc.)
 * @throws {Error} If all retry attempts fail
 *
 * @example
 * ```typescript
 * import { callRPC } from 'hive-tx'
 *
 * // Get account information
 * const accounts = await callRPC('condenser_api.get_accounts', [['alice']])
 *
 * // Custom timeout and retry settings
 * const data = await callRPC('condenser_api.get_content', ['alice', 'test-post'], 10_000, 5)
 * ```
 */
export const callRPC = async <T = any>(
  method: string,
  params: any[] | object = [],
  timeout = config.timeout,
  retry = config.retry
): Promise<T> => {
  if (!Array.isArray(config.nodes)) {
    throw new Error('config.nodes is not an array')
  }
  if (config.nodes.length === 0) {
    throw new Error('config.nodes is empty')
  }
  // Track nodes tried in the current round. When all nodes have been tried,
  // clear the set to allow a second round (wrap-around) using the retry budget.
  const triedInRound = new Set<string>()
  let lastError: any

  for (let attempt = 0; attempt <= retry; attempt++) {
    // Re-evaluate node order each attempt so health changes are respected.
    const orderedNodes = rpcHealthTracker.getOrderedNodes(config.nodes)
    // Pick the healthiest untried node. If all tried, start a new round.
    let node = orderedNodes.find((n) => !triedInRound.has(n))
    if (!node) {
      triedInRound.clear()
      node = orderedNodes[0]
    }
    triedInRound.add(node)
    try {
      const res = await jsonRPCCall(node, method, params, timeout)
      rpcHealthTracker.recordSuccess(node)
      return res as T
    } catch (e: any) {
      // RPCErrors are valid blockchain rejections - never retry
      if (e instanceof RPCError) {
        throw e
      }
      recordError(rpcHealthTracker, node, e)
      lastError = e

      // Add jitter before trying next node
      if (attempt < retry) {
        await jitterDelay()
      }
    }
  }

  throw lastError
}

// ── Public API: callRPC for broadcasts ──────────────────────────────────────

/**
 * Broadcast-safe RPC call. Only retries on pre-connection errors where the
 * request definitively never reached the server (ECONNREFUSED, ENOTFOUND, etc.).
 * On timeouts, HTTP errors, or any ambiguous failure, throws immediately to
 * prevent double-broadcasting transactions.
 *
 * Tries each node once (no wrap-around) since broadcast retries are dangerous.
 *
 * @internal Used by Transaction.broadcast()
 */
export const callRPCBroadcast = async <T = any>(
  method: string,
  params: any[] | object = [],
  timeout = config.timeout
): Promise<T> => {
  if (!Array.isArray(config.nodes)) {
    throw new Error('config.nodes is not an array')
  }
  if (config.nodes.length === 0) {
    throw new Error('config.nodes is empty')
  }
  // Track which nodes we've already tried - broadcasts must never retry the same node
  const triedNodes = new Set<string>()
  let lastError: any

  for (let attempt = 0; attempt < config.nodes.length; attempt++) {
    // Re-evaluate order each attempt so health changes are respected
    const orderedNodes = rpcHealthTracker.getOrderedNodes(config.nodes)
    const node = orderedNodes.find((n) => !triedNodes.has(n))
    if (!node) break
    triedNodes.add(node)
    try {
      const res = await jsonRPCCall(node, method, params, timeout)
      rpcHealthTracker.recordSuccess(node)
      return res as T
    } catch (e: any) {
      // RPCErrors are valid blockchain rejections - never retry
      if (e instanceof RPCError) {
        throw e
      }
      recordError(rpcHealthTracker, node, e)
      lastError = e

      // Only retry broadcasts on pre-connection errors where the request
      // definitely never reached the server. On timeouts or HTTP errors,
      // the server may have received and processed the transaction.
      if (!isPreConnectionError(e)) {
        throw e
      }
    }
  }

  throw lastError
}

// ── Public API: callREST ────────────────────────────────────────────────────

const apiMethods: Record<APIMethods, string> = {
  balance: '/balance-api',
  hafah: '/hafah-api',
  hafbe: '/hafbe-api',
  hivemind: '/hivemind-api',
  hivesense: '/hivesense-api',
  reputation: '/reputation-api',
  'nft-tracker': '/nft-tracker-api',
  hafsql: '/hafsql',
  status: '/status-api'
}

type GetResponse<T> = T extends {
  responses: { '200'?: { content: { 'application/json': infer R } } }
}
  ? R
  : undefined
type SafeGet<T> = T extends { get: infer G } ? G : undefined
type SafePathParams<T> =
  SafeGet<T> extends {
    parameters: { path: infer P }
  }
    ? P
    : undefined
type SafeQueryParams<T> =
  SafeGet<T> extends {
    parameters: { query: infer Q }
  }
    ? Q
    : SafeGet<T> extends {
          parameters: {
            query?: infer Q
          }
        }
      ? Q
      : undefined
type ParamsForEndpoint<T> = SafePathParams<T> & SafeQueryParams<T> extends undefined
  ? SafePathParams<T>
  : SafePathParams<T> & SafeQueryParams<T>

/**
 * Makes REST API calls to Hive blockchain REST endpoints with automatic retry and failover support.
 * Uses per-request retry counters, node health tracking, and timeout support.
 * Wraps around the node list to honor the full retry budget.
 *
 * @template Api - The REST API method type (e.g., 'balance', 'hafah', 'hivemind', etc.)
 * @template P - The endpoint path type for the specified API
 *
 * @param api - The REST API method name to call
 * @param endpoint - The specific endpoint path within the API
 * @param params - Optional parameters for path and query string replacement
 * @param timeout - Request timeout in milliseconds (default: config.timeout)
 * @param retry - Number of retry attempts before throwing an error (default: config.retry)
 *
 * @returns Promise resolving to the API response data with proper typing
 * @throws Error if all retry attempts fail
 *
 * @example
 * ```typescript
 * import { callREST } from 'hive-tx'
 *
 * // Get account balance
 * const balance = await callREST('balance', '/accounts/{account-name}/balances', { "account-name": 'alice' })
 *
 * // Custom timeout and retry settings
 * const data = await callREST('status', '/status', undefined, 10_000, 3)
 * ```
 */
export async function callREST<Api extends APIMethods, P extends keyof APIPaths[Api]>(
  api: Api,
  endpoint: P,
  params?: ParamsForEndpoint<APIPaths[Api][P]>,
  timeout = config.timeout,
  retry = config.retry
): Promise<GetResponse<SafeGet<APIPaths[Api][P]>>> {
  if (!Array.isArray(config.restNodes)) {
    throw new Error('config.restNodes is not an array')
  }
  if (config.restNodes.length === 0) {
    throw new Error('config.restNodes is empty')
  }
  const triedInRound = new Set<string>()
  let lastError: any
  // Track whether the error was already recorded by the HTTP status handler
  let alreadyRecorded = false

  for (let attempt = 0; attempt <= retry; attempt++) {
    // Re-evaluate node order each attempt so health changes are respected.
    const orderedNodes = restHealthTracker.getOrderedNodes(config.restNodes)
    let node = orderedNodes.find((n) => !triedInRound.has(n))
    if (!node) {
      triedInRound.clear()
      node = orderedNodes[0]
    }
    triedInRound.add(node)
    const baseUrl = node + apiMethods[api]
    let path = endpoint as string
    const paramObj = params || ({} as Record<string, any>)
    const processedPathParams = new Set<string>()

    // Replace path params ONLY
    Object.entries(paramObj).forEach(([key, value]) => {
      if (path.includes(`{${key}}`)) {
        path = path.replace(`{${key}}`, encodeURIComponent(String(value)))
        processedPathParams.add(key)
      }
    })
    const url = new URL(baseUrl + path)
    // Add ONLY remaining params as query (if any)
    Object.entries(paramObj).forEach(([key, value]) => {
      if (!processedPathParams.has(key)) {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)))
        } else {
          url.searchParams.set(key, String(value))
        }
      }
    })

    alreadyRecorded = false
    try {
      const response = await fetch(url.toString(), {
        signal: AbortSignal.timeout(timeout)
      })
      if (response.status === 404) {
        throw new Error('HTTP 404 - Hint: can happen on wrong params')
      }
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        const cooldownMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : 10_000
        restHealthTracker.recordRateLimit(node, cooldownMs)
        alreadyRecorded = true
        throw new Error(`HTTP 429 Rate Limited by ${node}`)
      }
      if (response.status === 503) {
        restHealthTracker.recordFailure(node)
        alreadyRecorded = true
        throw new Error(`HTTP 503 Service Unavailable from ${node}`)
      }
      restHealthTracker.recordSuccess(node)
      return response.json() as any
    } catch (e: any) {
      // 404 is not a node issue, don't failover
      if (e?.message?.includes('HTTP 404')) {
        throw e
      }
      // Only record if not already recorded by 429/503 handler above
      if (!alreadyRecorded) {
        restHealthTracker.recordFailure(node)
      }
      lastError = e

      if (attempt < retry) {
        await jitterDelay()
      }
    }
  }

  throw lastError
}

// ── Public API: callWithQuorum ───────────────────────────────────────────────

/**
 * Make a JSONRPC call with quorum. The method will cross-check the result
 * with `quorum` number of nodes before returning the result.
 * @param method - The API method name (e.g., 'condenser_api.get_accounts')
 * @param params - Parameters for the API method as array or object
 * @param quorum - Default: 2 (recommended)
 */
export const callWithQuorum = async <T = any>(
  method: string,
  params: any[] | object = [],
  quorum = 2
): Promise<T> => {
  if (!Array.isArray(config.nodes)) {
    throw new Error('config.nodes is not an Array')
  }
  if (quorum > config.nodes.length) {
    throw new Error('quorum > config.nodes.length')
  }
  // We call random nodes for better security
  const shuffleNodes = (arr: string[]) => [...arr].sort(() => Math.random() - 0.5)
  let allNodes = shuffleNodes(config.nodes)
  let currentBatchSize = Math.min(quorum, allNodes.length)
  let allResults: any[] = []
  while (currentBatchSize > 0 && allNodes.length > 0) {
    // Take next batch of nodes
    const batchNodes = allNodes.splice(0, currentBatchSize)
    const promises: Promise<any>[] = []
    const batchResults: any[] = []
    // Launch batch calls in parallel
    for (let i = 0; i < batchNodes.length; i++) {
      promises.push(
        jsonRPCCall(batchNodes[i], method, params, undefined, true)
          .then((data) => batchResults.push(data))
          .catch(() => {})
      )
    }
    await Promise.all(promises)
    allResults.push(...batchResults)
    // Check for consensus in successful results
    const consensusResult = findConsensus(allResults, quorum)
    if (consensusResult) {
      return consensusResult
    }
    // Prepare next batch
    currentBatchSize = Math.min(quorum, allNodes.length)
    if (currentBatchSize === 0) {
      throw new Error('No more nodes available.')
    }
  }
  throw new Error("Couldn't reach quorum.")
}

function findConsensus(results: any[], quorum: number) {
  const resultGroups = new Map<string, any[]>()
  for (const result of results) {
    const key = JSON.stringify(result)
    if (!resultGroups.has(key)) {
      resultGroups.set(key, [])
    }
    resultGroups.get(key)!.push(result)
  }
  const consensusGroup = Array.from(resultGroups.values()).find(
    (group) => group.length >= quorum
  )
  return consensusGroup ? consensusGroup[0] : null
}
