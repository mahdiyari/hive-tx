# hive-tx

[![npm version](https://badge.fury.io/js/hive-tx.svg)](https://www.npmjs.com/package/hive-tx)
[![npm downloads](https://img.shields.io/npm/dm/hive-tx.svg)](https://www.npmjs.com/package/hive-tx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/mahdiyari/hive-tx/blob/master/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](https://nodejs.org/)
[![Bundlejs](https://deno.bundlejs.com/badge?q=hive-tx@latest)](https://bundlejs.com/?q=hive-tx@latest)

Lightweight TypeScript SDK for the Hive blockchain. No runtime dependencies, ~32 KB minified and gzipped. Works in Node.js, browsers, workers, and serverless runtimes.

- Build, sign, and broadcast transactions, typed per operation
- JSON-RPC with automatic node failover, batch requests, and quorum calls that cross-check nodes
- Typed REST APIs: balance, hafah, hafbe, hivemind, and more
- Gap-free streams of blocks, block numbers, and operations (virtual included)
- Keys, signatures, and encrypted memos

## Install

Node.js 20 or later. ESM and CommonJS builds are included.

```bash
npm install hive-tx
```

## Example

```js
import { Transaction, PrivateKey, streamOperations } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('vote', { voter: 'alice', author: 'bob', permlink: 'hello', weight: 10000 })
tx.sign(PrivateKey.from('5J...posting-key'))
const { tx_id } = await tx.broadcast()

for await (const { block, op } of streamOperations()) {
  if (op[0] === 'transfer') console.log(block, op[1])
}
```

## Documentation

**[hive-tx documentation](https://mahdiyari.github.io/hive-tx/)**: guides, examples, and API reference.

## Browser

```html
<script type="module">
  import { Transaction, PrivateKey } from 'https://cdn.jsdelivr.net/npm/hive-tx@7/dist/index.mjs'
</script>
```

## License

MIT

## Support

#dev-chat at [Hive's Discord server](https://myhive.li/discord)
