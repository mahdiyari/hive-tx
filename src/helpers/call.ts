import { config } from '../config.js'
import { APIMethods, APIPaths, CallResponse } from '../types.js'

let rpcIndex = 0
let restIndex = 0
let rpcTries = 0
let restTries = 0

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

/** shoudRetry is false by default - i.e. no retry
 * on true, retry one more time
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
    if (shouldRetry) {
      return jsonRPCCall(url, method, params, timeout, false)
    }
    throw e
  }
}

/**
 * Makes API calls to Hive blockchain nodes with automatic retry and failover support.
 * Automatically switches between multiple nodes.
 *
 * The method supports JSON-RPC 2.0 protocol used by Hive API nodes.
 * If the current node fails, it will automatically try the next node in the list.
 *
 * @param method - The API method name (e.g., 'condenser_api.get_accounts')
 * @param params - Parameters for the API method as array or object
 * @param timeout - Request timeout in milliseconds (default: config.timeout)
 * @param retry - Number of retry attempts before throwing an error (default: config.retry)
 * @returns Promise resolving to the API response
 * @throws Error if all retry attempts fail or on RPCError
 *
 * @example
 * ```typescript
 * import { callRPC } from 'hive-tx'
 *
 * // Get account information
 * const accounts = await callRPC('condenser_api.get_accounts', [['alice']])
 *
 * // Custom timeout and retry settings
 * const data = await callRPC('condenser_api.get_content', ['alice', 'test-post'], 10_000, 8)
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
  const node = config.nodes[rpcIndex]
  try {
    const res = await jsonRPCCall(node, method, params, timeout)
    rpcTries = 0
    return res as T
  } catch (e: any) {
    // Throw on actual RPC errors
    if (e instanceof RPCError) {
      throw e
    }
    rpcTries++
    if (rpcTries > retry) {
      throw e
    }
    changeRPCNode()
    return callRPC(method, params, timeout, retry)
  }
}

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
 * Automatically switches between multiple REST nodes and handles path/query parameter processing.
 *
 * This function provides type-safe access to various Hive REST APIs including balance, hafah, hafbe,
 * hivemind, hivesense, reputation, nft-tracker, hafsql, and status APIs.
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
 * const data = await callREST('balance', '/accounts/{account-name}/aggregated-history', {
 *  'account-name': 'mahdiyari',
 *  'coin-type': 'HBD'
 * })
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
  const node = config.restNodes[restIndex]
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
  let response
  try {
    response = await fetch(url.toString(), {
      signal: AbortSignal.timeout(timeout)
    })
    restTries = 0
    if (response?.status === 404) {
      throw new Error(`HTTP 404 - Hint: can happen on wrong params`)
    }
    return response.json() as any
  } catch (e) {
    if (response?.status === 404) {
      throw e
    }
    restTries++
    if (restTries > retry) {
      throw e
    }
    changeRESTNode()
    return callREST(api, endpoint, params, timeout, retry)
  }
}

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
  const consensusGroup = Array.from(resultGroups.values()).find((group) => group.length >= quorum)
  return consensusGroup ? consensusGroup[0] : null
}

const changeRPCNode = (newNodeIndex = rpcIndex + 1) => {
  if (newNodeIndex > config.nodes.length - 1) {
    newNodeIndex = 0
  }
  rpcIndex = newNodeIndex
}

const changeRESTNode = (newNodeIndex = restIndex + 1) => {
  if (newNodeIndex > config.restNodes.length - 1) {
    newNodeIndex = 0
  }
  restIndex = newNodeIndex
}
