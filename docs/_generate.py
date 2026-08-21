#!/usr/bin/env python3
"""Generate hive-tx GitHub Pages HTML. Run from repository root: python3 docs/_generate.py"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent

NAV = [
    ("Overview", "index.html", "index"),
    ("Install", "install.html", "install"),
    ("Quick start", "start.html", "start"),
    ("Examples", "examples.html", "examples"),
    ("Transactions", "transactions.html", "transactions"),
    ("Keys", "keys.html", "keys"),
    ("Memos", "memo.html", "memo"),
    ("RPC and REST", "rpc.html", "rpc"),
    ("Configuration", "config.html", "config"),
    ("Utilities", "utils.html", "utils"),
    ("Environments", "environments.html", "environments"),
    ("Migration from v6", "migrate.html", "migrate"),
    ("API reference", "reference.html", "reference"),
]


def nav_html(current: str) -> str:
    groups = [
        ("Start", ["index", "install", "start", "examples"]),
        ("Use", ["transactions", "keys", "memo", "rpc", "config", "utils"]),
        ("Reference", ["environments", "migrate", "reference"]),
    ]
    by_id = {i: (t, h) for t, h, i in NAV}
    out = []
    for label, ids in groups:
        out.append(f"<label>{label}</label>")
        for i in ids:
            title, href = by_id[i]
            cur = ' class="current"' if i == current else ""
            out.append(f'<a href="{href}" data-page="{i}"{cur}>{title}</a>')
    return "\n".join(out)


def page(pid: str, title: str, kicker: str, lead: str, body: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title} — hive-tx</title>
  <meta name="description" content="{lead}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="assets/style.css">
</head>
<body data-page="{pid}">
  <a class="skip" href="#main">Skip to content</a>
  <header class="top">
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    <a class="brand" href="index.html">hive-tx <small>v7</small></a>
    <div class="top-actions">
      <a class="pill" href="https://github.com/mahdiyari/hive-tx">GitHub</a>
      <a class="pill primary" href="https://www.npmjs.com/package/hive-tx">npm</a>
    </div>
  </header>
  <div class="shell">
    <aside id="nav">{nav_html(pid)}</aside>
    <main id="main">
      <article>
        <p class="kicker">{kicker}</p>
        <h1>{title}</h1>
        <p class="lead">{lead}</p>
        {body}
        <p class="footer-note">hive-tx is MIT licensed.</p>
      </article>
    </main>
  </div>
  <script src="assets/site.js"></script>
</body>
</html>
"""


PAGES = {}

PAGES["index"] = (
    "index",
    "hive-tx documentation",
    "Overview",
    "hive-tx is a TypeScript library for the Hive blockchain. The library creates transactions, signs data, and calls Hive APIs.",
    """
<div class="cards">
  <a class="card" href="install.html"><h3>Install</h3><p>Add the package. Use Node.js 20 or later.</p></a>
  <a class="card" href="start.html"><h3>Quick start</h3><p>Create one vote transaction and broadcast it.</p></a>
  <a class="card" href="examples.html"><h3>Examples</h3><p>Transfers, comments, memos, RPC, keys, and more.</p></a>
  <a class="card" href="reference.html"><h3>API reference</h3><p>Classes, functions, and types.</p></a>
</div>
<h2>What the library does</h2>
<p>hive-tx does this work:</p>
<ul>
  <li>Build Hive operations with TypeScript types.</li>
  <li>Sign operations with secp256k1 keys.</li>
  <li>Broadcast signed transactions.</li>
  <li>Call JSON-RPC methods and REST endpoints.</li>
  <li>Encrypt memos and decrypt memos.</li>
</ul>
<p>The library runs in Node.js, in a browser, and in a serverless runtime. The package includes ESM and CommonJS builds. Crypto code is inside the build. The package has no runtime npm dependencies.</p>
<h2>Requirements</h2>
<ul>
  <li>Node.js 20 or later, or a browser that supports ES2024 and <code>fetch</code>.</li>
  <li>A Hive account and the correct private key for each operation.</li>
</ul>
<h2>Document map</h2>
<ol>
  <li>Install the package.</li>
  <li>Complete the <a href="start.html">quick start</a>.</li>
  <li>Copy a pattern from <a href="examples.html">examples</a>.</li>
  <li>Use the API reference for names and parameters.</li>
</ol>
""",
)

