import { config, HealthService } from '../config.js'
import { jsonRPCCall, RPCError } from './jsonrpc.js'

/** One service probe against a single node. `lag` is head-block age in milliseconds. */
export interface ServiceHealth {
  ok: boolean
  error?: string
  lag?: number
}

/** Last health result for one JSON-RPC URL. */
export interface NodeHealth {
  url: string
  ok: boolean
  checkedAt: number
  services: Partial<Record<HealthService, ServiceHealth>>
  error?: string
}

const ALL_SERVICES: HealthService[] = ['hived', 'hivemind', 'hafah']
const PROBE_ACCOUNT = 'hiveio'

const byUrl = new Map<string, NodeHealth>()
let checkedAt = 0
let checkedKey = ''
let inflight: Promise<NodeHealth[]> | null = null
let inflightKey = ''
let timer: ReturnType<typeof setInterval> | undefined
let timerInterval = -1
let timerServices = ''

const errorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message) {
      return message
    }
  }
  return 'healthcheck failed'
}

const copyHealth = (row: NodeHealth): NodeHealth => {
  return {
    url: row.url,
    ok: row.ok,
    checkedAt: row.checkedAt,
    error: row.error,
    services: { ...row.services }
  }
}

const nodeKey = (checks: HealthService[]) => {
  return config.nodes.join('\n') + '|' + checks.join(',')
}

const knownService = (service: string): service is HealthService => {
  return service === 'hived' || service === 'hivemind' || service === 'hafah'
}

const resolveServices = (services: HealthService[] | undefined, fallbackAll: boolean) => {
  const source = services?.length ? services : config.healthchecks
  const checks = source.filter(knownService)
  if (checks.length) {
    return checks
  }
  return fallbackAll ? [...ALL_SERVICES] : []
}

const parseHiveTime = (time: string) => {
  const parsed = Date.parse(time.endsWith('Z') ? time : time + 'Z')
  return Number.isNaN(parsed) ? undefined : parsed
}

