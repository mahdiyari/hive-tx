# hive-tx

[![npm version](https://badge.fury.io/js/hive-tx.svg)](https://www.npmjs.com/package/hive-tx)
[![npm downloads](https://img.shields.io/npm/dm/hive-tx.svg)](https://www.npmjs.com/package/hive-tx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/mahdiyari/hive-tx/blob/master/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](https://nodejs.org/)

The most lightweight library for Hive blockchain while being a complete library. Regularly maintained to support the latest features of the blockchain. For Web and NodeJS.

Library size: ~29KB minified+gzipped (including all the dependencies)

## Comprehensive Documentation

- 🚀 [Quick Start Guide](docs/QUICKSTART.md) - Get up and running in minutes
- 💻 [Examples](docs/EXAMPLES.md) - Practical usage examples

## Installation

```bash
# Require nodejs +20
npm install hive-tx --save
```

## Usage

```js
import { Transaction, PrivateKey, callRPC } from 'hive-tx'
```

The library has two build outputs:

- ES Module (esm)
- CommonJS (cjs)

Your application will automatically pick the right build for your environment through package exports.

For browser usage, load the ESM build directly:

```html
<script type="module">
  import { Transaction, PrivateKey } from 'https://cdn.jsdelivr.net/npm/hive-tx@7/dist/index.mjs'
  // use Transaction / PrivateKey here
</script>
```

## Quick Usage Examples

### New Transaction API (v7+)

```js
import { Transaction, PrivateKey } from 'hive-tx'

// Create and broadcast a vote
const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'your-username',
  author: 'post-author',
  permlink: 'post-permlink',
  weight: 10000 // 100%
})

const key = PrivateKey.from('your-private-key')
tx.sign(key)
const result = await tx.broadcast()
console.log('Vote successful!', result.result.tx_id)
```

### Transfer HIVE

```js
import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Thanks for your help!'
})

const key = PrivateKey.from('your-active-key')
tx.sign(key)
const result = await tx.broadcast()
console.log('Transfer successful!', result.result.tx_id)
```

### API Calls

```js
import { callRPC, callREST, callWithQuorum } from 'hive-tx'

// Get account information
const accounts = await callRPC('condenser_api.get_accounts', [['username']])
console.log('Account:', result[0])

// Get blockchain properties
const props = await callRPC('condenser_api.get_dynamic_global_properties')
console.log('Head block:', props.head_block_number)

const balance = await callREST('balance', '/accounts/{account-name}/balances', {
  'account-name': 'alice'
})
console.log(balance)

// Cross-check the result of the call with 2 nodes
const accounts = await callWithQuorum('condenser_api.get_accounts', [['username']], 2)
console.log('Account:', result[0])
```

### Key Management

```js
import { PrivateKey } from 'hive-tx'

// Create keys in multiple ways
const key1 = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
const key2 = PrivateKey.randomKey()
const key3 = PrivateKey.fromLogin('username', 'password', 'posting')
const key4 = PrivateKey.fromSeed('my-secret-seed')
```

## Configuration

```js
import { config } from 'hive-tx'

// Configure API nodes with failover
// Default nodes that are already set:
config.nodes = [
  'https://api.hive.blog',
  'https://api.deathwing.me',
  'https://api.openhive.network',
  'https://rpc.mahdiyari.info',
  'https://techcoderx.com',
  'https://hiveapi.actifit.io',
  'https://api.c0ff33a.uk'
]

// Custom timeout and retry settings
config.timeout = 10_000 // 10 seconds
config.retry = 8 // 8 retry attempts before throwing an error
```

### Breaking Changes in v7

v7 is a complete TypeScript rewrite with significant API improvements. See [CHANGELOG.md](CHANGELOG.md) for full details.

**Key Breaking Changes:**

- `tx.create()` => `await tx.addOperation(opName, opBody)`
- `call()` => `callRPC()` - Returns result directly, throws RPCError on errors
- `Transaction.broadcast(timeout?, retry?)` => `Transaction.broadcast(checkStatus?)`
- All timeout/expiration values now in milliseconds (was seconds)
- `new Transaction(transaction)` => `new Transaction({transaction, expiration})`
- `Transaction.signedTransaction` removed - Use `Transaction.transaction`
- `config.node` (string) => `config.nodes` (array)
- `config.healthcheckInterval` removed

**Migration Examples:**

```js
// v6: Creating transactions
const tx = new Transaction()
await tx.create([['vote', { voter: 'alice', author: 'bob', permlink: 'post', weight: 10000 }]])

// v7: Creating transactions
const tx = new Transaction()
await tx.addOperation('vote', { voter: 'alice', author: 'bob', permlink: 'post', weight: 10000 })
```

```js
// v6: API calls
const result = await call('condenser_api.get_accounts', [['alice']])
const accounts = result.result

// v7: API calls
const accounts = await callRPC('condenser_api.get_accounts', [['alice']])
```

```js
// v6: Configuration
config.node = 'https://api.hive.blog'
config.timeout = 10 // seconds

// v7: Configuration
config.nodes = ['https://api.hive.blog', 'https://api.deathwing.me']
config.timeout = 10_000 // milliseconds
```

### What's new in v7

- Codebase reworked in TypeScript
- All methods now have good JSDoc documentation
- Added types for all operations
- Added `callWithQuorum()` - JSONRPC call that cross-checks the result with multiple nodes
- Added `callREST()` with full typing for new REST APIs
- Added tests including operation tests to keep them up to date with hived
- Added docs/EXAMPLES.md and docs/QUICKSTART.md
- Output 2 builds in `dist`: ESM (`index.mjs`) and CJS (`index.cjs`)

## License

MIT

## Support

- #dev-chat at [Hive's Discord server](https://myhive.li/discord)