PAGES["install"] = (
    "install",
    "Install hive-tx",
    "Install",
    "Add hive-tx to a Node.js project or load the ESM file in a browser.",
    """
<h2>Node.js</h2>
<p>Node.js 20 or later is required.</p>
<ol class="steps">
  <li>Open a terminal in the project directory.</li>
  <li>Install the package.</li>
</ol>
<pre><code>npm install hive-tx --save</code></pre>
<p>You can use pnpm or yarn. The package name is <code>hive-tx</code>.</p>
<h2>Import the library</h2>
<p>Use an ESM import:</p>
<pre><code>import { Transaction, PrivateKey, callRPC } from 'hive-tx'</code></pre>
<p>Use a CommonJS require:</p>
<pre><code>const { Transaction, PrivateKey, callRPC } = require('hive-tx')</code></pre>
<p>Use hive-tx 7.2.1 or later for CommonJS. Version 7.2.0 CommonJS is not valid.</p>
<h2>Browser</h2>
<p>Load the ESM build from a CDN:</p>
<pre><code>&lt;script type="module"&gt;
  import { Transaction, PrivateKey } from
    'https://cdn.jsdelivr.net/npm/hive-tx@7/dist/index.mjs'
&lt;/script&gt;</code></pre>
<h2>What the package contains</h2>
<table>
  <thead><tr><th>File</th><th>Use</th></tr></thead>
  <tbody>
    <tr><td><code>dist/index.mjs</code></td><td>ESM for Node.js, browsers, workers, and serverless runtimes</td></tr>
    <tr><td><code>dist/index.cjs</code></td><td>CommonJS for Node.js and CommonJS bundlers</td></tr>
    <tr><td><code>dist/index.d.mts</code></td><td>TypeScript types for ESM</td></tr>
    <tr><td><code>dist/index.d.cts</code></td><td>TypeScript types for CommonJS</td></tr>
  </tbody>
</table>
<p>The application selects the correct file through the <code>exports</code> field in <code>package.json</code>.</p>
""",
)

PAGES["start"] = (
    "start",
    "Quick start",
    "Start",
    "Install the package. Create a vote. Call an API. Derive a key.",
    """
<h2>Install</h2>
<pre><code>npm install hive-tx --save</code></pre>
<pre><code>import { Transaction, PrivateKey, callRPC } from 'hive-tx'</code></pre>
<h2>Create a vote</h2>
<ol class="steps">
  <li>Create a <code>Transaction</code> object.</li>
  <li>Add a <code>vote</code> operation.</li>
  <li>Load the posting private key.</li>
  <li>Sign. Broadcast.</li>
</ol>
<pre><code>import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'guest123',
  author: 'guest123',
  permlink: '20191107t125713486z-post',
  weight: 9500
})

const privateKey = PrivateKey.from(
  '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg'
)
tx.sign(privateKey)
const result = await tx.broadcast()
console.log(result.tx_id)</code></pre>
<p><code>weight</code> 10000 is a 100 percent upvote. A negative weight is a downvote.</p>
<p>A vote needs the posting key. A transfer needs the active key. If one transaction mixes those operations, sign with both keys.</p>
<h2>Create a transfer</h2>
<pre><code>const tx = new Transaction()
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'Thanks'
})
tx.sign(PrivateKey.from('5J...active-key'))
const result = await tx.broadcast()
console.log(result.tx_id, result.status)</code></pre>
<h2>Call an API</h2>
<pre><code>import { callRPC } from 'hive-tx'

const accounts = await callRPC('condenser_api.get_accounts', [['mahdiyari']])
console.log(accounts[0].name, accounts[0].balance)</code></pre>
<p>On RPC errors the function throws <code>RPCError</code>. It does not wrap the result in <code>.result</code>.</p>
<h2>Create keys</h2>
<pre><code>import { PrivateKey, PublicKey } from 'hive-tx'

const key1 = PrivateKey.from('5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg')
const key2 = PrivateKey.randomKey()
const key3 = PrivateKey.fromLogin('username', 'password', 'posting')
const pub = key1.createPublic()
console.log(pub.toString())</code></pre>
<p>More patterns are on the <a href="examples.html">examples</a> page.</p>
""",
)

