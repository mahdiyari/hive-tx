import {
  callREST,
  callRPC,
  callWithQuorum,
  checkNode,
  checkNodes,
  clearCallCache,
  clearNodeHealth,
  config,
  getNodeHealth,
  startNodeHealthcheck,
  stopNodeHealthcheck
} from 'hive-tx'

type Seen = { url: string; method: string; params?: unknown }
type MockResult =
  | { result: unknown }
  | { error: { message: string; code: number } }
  | { mismatch: true }
  | { throw: Error }

const freshProps = (offsetMs = 0) => {
  return {
    head_block_number: 10,
    head_block_id: 'ab'.repeat(20),
    time: new Date(Date.now() + offsetMs).toISOString().slice(0, 19)
  }
}

const staleProps = () => {
  return {
    head_block_number: 1,
    head_block_id: 'cd'.repeat(20),
    time: '2019-01-01T00:00:00'
  }
}

export const healthAndCacheTests = async () => {
  console.log('Testing node healthchecks and call cache...\n')

  let totalTests = 0
  let passedTests = 0
  const seen: Seen[] = []
  let handler: (url: string, method: string, params: unknown) => MockResult = () => ({
    result: {}
  })
  const originalFetch = globalThis.fetch
  const saved = {
    nodes: config.nodes.slice(),
    restNodes: config.restNodes.slice(),
    healthchecks: config.healthchecks.slice(),
    healthcheckInterval: config.healthcheckInterval,
    healthcheckMaxLag: config.healthcheckMaxLag,
    cacheTtl: config.cacheTtl,
    cacheMethods: config.cacheMethods.slice(),
    timeout: config.timeout,
    retry: config.retry
  }

  const calls = (method: string) => seen.filter((row) => row.method === method)

  const reset = () => {
    stopNodeHealthcheck()
    clearNodeHealth()
    clearCallCache()
    seen.length = 0
    config.nodes = ['https://node.example']
    config.restNodes = ['https://node.example']
    config.healthchecks = []
    config.healthcheckInterval = 60_000
    config.healthcheckMaxLag = 30_000
    config.cacheTtl = 2_000
    config.cacheMethods = [
      'condenser_api.get_dynamic_global_properties',
      'database_api.get_dynamic_global_properties'
    ]
    config.timeout = 1_000
    config.retry = 8
  }

  const runTest = async (name: string, testFn: () => boolean | Promise<boolean>) => {
    totalTests++
    reset()
    try {
      const result = await testFn()
      if (result) {
        console.log(`✅ ${name}`)
        passedTests++
      } else {
        console.log(`❌ ${name}`)
      }
    } catch (error) {
      console.log(`❌ ${name}:`, error)
    }
  }

  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    if (!init?.body) {
      seen.push({ url, method: 'GET' })
      return Response.json({ ok: true })
    }
    const body = JSON.parse(String(init.body)) as { id: number; method: string; params: unknown }
    seen.push({ url, method: body.method, params: body.params })
    const outcome = handler(url, body.method, body.params)
    if ('throw' in outcome) {
      throw outcome.throw
    }
    if ('mismatch' in outcome) {
      return Response.json({ jsonrpc: '2.0', id: body.id + 1, result: {} })
    }
    if ('error' in outcome) {
      return Response.json({ jsonrpc: '2.0', id: body.id, error: outcome.error })
    }
    return Response.json({ jsonrpc: '2.0', id: body.id, result: outcome.result })
  }

  try {
    await runTest('callRPC caches dynamic global properties until the TTL', async () => {
      let heads = 0
      handler = () => {
        heads++
        return { result: freshProps() }
      }
      const first = await callRPC<{ head_block_number: number }>(
        'condenser_api.get_dynamic_global_properties',
        []
      )
      const second = await callRPC<{ head_block_number: number }>(
        'condenser_api.get_dynamic_global_properties',
        []
      )
      return first.head_block_number === 10 && second.head_block_number === 10 && heads === 1
    })

    await runTest('database_api dynamic global properties use the same cache', async () => {
      handler = () => ({ result: freshProps() })
      await callRPC('database_api.get_dynamic_global_properties', [])
      await callRPC('database_api.get_dynamic_global_properties', [])
      return calls('database_api.get_dynamic_global_properties').length === 1
    })

    await runTest('uncached methods always reach a node', async () => {
      handler = () => ({ result: [{ name: 'alice' }] })
      await callRPC('condenser_api.get_accounts', [['alice']])
      await callRPC('condenser_api.get_accounts', [['alice']])
      return calls('condenser_api.get_accounts').length === 2
    })

    await runTest('cache key includes params and ignores object key order', async () => {
      config.cacheMethods = ['custom.method']
      handler = () => ({ result: { ok: true } })
      await callRPC('custom.method', { b: 1, a: 2 })
      await callRPC('custom.method', { a: 2, b: 1 })
      await callRPC('custom.method', { a: 3, b: 1 })
      return calls('custom.method').length === 2
    })

    await runTest('cacheTtl 0 disables the local cache', async () => {
      config.cacheTtl = 0
      handler = () => ({ result: freshProps() })
      await callRPC('condenser_api.get_dynamic_global_properties', [])
      await callRPC('condenser_api.get_dynamic_global_properties', [])
      return calls('condenser_api.get_dynamic_global_properties').length === 2
    })

    await runTest('per-call cacheTtl 0 bypasses a warm cache', async () => {
      handler = () => ({ result: freshProps() })
      await callRPC('condenser_api.get_dynamic_global_properties', [])
      await callRPC('condenser_api.get_dynamic_global_properties', [], undefined, undefined, {
        cacheTtl: 0
      })
      return calls('condenser_api.get_dynamic_global_properties').length === 2
    })

    await runTest('an explicit cacheTtl caches a method that is not in the default list', async () => {
      config.cacheMethods = []
      config.cacheTtl = 0
      handler = () => ({ result: [{ name: 'alice' }] })
      await callRPC('condenser_api.get_accounts', [['alice']], undefined, undefined, {
        cacheTtl: 5_000
      })
      await callRPC('condenser_api.get_accounts', [['alice']], undefined, undefined, {
        cacheTtl: 5_000
      })
      await callRPC('condenser_api.get_accounts', [['bob']], undefined, undefined, {
        cacheTtl: 5_000
      })
      return calls('condenser_api.get_accounts').length === 2
    })

    await runTest('clearCallCache drops a fresh result', async () => {
      handler = () => ({ result: freshProps() })
      await callRPC('condenser_api.get_dynamic_global_properties', [])
      clearCallCache()
      await callRPC('condenser_api.get_dynamic_global_properties', [])
      return calls('condenser_api.get_dynamic_global_properties').length === 2
    })

    await runTest('a cached result expires after its TTL', async () => {
      config.cacheTtl = 30
      let heads = 0
      handler = () => {
        heads++
        return { result: { ...freshProps(), head_block_number: heads } }
      }
      const first = await callRPC<{ head_block_number: number }>(
        'condenser_api.get_dynamic_global_properties',
        []
      )
      await new Promise((resolve) => setTimeout(resolve, 50))
      const second = await callRPC<{ head_block_number: number }>(
        'condenser_api.get_dynamic_global_properties',
        []
      )
      return first.head_block_number === 1 && second.head_block_number === 2
    })

    await runTest('RPC errors are not cached', async () => {
      let attempt = 0
      handler = () => {
        attempt++
        if (attempt === 1) {
          return { error: { message: 'bad request', code: -32600 } }
        }
        return { result: freshProps() }
      }
      let threw = false
      try {
        await callRPC('condenser_api.get_dynamic_global_properties', [])
      } catch {
        threw = true
      }
      const second = await callRPC<{ head_block_number: number }>(
        'condenser_api.get_dynamic_global_properties',
        []
      )
      return threw && second.head_block_number === 10 && attempt === 2
    })

    await runTest('disabled healthchecks do not probe services', async () => {
      handler = () => ({ result: [{ name: 'alice' }] })
      const accounts = await callRPC<{ name: string }[]>('condenser_api.get_accounts', [['alice']])
      return (
        accounts[0].name === 'alice' &&
        calls('condenser_api.get_accounts').length === 1 &&
        calls('condenser_api.get_dynamic_global_properties').length === 0 &&
        calls('condenser_api.get_follow_count').length === 0 &&
        calls('condenser_api.get_account_history').length === 0
      )
    })

    await runTest('hived check accepts a recent head block and rejects a stale one', async () => {
      handler = (url) => {
        return { result: url.includes('stale') ? staleProps() : freshProps() }
      }
      const stale = await checkNode('https://stale.example', ['hived'])
      const fresh = await checkNode('https://fresh.example', ['hived'])
      return (
        stale.ok === false &&
        stale.services.hived?.ok === false &&
        typeof stale.services.hived?.lag === 'number' &&
        fresh.ok === true &&
        fresh.services.hived?.ok === true
      )
    })

    await runTest('hived check rejects a head block too far in the future', async () => {
      handler = () => ({ result: freshProps(120_000) })
      const ahead = await checkNode('https://ahead.example', ['hived'])
      return ahead.ok === false && ahead.services.hived?.error === 'head block is outside the lag limit'
    })

    await runTest('hived check rejects a missing or invalid head block', async () => {
      handler = (url) => {
        if (url.includes('empty')) {
          return { result: { time: freshProps().time } }
        }
        return { result: { head_block_number: 1, time: 'not-a-time' } }
      }
      const missing = await checkNode('https://empty.example', ['hived'])
      const invalid = await checkNode('https://invalid.example', ['hived'])
      return (
        missing.services.hived?.error === 'missing head block' &&
        invalid.services.hived?.error === 'invalid head block time'
      )
    })

    await runTest('hivemind check requires a follow count', async () => {
      handler = (url, method, params) => {
        if (JSON.stringify(params) !== JSON.stringify(['hiveio'])) {
          return { result: {} }
        }
        if (url.includes('down')) {
          return { error: { message: 'hivemind down', code: -32000 } }
        }
        if (url.includes('bad-shape')) {
          return { result: { account: 'hiveio' } }
        }
        return { result: { account: 'hiveio', follower_count: 1, following_count: 2 } }
      }
      const down = await checkNode('https://down.example', ['hivemind'])
      const bad = await checkNode('https://bad-shape.example', ['hivemind'])
      const up = await checkNode('https://up.example', ['hivemind'])
      return (
        down.ok === false &&
        down.services.hivemind?.error === 'hivemind down' &&
        bad.ok === false &&
        up.ok === true &&
        up.services.hived === undefined &&
        calls('condenser_api.get_follow_count').length === 3 &&
        calls('condenser_api.get_dynamic_global_properties').length === 0
      )
    })

    await runTest('hafah check requires account history', async () => {
      handler = (url, method, params) => {
        if (method !== 'condenser_api.get_account_history') {
          return { result: {} }
        }
        if (JSON.stringify(params) !== JSON.stringify(['hiveio', -1, 1])) {
          return { result: [] }
        }
        if (url.includes('empty')) {
          return { result: [] }
        }
        if (url.includes('down')) {
          return { error: { message: 'Unable to send request to endpoint', code: -32000 } }
        }
        return { result: [[0, { op: ['transfer', {}] }]] }
      }
      const empty = await checkNode('https://empty.example', ['hafah'])
      const down = await checkNode('https://down.example', ['hafah'])
      const up = await checkNode('https://up.example', ['hafah'])
      return (
        empty.services.hafah?.error === 'hafah returned no history' &&
        down.ok === false &&
        down.services.hafah?.error === 'Unable to send request to endpoint' &&
        up.ok === true &&
        calls('condenser_api.get_follow_count').length === 0
      )
    })

    await runTest('a node must pass every requested service', async () => {
      handler = (url, method) => {
        if (method === 'condenser_api.get_dynamic_global_properties') {
          return { result: freshProps() }
        }
        if (method === 'condenser_api.get_account_history') {
          return url.includes('partial')
            ? { error: { message: 'no hafah', code: 1 } }
            : { result: [[1, {}]] }
        }
        return { result: {} }
      }
      const partial = await checkNode('https://partial.example', ['hived', 'hafah'])
      const full = await checkNode('https://full.example', ['hived', 'hafah'])
      return (
        partial.ok === false &&
        partial.services.hived?.ok === true &&
        partial.services.hafah?.ok === false &&
        full.ok === true
      )
    })

    await runTest('JSON-RPC id mismatch fails the check', async () => {
      handler = () => ({ mismatch: true })
      const row = await checkNode('https://mismatch.example', ['hived'])
      return row.ok === false && row.services.hived?.error === 'JSONRPC id mismatch'
    })

    await runTest('checkNodes probes each configured node', async () => {
      config.nodes = ['https://a.example', 'https://b.example']
      handler = () => ({ result: freshProps() })
      const rows = await checkNodes(['hived'])
      const urls = rows.map((row) => row.url).sort()
      return urls.join() === 'https://a.example,https://b.example' && rows.every((row) => row.ok)
    })

    await runTest('callRPC skips a node that fails the hived check', async () => {
      config.nodes = ['https://stale.example', 'https://fresh.example']
      config.healthchecks = ['hived']
      handler = (url, method) => {
        if (method === 'condenser_api.get_dynamic_global_properties') {
          return { result: url.includes('stale') ? staleProps() : freshProps() }
        }
        return { result: [{ name: 'alice' }] }
      }
      const accounts = await callRPC<{ name: string }[]>('condenser_api.get_accounts', [['alice']])
      const accountCalls = calls('condenser_api.get_accounts')
      return (
        accounts[0].name === 'alice' &&
        accountCalls.length === 1 &&
        accountCalls[0].url === 'https://fresh.example' &&
        calls('condenser_api.get_dynamic_global_properties').length === 2
      )
    })

    await runTest('callRPC skips a node that fails an optional hivemind check', async () => {
      config.nodes = ['https://no-social.example', 'https://social.example']
      config.healthchecks = ['hivemind']
      handler = (url, method) => {
        if (method === 'condenser_api.get_follow_count') {
          if (url.includes('no-social')) {
            return { error: { message: 'method not found', code: -32601 } }
          }
          return { result: { account: 'hiveio', follower_count: 4, following_count: 1 } }
        }
        return { result: [{ name: 'alice' }] }
      }
      await callRPC('condenser_api.get_accounts', [['alice']])
      const accountCalls = calls('condenser_api.get_accounts')
      return (
        accountCalls.length === 1 &&
        accountCalls[0].url === 'https://social.example' &&
        calls('condenser_api.get_dynamic_global_properties').length === 0
      )
    })

    await runTest('a transport failure marks the node unhealthy for the next call', async () => {
      config.nodes = ['https://down.example']
      config.healthchecks = ['hived']
      config.retry = 0
      handler = (url, method) => {
        if (method === 'condenser_api.get_dynamic_global_properties') {
          return { result: freshProps() }
        }
        return { throw: new Error('socket hang up') }
      }
      let threw = false
      try {
        await callRPC('condenser_api.get_accounts', [['alice']])
      } catch {
        threw = true
      }
      const row = getNodeHealth().find((item) => item.url === 'https://down.example')
      return threw && row?.ok === false && row.error === 'request failed'
    })

    await runTest('callREST skips a URL that failed the node healthcheck', async () => {
      config.nodes = ['https://stale.example', 'https://fresh.example']
      config.restNodes = ['https://stale.example', 'https://fresh.example']
      config.healthchecks = ['hived']
      handler = (url, method) => {
        if (method === 'condenser_api.get_dynamic_global_properties') {
          return { result: url.includes('stale') ? staleProps() : freshProps() }
        }
        return { result: {} }
      }
      const status = await callREST('status', '/status')
      const gets = calls('GET')
      return (
        (status as { ok?: boolean }).ok === true &&
        gets.length === 1 &&
        gets[0].url.startsWith('https://fresh.example/')
      )
    })

    await runTest('callWithQuorum prefers nodes that passed the healthcheck', async () => {
      config.nodes = ['https://stale.example', 'https://fresh.example']
      config.healthchecks = ['hafah']
      handler = (url, method) => {
        if (method === 'condenser_api.get_account_history') {
          return url.includes('stale') ? { result: [] } : { result: [[0, {}]] }
        }
        return { result: [{ name: 'alice' }] }
      }
      const accounts = await callWithQuorum<{ name: string }[]>(
        'condenser_api.get_accounts',
        [['alice']],
        1
      )
      const accountCalls = calls('condenser_api.get_accounts')
      return accounts[0].name === 'alice' && accountCalls.every((row) => row.url.includes('fresh'))
    })

    await runTest('a warm dynamic global properties cache skips the network', async () => {
      config.nodes = ['https://fresh.example']
      config.healthchecks = ['hived']
      handler = () => ({ result: freshProps() })
      await callRPC('condenser_api.get_dynamic_global_properties', [])
      const before = seen.length
      await callRPC('condenser_api.get_dynamic_global_properties', [])
      return seen.length === before && before > 0
    })

    await runTest('the background healthcheck stops when asked', async () => {
      config.nodes = ['https://fresh.example']
      config.healthchecks = ['hived']
      config.healthcheckInterval = 30
      handler = () => ({ result: freshProps() })
      startNodeHealthcheck()
      await new Promise((resolve) => setTimeout(resolve, 80))
      stopNodeHealthcheck()
      await new Promise((resolve) => setTimeout(resolve, 20))
      const afterStop = seen.length
      await new Promise((resolve) => setTimeout(resolve, 90))
      return afterStop > 0 && seen.length === afterStop
    })
  } finally {
    try {
      stopNodeHealthcheck()
      clearNodeHealth()
      clearCallCache()
      config.healthchecks = []
      config.nodes = ['https://reset.example']
      config.restNodes = ['https://reset.example']
      config.retry = 8
      handler = () => ({ result: [{ name: 'alice' }] })
      await callRPC('condenser_api.get_accounts', [['alice']])
      await callREST('status', '/status')
    } catch {
      // The reset call only clears retry counters after the suite.
    }
    globalThis.fetch = originalFetch
    config.nodes = saved.nodes
    config.restNodes = saved.restNodes
    config.healthchecks = saved.healthchecks
    config.healthcheckInterval = saved.healthcheckInterval
    config.healthcheckMaxLag = saved.healthcheckMaxLag
    config.cacheTtl = saved.cacheTtl
    config.cacheMethods = saved.cacheMethods
    config.timeout = saved.timeout
    config.retry = saved.retry
    stopNodeHealthcheck()
    clearNodeHealth()
    clearCallCache()
  }

  console.log(`\nHealth and cache tests completed: ${passedTests}/${totalTests} passed`)
  if (passedTests !== totalTests) {
    throw new Error(`Health and cache tests failed: ${passedTests}/${totalTests}`)
  }
  return true
}
