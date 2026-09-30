import { config } from '../config.js'
import { CallResponse } from '../types.js'

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
export const jsonRPCCall = async (
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
      if (
        'message' in e &&
        'code' in e &&
        !e.message.toLowerCase().includes('Unable to send request to endpoint'.toLowerCase())
      ) {
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