PAGES["examples"] = (
    "examples",
    "Examples",
    "Start",
    "Copy these patterns. Replace keys and account names with your values.",
    """
<h2>Transfer HIVE</h2>
<pre><code>import { Transaction, PrivateKey } from 'hive-tx'

async function transferHive() {
  const tx = new Transaction()
  await tx.addOperation('transfer', {
    from: 'myaccount',
    to: 'recipient',
    amount: '1.000 HIVE',
    memo: 'Thank you!'
  })
  const privateKey = PrivateKey.from('5J...active-key')
  tx.sign(privateKey)
  const result = await tx.broadcast()
  console.log(result.tx_id, result.status)
}</code></pre>
<p>v7 returns <code>{ tx_id, status }</code>. It does not return <code>result.result.tx_id</code>.</p>
<h2>Comment</h2>
<pre><code>const tx = new Transaction()
await tx.addOperation('comment', {
  parent_author: '',
  parent_permlink: 'hive',
  author: 'myaccount',
  permlink: 'hello-hive',
  title: 'Hello',
  body: 'First post',
  json_metadata: JSON.stringify({ tags: ['hive'], app: 'hive-tx' })
})
tx.sign(PrivateKey.from('5J...posting-key'))
await tx.broadcast()</code></pre>
<p>A root post uses an empty <code>parent_author</code>. A reply sets <code>parent_author</code> and <code>parent_permlink</code> to the parent comment.</p>
<h2>custom_json</h2>
<pre><code>await tx.addOperation('custom_json', {
  required_auths: [],
  required_posting_auths: ['myaccount'],
  id: 'follow',
  json: JSON.stringify(['follow', {
    follower: 'myaccount',
    following: 'alice',
    what: ['blog']
  }])
})</code></pre>
<h2>Sign and verify</h2>
<pre><code>import { Transaction, PrivateKey, Signature } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'myaccount',
  author: 'some-author',
  permlink: 'some-post-permlink',
  weight: 10000
})
const privateKey = PrivateKey.from(
  '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg'
)
tx.sign(privateKey)
const signature = tx.transaction.signatures[0]
const digest = tx.digest().digest
const ok1 = privateKey.createPublic().verify(digest, signature)
const ok2 =
  Signature.from(signature).getPublicKey(digest).toString() ===
  privateKey.createPublic().toString()
console.log(ok1, ok2)</code></pre>
<h2>Multi-signature</h2>
<pre><code>tx.sign([ownerKey, activeKey])
// or
tx.sign(ownerKey)
tx.sign(activeKey)</code></pre>
<h2>Wait for an irreversible block</h2>
<pre><code>const result = await tx.broadcast(true)
console.log(result.status)
// 'within_irreversible_block' | 'expired_irreversible' | 'too_old' | 'unknown'</code></pre>
<h2>JSON-RPC</h2>
<pre><code>import { callRPC } from 'hive-tx'

const accounts = await callRPC('condenser_api.get_accounts', [['hiveio']])
const props = await callRPC('condenser_api.get_dynamic_global_properties')
console.log(accounts[0].name, props.head_block_number)</code></pre>
<p>API method names: <a href="https://developers.hive.io/apidefinitions/">Hive API definitions</a>.</p>
<h2>Quorum</h2>
<pre><code>import { callWithQuorum } from 'hive-tx'

const accounts = await callWithQuorum(
  'condenser_api.get_accounts',
  [['hiveio']],
  2
)</code></pre>
<p>Quorum is JSON equality across nodes. It is not a head-lag check.</p>
<h2>Account history filter</h2>
<pre><code>import { callRPC, utils } from 'hive-tx'

const filter = utils.makeBitMaskFilter([
  utils.operations.transfer,
  utils.operations.vote,
  utils.operations.comment
])
const history = await callRPC('condenser_api.get_account_history', [
  'myaccount',
  -1,
  100,
  ...filter
])</code></pre>
<h2>REST</h2>
<pre><code>import { callREST } from 'hive-tx'

const balance = await callREST('balance', '/accounts/{account-name}/balances', {
  'account-name': 'alice'
})</code></pre>
<p>REST nodes are in <code>config.restNodes</code>. Browse endpoints on a node such as <a href="https://rpc.mahdiyari.info">rpc.mahdiyari.info</a>.</p>
<h2>Encrypt a memo</h2>
<pre><code>import { Memo, PrivateKey } from 'hive-tx'

const senderMemoKey = PrivateKey.from('5J...sender-memo-key')
const encrypted = Memo.encode(
  senderMemoKey,
  'STM...recipient-memo-public-key',
  '#Hello World!'
)
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '0.001 HIVE',
  memo: encrypted
})</code></pre>
<p>Text without a leading <code>#</code> is not encrypted.</p>
<h2>Decrypt a memo</h2>
<pre><code>const text = Memo.decode(
  PrivateKey.from('5J...recipient-memo-key'),
  encryptedMemo
)</code></pre>
<h2>Generate keys</h2>
<pre><code>import { PrivateKey } from 'hive-tx'

const privateKey = PrivateKey.randomKey()
const publicKey = privateKey.createPublic()
console.log(privateKey.inspect())
console.log(publicKey.toString())</code></pre>
<h2>Keys from a master password</h2>
<pre><code>const owner = PrivateKey.fromLogin('username', 'master-password', 'owner')
const active = PrivateKey.fromLogin('username', 'master-password', 'active')
const posting = PrivateKey.fromLogin('username', 'master-password', 'posting')
const memo = PrivateKey.fromLogin('username', 'master-password', 'memo')</code></pre>
<p><code>fromLogin</code> is a static method on <code>PrivateKey</code>. Do not call it on a key instance.</p>
<h2>Validate a username</h2>
<pre><code>import { utils } from 'hive-tx'

for (const name of ['alice', 'a', 'BadName']) {
  const error = utils.validateUsername(name)
  console.log(name, error === null ? 'valid' : error)
}</code></pre>
<h2>Witness set properties</h2>
<pre><code>import { utils, Transaction } from 'hive-tx'

const operation = utils.buildWitnessSetProperties('mywitness', {
  key: 'STM1111111111111111111111111111111114T1Anm',
  account_creation_fee: '0.000 HIVE',
  account_subsidy_budget: 10000,
  account_subsidy_decay: 330782,
  maximum_block_size: 65536,
  hbd_interest_rate: 0,
  hbd_exchange_rate: { base: '0.250 HBD', quote: '1.000 HIVE' },
  url: 'https://example.com'
})
const tx = new Transaction()
await tx.addOperation(operation[0], operation[1])
tx.sign(PrivateKey.from('5J...active-key'))
await tx.broadcast()</code></pre>
<p><code>key</code> is required. It is the current signing public key.</p>
<h2>Handle RPC errors</h2>
<pre><code>import { callRPC } from 'hive-tx'

try {
  await callRPC('condenser_api.get_accounts', [['alice']])
} catch (e) {
  if (e && e.name === 'RPCError') {
    console.log(e.code, e.message, e.data)
  } else {
    throw e
  }
}</code></pre>
<p><code>RPCError</code> is thrown for Hive JSON-RPC errors. Network failures retry, then throw a normal error.</p>
<h2>Browser</h2>
<pre><code>&lt;script type="module"&gt;
  import { PrivateKey } from
    'https://cdn.jsdelivr.net/npm/hive-tx@7/dist/index.mjs'
  const pub = PrivateKey.fromLogin('alice', 'x', 'posting').createPublic()
  console.log(pub.toString())
&lt;/script&gt;</code></pre>
""",
)