/** hived is healthy when dynamic global properties show a recent head block. */
const checkHived = async (url: string): Promise<ServiceHealth> => {
  try {
    const result = await jsonRPCCall(url, 'condenser_api.get_dynamic_global_properties', [])
    if (!result || typeof result !== 'object') {
      return { ok: false, error: 'empty dynamic global properties' }
    }
    const props = result as { head_block_number?: unknown; time?: unknown }
    if (typeof props.head_block_number !== 'number' || typeof props.time !== 'string') {
      return { ok: false, error: 'missing head block' }
    }
    const headTime = parseHiveTime(props.time)
    if (headTime === undefined) {
      return { ok: false, error: 'invalid head block time' }
    }
    const lag = Date.now() - headTime
    if (Math.abs(lag) > config.healthcheckMaxLag) {
      return { ok: false, error: 'head block is outside the lag limit', lag }
    }
    return { ok: true, lag }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

/** hivemind is healthy when a follow count is served for a known account. */
const checkHivemind = async (url: string): Promise<ServiceHealth> => {
  try {
    const result = await jsonRPCCall(url, 'condenser_api.get_follow_count', [PROBE_ACCOUNT])
    if (!result || typeof result !== 'object') {
      return { ok: false, error: 'hivemind returned no follow count' }
    }
    if (typeof (result as { follower_count?: unknown }).follower_count !== 'number') {
      return { ok: false, error: 'hivemind returned no follow count' }
    }
    return { ok: true }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

/** hafah is healthy when condenser account history returns at least one op. */
const checkHafah = async (url: string): Promise<ServiceHealth> => {
  try {
    const result = await jsonRPCCall(url, 'condenser_api.get_account_history', [
      PROBE_ACCOUNT,
      -1,
      1
    ])
    if (!Array.isArray(result) || result.length === 0) {
      return { ok: false, error: 'hafah returned no history' }
    }
    return { ok: true }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

const probes: Record<HealthService, (url: string) => Promise<ServiceHealth>> = {
  hived: checkHived,
  hivemind: checkHivemind,
  hafah: checkHafah
}

const probeNode = async (url: string, services: HealthService[]): Promise<NodeHealth> => {
  const entries = await Promise.all(
    services.map(async (service) => [service, await probes[service](url)] as const)
  )
  const servicesHealth: NodeHealth['services'] = {}
  for (const [service, health] of entries) {
    servicesHealth[service] = health
  }
  return {
    url,
    ok: entries.every(([, health]) => health.ok),
    checkedAt: Date.now(),
    services: servicesHealth
  }
}

const probeAll = async (checks: HealthService[], key: string) => {
  const urls = [...config.nodes]
  const results = await Promise.all(urls.map((url) => probeNode(url, checks)))
  for (const row of results) {
    byUrl.set(row.url, row)
  }
  checkedAt = Date.now()
  checkedKey = key
  return results.map(copyHealth)
}

/**
 * Probe one node. Uses `config.healthchecks` when `services` is omitted.
 * An explicit call with no configured checks probes hived, hivemind, and hafah.
 */
export const checkNode = async (url: string, services?: HealthService[]): Promise<NodeHealth> => {
  const checks = resolveServices(services, true)
  const row = await probeNode(url, checks)
  byUrl.set(url, row)
  return copyHealth(row)
}

/**
 * Probe every URL in `config.nodes`.
 * Uses `config.healthchecks` when `services` is omitted.
 * An explicit call with no configured checks probes hived, hivemind, and hafah.
 */
export const checkNodes = (services?: HealthService[]): Promise<NodeHealth[]> => {
  return refreshNodeHealth(resolveServices(services, true))
}

/** Probe `config.nodes` and store the results. Concurrent calls for the same list share one run. */
export const refreshNodeHealth = (services?: HealthService[]): Promise<NodeHealth[]> => {
  const checks = services?.length
    ? services.filter(knownService)
    : resolveServices(undefined, false)
  if (!checks.length) {
    return Promise.resolve(getNodeHealth())
  }
  const key = nodeKey(checks)
  if (inflight && inflightKey === key) {
    return inflight
  }
  inflightKey = key
  const run = probeAll(checks, key)
  inflight = run
  void run.finally(() => {
    if (inflight === run) {
      inflight = null
    }
  })
  return run
}

/** Probe again when the node list, checks, or interval have gone stale. */
export const refreshNodeHealthIfStale = async () => {
  if (!config.healthchecks.length) {
    return
  }
  const key = nodeKey(config.healthchecks.filter(knownService))
  if (key === checkedKey && Date.now() - checkedAt < config.healthcheckInterval) {
    return
  }
  await refreshNodeHealth(config.healthchecks)
}

/**
 * Start the background recheck. No-op when `config.healthchecks` is empty
 * or `config.healthcheckInterval` is 0.
 */
export const startNodeHealthcheck = () => {
  const services = config.healthchecks.filter(knownService).join(',')
  const interval = config.healthcheckInterval
  if (!services || interval <= 0) {
    stopNodeHealthcheck()
    return
  }
  if (timer && timerInterval === interval && timerServices === services) {
    return
  }
  stopNodeHealthcheck()
  timerInterval = interval
  timerServices = services
  const handle = setInterval(() => {
    if (!config.healthchecks.length) {
      stopNodeHealthcheck()
      return
    }
    void refreshNodeHealth().catch(() => {})
  }, interval)
  if (typeof handle.unref === 'function') {
    handle.unref()
  }
  timer = handle
}

/** Stop the background recheck. Stored results are kept. */
export const stopNodeHealthcheck = () => {
  if (timer) {
    clearInterval(timer)
  }
  timer = undefined
  timerInterval = -1
  timerServices = ''
}

/** Forget stored health results. */
export const clearNodeHealth = () => {
  byUrl.clear()
  checkedAt = 0
  checkedKey = ''
}

/** Last stored results. The array is a copy. */
export const getNodeHealth = (): NodeHealth[] => {
  return [...byUrl.values()].map(copyHealth)
}

/** Mark a node unhealthy until the next refresh. Transport failures use this. */
export const markNodeUnhealthy = (url: string, error = 'request failed') => {
  const prev = byUrl.get(url)
  byUrl.set(url, {
    url,
    ok: false,
    checkedAt: Date.now(),
    error,
    services: prev?.services ?? {}
  })
}

/**
 * Run a refresh when healthchecks are enabled, and start the background timer.
 * Callers that leave `config.healthchecks` empty pay nothing.
 */
export const prepareNodeHealth = async () => {
  if (!config.healthchecks.length) {
    return
  }
  startNodeHealthcheck()
  await refreshNodeHealthIfStale()
}

/**
 * Pick the next URL that passed the latest checks, starting at `startIndex`.
 * Returns undefined when healthchecks are off, or when every checked URL failed.
 * URLs with no stored result are used only if no healthy URL exists.
 */
export const selectHealthyUrl = (
  urls: string[],
  startIndex: number
): { url: string; index: number } | undefined => {
  if (!config.healthchecks.length || urls.length === 0) {
    return undefined
  }
  const count = urls.length
  const start = ((startIndex % count) + count) % count
  let fallback: { url: string; index: number } | undefined
  for (let offset = 0; offset < count; offset++) {
    const index = (start + offset) % count
    const url = urls[index]
    const row = byUrl.get(url)
    if (row?.ok) {
      return { url, index }
    }
    if (!row && !fallback) {
      fallback = { url, index }
    }
  }
  return fallback
}

/**
 * Keep healthy URLs when there are enough of them.
 * Otherwise return the original list so quorum can still be attempted.
 */
export const preferHealthy = (urls: string[], minimum: number) => {
  if (!config.healthchecks.length) {
    return urls
  }
  const healthy = urls.filter((url) => byUrl.get(url)?.ok)
  if (healthy.length >= minimum) {
    return healthy
  }
  return urls
}
