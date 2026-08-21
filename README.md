# hive-tx

[![npm version](https://badge.fury.io/js/hive-tx.svg)](https://www.npmjs.com/package/hive-tx)
[![npm downloads](https://img.shields.io/npm/dm/hive-tx.svg)](https://www.npmjs.com/package/hive-tx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/mahdiyari/hive-tx/blob/master/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green.svg)](https://nodejs.org/)
[![Bundlejs](https://deno.bundlejs.com/badge?q=hive-tx@latest)](https://bundlejs.com/?q=hive-tx@latest)

Lightweight TypeScript SDK for the Hive blockchain. Create, sign, and broadcast transactions. Call JSON-RPC and REST APIs. Works in Node.js, browsers, workers, and serverless runtimes.

## Documentation

**[hive-tx documentation](https://mahdiyari.github.io/hive-tx/)** — install, quick start, examples, and API reference.

## Install

Node.js 20 or later.

```bash
npm install hive-tx --save
```

```js
import { Transaction, PrivateKey, callRPC } from 'hive-tx'
```

ESM and CommonJS builds are included. Crypto code is inlined. The package has no runtime dependencies.

Browser:

```html
<script type="module">
  import { Transaction, PrivateKey } from 'https://cdn.jsdelivr.net/npm/hive-tx@7/dist/index.mjs'
</script>
```

## License

MIT

## Support

#dev-chat at [Hive's Discord server](https://myhive.li/discord)