PAGES["transactions"] = (
    "transactions",
    "Transactions",
    "Use",
    "A Transaction object holds operations, signatures, and expiration data.",
    """
<h2>Create a transaction</h2>
<pre><code>const tx = new Transaction()
const txLong = new Transaction({ expiration: 120_000 })</code></pre>
<p>Expiration is in milliseconds. The default is 60000 (1 minute). The maximum is 86400000 (24 hours).</p>
<p>You can wrap an existing transaction object:</p>
<pre><code>const tx = new Transaction({ transaction: rawTx })</code></pre>
<h2>Add an operation</h2>
<p><code>addOperation</code> is async. The first call gets chain properties and sets <code>ref_block_num</code> and <code>ref_block_prefix</code>.</p>
<pre><code>await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'payment'
})</code></pre>
<p>You can add more than one operation to the same transaction.</p>
<h2>Sign</h2>
<p><code>sign</code> accepts one <code>PrivateKey</code> or an array of keys.</p>
<pre><code>tx.sign(privateKey)
tx.sign([postingKey, activeKey])</code></pre>
<p>If there is no transaction, <code>sign</code> throws an error. Call <code>addOperation</code> first.</p>
<h2>Broadcast</h2>
<pre><code>const quick = await tx.broadcast()
const confirmed = await tx.broadcast(true)</code></pre>
<table>
  <thead><tr><th>Argument</th><th>Result</th></tr></thead>
  <tbody>
    <tr><td><code>false</code> (default)</td><td>The function returns after the node accepts the transaction. Status is <code>unknown</code>.</td></tr>
    <tr><td><code>true</code></td><td>The function waits until the transaction is in an irreversible block, or until the transaction expires.</td></tr>
  </tbody>
</table>
<p>If there is no signature, <code>broadcast</code> throws an error.</p>
<p>If a retry causes a duplicate transaction error, the library ignores that error.</p>
<h2>Digest and transaction id</h2>
<pre><code>const { digest, txId } = tx.digest()</code></pre>
<p><code>digest</code> is a 32-byte hash. Use the digest to verify a signature. <code>txId</code> is the first 40 hex characters of the SHA-256 hash of the serialized transaction.</p>
<h2>Add an external signature</h2>
<p>Use <code>addSignature</code> when an external tool creates the signature. The signature must be a hex string with 130 characters.</p>
<pre><code>tx.addSignature(hexSignature)</code></pre>
<h2>Status values</h2>
<table>
  <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>unknown</code></td><td>The library did not wait for a block, or the wait ended at expiration.</td></tr>
    <tr><td><code>within_irreversible_block</code></td><td>The transaction is in an irreversible block.</td></tr>
    <tr><td><code>expired_irreversible</code></td><td>The transaction expired.</td></tr>
    <tr><td><code>too_old</code></td><td>The transaction is too old for the node.</td></tr>
  </tbody>
</table>
""",
)

PAGES["keys"] = (
    "keys",
    "Keys and signatures",
    "Use",
    "PrivateKey, PublicKey, and Signature create Hive keys and verify signatures.",
    """
<h2>PrivateKey</h2>
<p>A private key is a secp256k1 secret. The WIF string is the storage format.</p>
<pre><code>import { PrivateKey } from 'hive-tx'

const fromWif = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
const random = PrivateKey.randomKey()
const fromSeed = PrivateKey.fromSeed('my-secret-seed')
const posting = PrivateKey.fromLogin('alice', 'master-password', 'posting')</code></pre>
<table>
  <thead><tr><th>Method</th><th>Input</th><th>Output</th></tr></thead>
  <tbody>
    <tr><td><code>from</code></td><td>WIF string or 32-byte <code>Uint8Array</code></td><td>PrivateKey</td></tr>
    <tr><td><code>fromString</code></td><td>WIF string</td><td>PrivateKey</td></tr>
    <tr><td><code>fromSeed</code></td><td>UTF-8 string, hex string, or bytes</td><td>SHA-256 of the seed as a key</td></tr>
    <tr><td><code>fromLogin</code></td><td>username, password, role</td><td>Hive login key for that role</td></tr>
    <tr><td><code>randomKey</code></td><td>none</td><td>New random key</td></tr>
    <tr><td><code>createPublic</code></td><td>optional prefix</td><td>PublicKey</td></tr>
    <tr><td><code>sign</code></td><td>32-byte hash</td><td>Signature</td></tr>
    <tr><td><code>toString</code></td><td>none</td><td>WIF string</td></tr>
    <tr><td><code>inspect</code></td><td>none</td><td>Masked WIF string</td></tr>
    <tr><td><code>getSharedSecret</code></td><td>PublicKey</td><td>64-byte secret for memo encryption</td></tr>
  </tbody>
</table>
<p>Roles for <code>fromLogin</code> are <code>owner</code>, <code>active</code>, <code>posting</code>, and <code>memo</code>. The default role is <code>active</code>.</p>
<p>The seed for <code>fromLogin</code> is <code>username + role + password</code>.</p>
<h2>PublicKey</h2>
<p>A Hive public key string starts with the address prefix. The default prefix is <code>STM</code>.</p>
<pre><code>import { PublicKey } from 'hive-tx'

const pub = privateKey.createPublic()
const fromStr = PublicKey.from('STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA')
const ok = pub.verify(messageHash, signature)</code></pre>
<table>
  <thead><tr><th>Method</th><th>Function</th></tr></thead>
  <tbody>
    <tr><td><code>from</code> / <code>fromString</code></td><td>Read a public key string.</td></tr>
    <tr><td><code>verify</code></td><td>Return true if the signature matches the 32-byte hash.</td></tr>
    <tr><td><code>toString</code> / <code>toJSON</code></td><td>Return the public key string with prefix.</td></tr>
  </tbody>
</table>
<h2>Signature</h2>
<p>A compact recoverable signature is a hex string with 130 characters.</p>
<pre><code>import { Signature } from 'hive-tx'

const sig = Signature.from(hex)
const recovered = sig.getPublicKey(messageHash)
const hexOut = sig.customToString()</code></pre>
<p><code>getPublicKey</code> needs a 32-byte hash as <code>Uint8Array</code> or a 64-character hex string.</p>
<p>To recover a Hive Keychain <code>requestSignBuffer</code> proof:</p>
<ol class="steps">
  <li>Create a SHA-256 hash of the UTF-8 message.</li>
  <li>Remove a leading <code>0x</code> from the signature if it is present.</li>
  <li>Call <code>Signature.from(hex).getPublicKey(hash).toString()</code>.</li>
</ol>
""",
)

PAGES["memo"] = (
    "memo",
    "Memos",
    "Use",
    "Memo.encode encrypts a private message. Memo.decode decrypts the message.",
    """
<h2>Rules</h2>
<ul>
  <li>If the memo text starts with <code>#</code>, the library encrypts the text.</li>
  <li>If the memo text does not start with <code>#</code>, the library returns the text with no change.</li>
  <li>Use the sender memo private key to encrypt.</li>
  <li>Use the recipient memo public key to encrypt.</li>
  <li>Use the recipient memo private key to decrypt.</li>
</ul>
<h2>Encrypt</h2>
<pre><code>import { Memo, PrivateKey } from 'hive-tx'

const senderMemoKey = PrivateKey.from('5J...sender-memo-key')
const encrypted = Memo.encode(
  senderMemoKey,
  'STM...recipient-memo-public-key',
  '#Hello'
)</code></pre>
<p>Put the encrypted string in a transfer <code>memo</code> field.</p>
<h2>Decrypt</h2>
<pre><code>const recipientMemoKey = PrivateKey.from('5J...recipient-memo-key')
const text = Memo.decode(recipientMemoKey, encryptedMemo)
// text starts with '#'</code></pre>
<div class="callout caution">
  <strong>Caution</strong>
  Encryption uses AES in CBC mode. The memo key is not the posting key. The memo key is not the active key.
</div>
""",
)

PAGES["rpc"] = (
    "rpc",
    "RPC and REST calls",
    "Use",
    "callRPC, callREST, and callWithQuorum send requests to Hive nodes.",
    """
<h2>callRPC</h2>
<p><code>callRPC</code> sends a JSON-RPC 2.0 request. The function returns the result. The function throws <code>RPCError</code> for a Hive RPC error.</p>
<pre><code>import { callRPC } from 'hive-tx'

const accounts = await callRPC('condenser_api.get_accounts', [['alice']])
const props = await callRPC('condenser_api.get_dynamic_global_properties')</code></pre>
<p>Parameters:</p>
<table>
  <thead><tr><th>Name</th><th>Default</th><th>Function</th></tr></thead>
  <tbody>
    <tr><td><code>method</code></td><td>required</td><td>API method name</td></tr>
    <tr><td><code>params</code></td><td><code>[]</code></td><td>Array or object</td></tr>
    <tr><td><code>timeout</code></td><td><code>config.timeout</code></td><td>Timeout in milliseconds</td></tr>
    <tr><td><code>retry</code></td><td><code>config.retry</code></td><td>Retry count after a network failure</td></tr>
  </tbody>
</table>
<p>If a node does not respond, the library selects the next URL in <code>config.nodes</code>.</p>
<p>Hive API names are in the Hive developer documentation.</p>
<h2>callWithQuorum</h2>
<p><code>callWithQuorum</code> sends the same method to more than one node. The function returns a result only if that number of nodes give the same JSON.</p>
<pre><code>import { callWithQuorum } from 'hive-tx'

const accounts = await callWithQuorum(
  'condenser_api.get_accounts',
  [['alice']],
  2
)</code></pre>
<p>The default quorum is 2. The quorum must be less than or equal to <code>config.nodes.length</code>.</p>
<div class="callout note">
  <strong>Note</strong>
  Quorum is JSON equality. Quorum is not a check of head-block lag. Do not change <code>config.nodes</code> during concurrent calls.
</div>
<h2>callREST</h2>
<p><code>callREST</code> calls a REST API on <code>config.restNodes</code>. Not all public nodes have REST APIs.</p>
<pre><code>import { callREST } from 'hive-tx'

const balance = await callREST(
  'balance',
  '/accounts/{account-name}/balances',
  { 'account-name': 'alice' }
)</code></pre>
<p>API names:</p>
<ul>
  <li><code>balance</code></li>
  <li><code>hafah</code></li>
  <li><code>hafbe</code></li>
  <li><code>hivemind</code></li>
  <li><code>hivesense</code></li>
  <li><code>reputation</code></li>
  <li><code>nft-tracker</code></li>
  <li><code>hafsql</code></li>
  <li><code>status</code></li>
</ul>
<p>A path parameter uses <code>{name}</code> in the path. Other fields become query parameters. TypeScript checks path names for each API.</p>
<h2>RPCError</h2>
<p><code>RPCError</code> has <code>message</code>, <code>code</code>, and optional <code>data</code>.</p>
""",
)

PAGES["config"] = (
    "config",
    "Configuration",
    "Use",
    "The config object sets nodes, timeouts, chain id, and the address prefix.",
    """
<pre><code>import { config } from 'hive-tx'

config.nodes = [
  'https://api.hive.blog',
  'https://api.deathwing.me',
  'https://api.openhive.network',
  'https://rpc.mahdiyari.info',
  'https://techcoderx.com',
  'https://hiveapi.actifit.io',
  'https://api.c0ff33a.uk'
]
config.restNodes = [
  'https://api.hive.blog',
  'https://rpc.mahdiyari.info',
  'https://techcoderx.com',
  'https://hiveapi.actifit.io',
  'https://api.c0ff33a.uk'
]
config.timeout = 10_000
config.retry = 8
config.address_prefix = 'STM'
config.chain_id = 'beeab0de00000000000000000000000000000000000000000000000000000000'</code></pre>
<table>
  <thead><tr><th>Field</th><th>Unit</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td><code>nodes</code></td><td>URL array</td><td>Public JSON-RPC nodes</td></tr>
    <tr><td><code>restNodes</code></td><td>URL array with no trailing slash</td><td>Public REST nodes</td></tr>
    <tr><td><code>timeout</code></td><td>milliseconds</td><td>10000</td></tr>
    <tr><td><code>retry</code></td><td>count</td><td>8</td></tr>
    <tr><td><code>address_prefix</code></td><td>string</td><td><code>STM</code></td></tr>
    <tr><td><code>chain_id</code></td><td>64 hex characters</td><td>Hive mainnet chain id</td></tr>
  </tbody>
</table>
<div class="callout caution">
  <strong>Caution</strong>
  <code>config</code> is global for the process. Concurrent tasks that change <code>config.nodes</code> can select the wrong node. Set the node list once at start.
</div>
<p>Timeout and expiration values are in milliseconds in v7. In v6 those values were in seconds.</p>
""",
)

PAGES["utils"] = (
    "utils",
    "Utilities",
    "Use",
    "The utils object validates names, builds history filters, and builds witness properties.",
    """
<h2>validateUsername</h2>
<p>The function returns <code>null</code> if the name is valid. The function returns an error string if the name is not valid.</p>
<pre><code>import { utils } from 'hive-tx'

const error = utils.validateUsername('alice')
if (error) {
  console.log(error)
}</code></pre>
<h2>makeBitMaskFilter</h2>
<p>Use the filter with <code>condenser_api.get_account_history</code>.</p>
<pre><code>const filter = utils.makeBitMaskFilter([
  utils.operations.transfer,
  utils.operations.vote,
  utils.operations.comment
])
const history = await callRPC('condenser_api.get_account_history', [
  'alice',
  -1,
  100,
  ...filter
])</code></pre>
<p><code>utils.operations</code> maps operation names to numeric ids. Example: <code>vote</code> is 0. <code>transfer</code> is 2.</p>
<h2>buildWitnessSetProperties</h2>
<p>This helper is required for <code>witness_set_properties</code>. The helper serializes property values to hex.</p>
<pre><code>const operation = utils.buildWitnessSetProperties('mywitness', {
  key: 'STM1111111111111111111111111111111114T1Anm',
  account_creation_fee: '0.000 HIVE',
  maximum_block_size: 65536,
  url: 'https://example.com'
})
const tx = new Transaction()
await tx.addOperation(operation[0], operation[1])</code></pre>
<p>The <code>key</code> field is required. The field is the current signing public key.</p>
""",
)

PAGES["environments"] = (
    "environments",
    "Environments",
    "Reference",
    "hive-tx supports Node.js, browsers, workers, and serverless runtimes.",
    """
<h2>Module formats</h2>
<p>The package type is <code>module</code>. The package also ships CommonJS.</p>
<ul>
  <li>ESM: <code>import { PrivateKey } from 'hive-tx'</code></li>
  <li>CommonJS: <code>const { PrivateKey } = require('hive-tx')</code></li>
</ul>
<p>Use version 7.2.1 or later. Version 7.2.0 CommonJS throws an error on key encoding.</p>
<h2>Node.js</h2>
<p>The engine field is <code>node &gt;= 20</code>. The library uses <code>fetch</code> and <code>AbortSignal.timeout</code>.</p>
<h2>Browser and CDN</h2>
<p>Load <code>dist/index.mjs</code>. The file has no extra chunk. Crypto code is in the file.</p>
<h2>Serverless</h2>
<p>The build has no nested runtime packages. A Lambda or a Worker can load the file without <code>bs58</code> or <code>@noble/*</code> in <code>node_modules</code>.</p>
<p>Do not change <code>config.nodes</code> in each concurrent invocation if those invocations share a process.</p>
<h2>Tests</h2>
<p>From 7.2.1 the published files are self-contained. Jest 30 can load hive-tx in the Node environment:</p>
<pre><code>const { PrivateKey } = require('hive-tx')

test('derives a posting key', () => {
  const pub = PrivateKey.fromLogin('alice', 'x', 'posting').createPublic().toString()
  expect(pub.startsWith('STM')).toBe(true)
})</code></pre>
<p>ESM Jest also works with <code>NODE_OPTIONS=--experimental-vm-modules</code> and a <code>.mjs</code> test file. Version 7.2.0 CommonJS fails in Jest because of a <code>bs58</code> interop bug. Use 7.2.1 or later.</p>
""",
)

PAGES["migrate"] = (
    "migrate",
    "Migration from v6",
    "Reference",
    "Version 7 is a TypeScript rewrite. Some names and units changed.",
    """
<table>
  <thead><tr><th>v6</th><th>v7</th></tr></thead>
  <tbody>
    <tr><td><code>tx.create([[name, body]])</code></td><td><code>await tx.addOperation(name, body)</code></td></tr>
    <tr><td><code>call()</code></td><td><code>callRPC()</code> returns the result and throws <code>RPCError</code></td></tr>
    <tr><td><code>broadcast(timeout, retry)</code></td><td><code>broadcast(checkStatus)</code></td></tr>
    <tr><td>Timeout in seconds</td><td>Timeout in milliseconds</td></tr>
    <tr><td><code>new Transaction(tx)</code></td><td><code>new Transaction({ transaction, expiration })</code></td></tr>
    <tr><td><code>Transaction.signedTransaction</code></td><td><code>Transaction.transaction</code></td></tr>
    <tr><td><code>config.node</code> string</td><td><code>config.nodes</code> array</td></tr>
    <tr><td><code>config.healthcheckInterval</code></td><td>Removed</td></tr>
  </tbody>
</table>
<h2>Create a transaction</h2>
<pre><code>// v6
const tx = new Transaction()
await tx.create([['vote', { voter: 'alice', author: 'bob', permlink: 'post', weight: 10000 }]])

// v7
const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'alice',
  author: 'bob',
  permlink: 'post',
  weight: 10000
})</code></pre>
<h2>API call</h2>
<pre><code>// v6
const result = await call('condenser_api.get_accounts', [['alice']])
const accounts = result.result

// v7
const accounts = await callRPC('condenser_api.get_accounts', [['alice']])</code></pre>
<h2>Configuration</h2>
<pre><code>// v6
config.node = 'https://api.hive.blog'
config.timeout = 10

// v7
config.nodes = ['https://api.hive.blog', 'https://api.deathwing.me']
config.timeout = 10_000</code></pre>
""",
)

PAGES["reference"] = (
    "reference",
    "API reference",
    "Reference",
    "This page lists public exports. TypeScript files in dist give full types.",
    """
<h2>Exports</h2>
<pre><code>import {
  Transaction,
  PrivateKey,
  PublicKey,
  Signature,
  Memo,
  callRPC,
  callREST,
  callWithQuorum,
  config,
  utils
} from 'hive-tx'</code></pre>
<h2>Transaction</h2>
<table>
  <thead><tr><th>Member</th><th>Type</th></tr></thead>
  <tbody>
    <tr><td><code>constructor(options?)</code></td><td><code>{ transaction?, expiration? }</code></td></tr>
    <tr><td><code>addOperation(name, body)</code></td><td><code>Promise&lt;void&gt;</code></td></tr>
    <tr><td><code>sign(keys)</code></td><td><code>PrivateKey | PrivateKey[]</code> → <code>TransactionType</code></td></tr>
    <tr><td><code>broadcast(checkStatus?)</code></td><td><code>Promise&lt;BroadcastResult&gt;</code></td></tr>
    <tr><td><code>digest()</code></td><td><code>{ digest: Uint8Array, txId: string }</code></td></tr>
    <tr><td><code>addSignature(hex)</code></td><td>130-character hex string</td></tr>
    <tr><td><code>checkStatus()</code></td><td><code>Promise&lt;TransactionStatus&gt;</code></td></tr>
    <tr><td><code>transaction</code></td><td><code>TransactionType | undefined</code></td></tr>
    <tr><td><code>expiration</code></td><td>milliseconds, default 60000</td></tr>
  </tbody>
</table>
<h2>BroadcastResult</h2>
<pre><code>{
  tx_id: string
  status: 'unknown' | 'within_irreversible_block' | 'expired_irreversible' | 'too_old'
}</code></pre>
<h2>callRPC</h2>
<p><code>callRPC(method, params?, timeout?, retry?): Promise&lt;T&gt;</code></p>
<h2>callWithQuorum</h2>
<p><code>callWithQuorum(method, params?, quorum?): Promise&lt;T&gt;</code></p>
<h2>callREST</h2>
<p><code>callREST(api, endpoint, params?, timeout?, retry?): Promise&lt;...&gt;</code></p>
<h2>Memo</h2>
<p><code>Memo.encode(privateKey, publicKey, memo): string</code></p>
<p><code>Memo.decode(privateKey, memo): string</code></p>
<h2>Operation names</h2>
<p>TypeScript accepts Hive operation names as the first argument of <code>addOperation</code>. The body type matches the name. Common names:</p>
<ul>
  <li><code>vote</code>, <code>comment</code>, <code>delete_comment</code>, <code>comment_options</code></li>
  <li><code>transfer</code>, <code>transfer_to_vesting</code>, <code>withdraw_vesting</code></li>
  <li><code>custom_json</code>, <code>custom</code></li>
  <li><code>delegate_vesting_shares</code>, <code>claim_reward_balance</code></li>
  <li><code>account_update</code>, <code>account_update2</code>, <code>account_create</code></li>
  <li><code>account_witness_vote</code>, <code>account_witness_proxy</code></li>
  <li><code>recurrent_transfer</code>, <code>witness_update</code>, <code>witness_set_properties</code></li>
</ul>
<p>The full list is in <code>src/types.ts</code>.</p>
<h2>Support</h2>
<p>Use the Hive Discord server. The channel is <code>#dev-chat</code>.</p>
""",
)


def main() -> None:
    files = {
        "index.html": PAGES["index"],
        "install.html": PAGES["install"],
        "start.html": PAGES["start"],
        "examples.html": PAGES["examples"],
        "transactions.html": PAGES["transactions"],
        "keys.html": PAGES["keys"],
        "memo.html": PAGES["memo"],
        "rpc.html": PAGES["rpc"],
        "config.html": PAGES["config"],
        "utils.html": PAGES["utils"],
        "environments.html": PAGES["environments"],
        "migrate.html": PAGES["migrate"],
        "reference.html": PAGES["reference"],
    }
    for name, args in files.items():
        (ROOT / name).write_text(page(*args), encoding="utf-8")
        print("wrote", name)


if __name__ == "__main__":
    main()
