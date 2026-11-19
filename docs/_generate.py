#!/usr/bin/env python3
"""Generate hive-tx GitHub Pages HTML. Run from repository root: python3 docs/_generate.py"""
import html as html_lib
import re
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
    ("Streams", "streams.html", "streams"),
    ("Configuration", "config.html", "config"),
    ("Utilities", "utils.html", "utils"),
    ("Environments", "environments.html", "environments"),
    ("Migration from v6", "migrate.html", "migrate"),
    ("API reference", "reference.html", "reference"),
]


CODE_BLOCK = re.compile(r"<pre><code>(.*?)</code></pre>", re.S)


def guess_lang(raw: str) -> str:
    text = html_lib.unescape(raw).lstrip()
    first = text.splitlines()[0] if text else ""
    if first.startswith("<") or first.startswith("<script"):
        return "xml"
    if first.startswith(("npm ", "npx ", "NODE_OPTIONS")):
        return "bash"
    return "javascript"


def tag_code(body: str) -> str:
    def repl(match: re.Match[str]) -> str:
        inner = match.group(1)
        return f'<pre><code class="language-{guess_lang(inner)}">{inner}</code></pre>'

    return CODE_BLOCK.sub(repl, body)


def nav_html(current: str) -> str:
    groups = [
        ("Start", ["index", "install", "start", "examples"]),
        ("Use", ["transactions", "keys", "memo", "rpc", "streams", "config", "utils"]),
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
  <meta property="og:type" content="website">
  <meta property="og:title" content="{title} — hive-tx">
  <meta property="og:description" content="{lead}">
  <meta property="og:image" content="https://mahdiyari.github.io/hive-tx/assets/cover.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="assets/style.css">
  <script>
    (function () {{
      var key = 'hive-tx-theme'
      var stored = localStorage.getItem(key)
      var theme = stored === 'light' || stored === 'dark'
        ? stored
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme', theme)
    }})()
  </script>
</head>
<body data-page="{pid}">
  <a class="skip" href="#main">Skip to content</a>
  <header class="top">
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav">Menu</button>
    <a class="brand" href="index.html">hive-tx <small>v7</small></a>
    <div class="top-actions">
      <button class="theme-btn" type="button" data-theme-toggle>Light</button>
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
        {tag_code(body)}
        <p class="footer-note">hive-tx is MIT licensed.</p>
      </article>
    </main>
  </div>
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js"
    integrity="sha384-RH2xi4eIQ/gjtbs9fUXM68sLSi99C7ZWBRX1vDrVv6GQXRibxXLbwO2NGZB74MbU" crossorigin="anonymous"></script>
  <script src="assets/site.js"></script>
</body>
</html>
"""


PAGES = {}

PAGES["index"] = (
    "index",
    "hive-tx documentation",
    "Overview",
    "hive-tx is a lightweight TypeScript SDK for the Hive blockchain. It builds, signs, and broadcasts transactions, calls Hive APIs, and streams the chain.",
    """
<div class="cards">
  <a class="card" href="install.html"><h3>Install</h3><p>Node.js 20+, browsers, workers, and serverless runtimes.</p></a>
  <a class="card" href="start.html"><h3>Quick start</h3><p>Sign and broadcast your first vote.</p></a>
  <a class="card" href="examples.html"><h3>Examples</h3><p>Transfers, comments, memos, RPC, keys, and more.</p></a>
  <a class="card" href="reference.html"><h3>API reference</h3><p>Every export and its signature.</p></a>
</div>
<h2>What it does</h2>
<ul>
  <li>Builds operations with a TypeScript type per operation, then signs and broadcasts them.</li>
  <li>Calls JSON-RPC with node failover, batch requests, and quorum calls that cross-check nodes.</li>
  <li>Calls typed REST APIs: balance, hafah, hafbe, hivemind, and more.</li>
  <li>Streams irreversible blocks and operations, virtual ones included, with no gaps or duplicates.</li>
  <li>Computes voting mana, RC, Hive Power, vote value, APR, account value, and reputation.</li>
  <li>Builds follow, mute, reblog, community, RC delegation, and comment options operations, permlinks, and account keys.</li>
  <li>Checks, grants, and revokes app authority, and verifies login signatures from Hive Keychain and Hivesigner.</li>
  <li>Creates keys, verifies signatures, and encrypts memos by public key or account name.</li>
</ul>
<p>It runs in Node.js, browsers, workers, and serverless runtimes. The package ships ESM and CommonJS builds and has no runtime dependencies: the crypto code is bundled.</p>
<h2>Requirements</h2>
<ul>
  <li>Node.js 20 or later, or a browser with ES2024 and <code>fetch</code>.</li>
  <li>A Hive account and the right private key for each operation.</li>
</ul>
<h2>Where to go next</h2>
<ol>
  <li><a href="install.html">Install</a> the package.</li>
  <li>Work through the <a href="start.html">quick start</a>.</li>
  <li>Copy a pattern from the <a href="examples.html">examples</a>.</li>
  <li>Look up names and parameters in the <a href="reference.html">API reference</a>.</li>
</ol>
""",
)

PAGES["install"] = (
    "install",
    "Install hive-tx",
    "Install",
    "Add hive-tx to a Node.js project, or load the ESM file in a browser.",
    """
<h2>Node.js</h2>
<p>Node.js 20 or later is required.</p>
<pre><code>npm install hive-tx</code></pre>
<p>pnpm and yarn work too.</p>
<h2>Import</h2>
<p>ESM:</p>
<pre><code>import { Transaction, PrivateKey, callRPC } from 'hive-tx'</code></pre>
<p>CommonJS:</p>
<pre><code>const { Transaction, PrivateKey, callRPC } = require('hive-tx')</code></pre>
<h2>Browser</h2>
<p>Load the ESM build from a CDN:</p>
<pre><code>&lt;script type="module"&gt;
  import { Transaction, PrivateKey } from
    'https://cdn.jsdelivr.net/npm/hive-tx@7/dist/index.mjs'
&lt;/script&gt;</code></pre>
<h2>Package contents</h2>
<table>
  <thead><tr><th>File</th><th>Use</th></tr></thead>
  <tbody>
    <tr><td><code>dist/index.mjs</code></td><td>ESM for Node.js, browsers, workers, and serverless runtimes</td></tr>
    <tr><td><code>dist/index.cjs</code></td><td>CommonJS for Node.js and CommonJS bundlers</td></tr>
    <tr><td><code>dist/index.d.mts</code></td><td>TypeScript types for ESM</td></tr>
    <tr><td><code>dist/index.d.cts</code></td><td>TypeScript types for CommonJS</td></tr>
  </tbody>
</table>
<p>The <code>exports</code> field in <code>package.json</code> picks the right file for your setup.</p>
""",
)

PAGES["start"] = (
    "start",
    "Quick start",
    "Start",
    "Cast a vote, send a transfer, call an API, and derive a key.",
    """
<h2>Install</h2>
<pre><code>npm install hive-tx</code></pre>
<h2>Cast a vote</h2>
<ol class="steps">
  <li>Create a <code>Transaction</code>.</li>
  <li>Add a <code>vote</code> operation.</li>
  <li>Sign it with the voter's posting key.</li>
  <li>Broadcast it.</li>
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
<div class="callout note">
  <strong>Note</strong>
  This is the posting key of <code>guest123</code>, a public demo account, so the example runs as-is and casts a real 95% vote. Use your own account and key in your app.
</div>
<p><code>weight</code> runs from -10000 to 10000: 10000 is a full upvote, and a negative weight is a downvote.</p>
<h2>Which key to use</h2>
<p>Your private keys are on your Hive wallet's keys page. Use the lowest role an operation needs: posting for votes, comments, and follows; active for transfers and other fund operations. Never put an owner key in app code. If one transaction mixes posting and active operations, sign it with both keys.</p>
<h2>Send a transfer</h2>
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
<p><code>callRPC</code> returns the result directly and throws <code>RPCError</code> when the node returns an error.</p>
<h2>Derive keys</h2>
<pre><code>import { PrivateKey } from 'hive-tx'

const fromWif = PrivateKey.from('5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg')
const random = PrivateKey.randomKey()
const fromPassword = PrivateKey.fromLogin('username', 'password', 'posting')
console.log(fromWif.createPublic().toString())</code></pre>
<p>More patterns are on the <a href="examples.html">examples</a> page.</p>
""",
)

PAGES["examples"] = (
    "examples",
    "Examples",
    "Start",
    "Patterns to copy. Replace the keys and account names with your own.",
    """
<h2>Transfer HIVE</h2>
<pre><code>import { Transaction, PrivateKey } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('transfer', {
  from: 'myaccount',
  to: 'recipient',
  amount: '1.000 HIVE',
  memo: 'Thank you!'
})
tx.sign(PrivateKey.from('5J...active-key'))
const { tx_id, status } = await tx.broadcast()</code></pre>
<h2>Post or comment</h2>
<pre><code>import { Transaction, PrivateKey, utils } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('comment', {
  parent_author: '',
  parent_permlink: 'hive',
  author: 'myaccount',
  permlink: utils.createPermlink('Hello'),
  title: 'Hello',
  body: 'First post',
  json_metadata: JSON.stringify({ tags: ['hive'], app: 'hive-tx' })
})
tx.sign(PrivateKey.from('5J...posting-key'))
await tx.broadcast()</code></pre>
<p>A root post has an empty <code>parent_author</code>, and <code>parent_permlink</code> is its first tag. A reply sets both to the parent comment.</p>
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
<p>For follows, mutes, reblogs, and communities, the social helpers in <a href="utils.html">utilities</a> build this for you.</p>
<h2>Sign and verify</h2>
<pre><code>import { Transaction, PrivateKey, Signature } from 'hive-tx'

const tx = new Transaction()
await tx.addOperation('vote', {
  voter: 'myaccount',
  author: 'some-author',
  permlink: 'some-post-permlink',
  weight: 10000
})
const privateKey = PrivateKey.from('5J...posting-key')
const { signatures } = tx.sign(privateKey)
const { digest } = tx.digest()

const ok1 = privateKey.createPublic().verify(digest, signatures[0])
const ok2 =
  Signature.from(signatures[0]).getPublicKey(digest).toString() ===
  privateKey.createPublic().toString()</code></pre>
<h2>Multi-signature</h2>
<pre><code>tx.sign([ownerKey, activeKey])
// or, one at a time; signatures accumulate
tx.sign(ownerKey)
tx.sign(activeKey)</code></pre>
<h2>Wait for an irreversible block</h2>
<pre><code>const result = await tx.broadcast(true)
console.log(result.status)
// 'within_irreversible_block' | 'expired_irreversible' | 'too_old' | 'unknown'</code></pre>
<h2>Handle a rejected broadcast</h2>
<pre><code>import { RPCError } from 'hive-tx'

try {
  await tx.broadcast()
} catch (e) {
  if (e instanceof RPCError) {
    console.log('Rejected by the chain:', e.message) // e.g. missing required posting authority
  } else {
    throw e // every node failed
  }
}</code></pre>
<h2>JSON-RPC</h2>
<pre><code>import { callRPC } from 'hive-tx'

const accounts = await callRPC('condenser_api.get_accounts', [['hiveio']])
const props = await callRPC('condenser_api.get_dynamic_global_properties')
console.log(accounts[0].name, props.head_block_number)</code></pre>
<p>Method names are in the <a href="https://developers.hive.io/apidefinitions/">Hive API definitions</a>.</p>
<h2>Quorum</h2>
<pre><code>import { callWithQuorum } from 'hive-tx'

const accounts = await callWithQuorum('condenser_api.get_accounts', [['hiveio']], 2)</code></pre>
<p>Two nodes must return identical JSON. This guards against a wrong or malicious node; it does not check how far behind a node is.</p>
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
<p>To browse the endpoints, open a REST node such as <a href="https://rpc.mahdiyari.info">rpc.mahdiyari.info</a>.</p>
<h2>Encrypt a memo</h2>
<pre><code>import { Memo, PrivateKey } from 'hive-tx'

const encrypted = await Memo.encodeForAccount(
  PrivateKey.from('5J...sender-memo-key'),
  'receiver',
  '#Hello World!'
)
await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '0.001 HIVE',
  memo: encrypted
})</code></pre>
<p>Only text that starts with <code>#</code> is encrypted.</p>
<h2>Decrypt a memo</h2>
<pre><code>const text = Memo.decode(PrivateKey.from('5J...recipient-memo-key'), encryptedMemo)</code></pre>
<h2>Generate keys</h2>
<pre><code>import { PrivateKey } from 'hive-tx'

const privateKey = PrivateKey.randomKey()
console.log(privateKey.inspect())               // masked WIF, safe to log
console.log(privateKey.createPublic().toString())</code></pre>
<h2>Keys from a master password</h2>
<pre><code>const owner = PrivateKey.fromLogin('username', 'master-password', 'owner')
const active = PrivateKey.fromLogin('username', 'master-password', 'active')
const posting = PrivateKey.fromLogin('username', 'master-password', 'posting')
const memo = PrivateKey.fromLogin('username', 'master-password', 'memo')</code></pre>
<h2>Validate a username</h2>
<pre><code>import { utils } from 'hive-tx'

for (const name of ['alice', 'a', 'BadName']) {
  const error = utils.validateUsername(name)
  console.log(name, error ?? 'valid')
}</code></pre>
<h2>Witness set properties</h2>
<pre><code>import { utils, Transaction, PrivateKey } from 'hive-tx'

const operation = utils.buildWitnessSetProperties('mywitness', {
  key: 'STM...current-signing-key',
  account_creation_fee: '3.000 HIVE',
  account_subsidy_budget: 10000,
  account_subsidy_decay: 330782,
  maximum_block_size: 65536,
  hbd_interest_rate: 1500,
  hbd_exchange_rate: { base: '0.250 HBD', quote: '1.000 HIVE' },
  url: 'https://example.com'
})
const tx = new Transaction()
await tx.addOperation(...operation)
tx.sign(PrivateKey.from('5J...signing-key'))
await tx.broadcast()</code></pre>
<p><code>key</code> is required and must be the witness's current signing public key; the chain checks it. Sign with the matching private signing key.</p>
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
    "A Transaction holds operations, signatures, and an expiration.",
    """
<h2>Create</h2>
<pre><code>const tx = new Transaction()
const txLong = new Transaction({ expiration: 120_000 })</code></pre>
<p>Expiration is in milliseconds. The default is 60000 (1 minute). The chain rejects anything over 86400000 (24 hours); the library does not check it for you.</p>
<p>To wrap an existing transaction object, for example one signed elsewhere:</p>
<pre><code>const tx = new Transaction({ transaction: rawTx })</code></pre>
<h2>Add operations</h2>
<p><code>addOperation</code> is async: the first call fetches chain properties to set <code>ref_block_num</code> and <code>ref_block_prefix</code>. Those properties are cached for 2 seconds, so building several transactions in a row costs one request. A transaction can hold many operations.</p>
<pre><code>await tx.addOperation('transfer', {
  from: 'sender',
  to: 'receiver',
  amount: '1.000 HIVE',
  memo: 'payment'
})</code></pre>
<h2>Sign</h2>
<p><code>sign</code> takes one <code>PrivateKey</code> or an array, appends the signatures, and returns the transaction. Call <code>addOperation</code> first; signing an empty transaction throws.</p>
<pre><code>tx.sign(privateKey)
tx.sign([postingKey, activeKey])</code></pre>
<h2>Broadcast</h2>
<pre><code>const quick = await tx.broadcast()
const confirmed = await tx.broadcast(true)</code></pre>
<table>
  <thead><tr><th>Argument</th><th>Returns when</th></tr></thead>
  <tbody>
    <tr><td><code>false</code> (default)</td><td>A node accepts the transaction. <code>status</code> is <code>unknown</code>.</td></tr>
    <tr><td><code>true</code></td><td>The transaction is in an irreversible block, or it expired.</td></tr>
  </tbody>
</table>
<p>Broadcasting an unsigned transaction throws. If a retry hits a duplicate-transaction error, the library ignores it, because the first attempt went through.</p>
<h2>Errors</h2>
<p>If the chain rejects the transaction, for example for a missing authority, too little RC, or an invalid operation, <code>broadcast</code> throws <code>RPCError</code> with the node's message. Network failures move on to the next node; when every retry fails, the last network error is thrown.</p>
<pre><code>import { RPCError } from 'hive-tx'

try {
  await tx.broadcast()
} catch (e) {
  if (e instanceof RPCError) console.log(e.message)
  else throw e
}</code></pre>
<h2>Check status</h2>
<p><code>checkStatus</code> asks a node what happened to the transaction. <code>broadcast(true)</code> polls it for you.</p>
<pre><code>const { status } = await tx.checkStatus()</code></pre>
<table>
  <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>unknown</code></td><td>The node has no record of it. From <code>broadcast()</code>, it means the call did not wait.</td></tr>
    <tr><td><code>within_mempool</code></td><td>Received, not in a block yet.</td></tr>
    <tr><td><code>within_reversible_block</code></td><td>In a block that is not irreversible yet.</td></tr>
    <tr><td><code>within_irreversible_block</code></td><td>In an irreversible block. Final.</td></tr>
    <tr><td><code>expired_reversible</code></td><td>Expired without being included; not final yet.</td></tr>
    <tr><td><code>expired_irreversible</code></td><td>Expired without being included. Final.</td></tr>
    <tr><td><code>too_old</code></td><td>Older than the node tracks.</td></tr>
  </tbody>
</table>
<p><code>broadcast(true)</code> only returns <code>within_irreversible_block</code>, <code>expired_irreversible</code>, <code>too_old</code>, or <code>unknown</code> if the wait reaches the expiration.</p>
<h2>Digest and transaction id</h2>
<pre><code>const { digest, txId } = tx.digest()</code></pre>
<p><code>digest</code> is the 32-byte hash that gets signed; use it to verify signatures. <code>txId</code> is the first 40 hex characters of the SHA-256 of the serialized transaction.</p>
<h2>Add an external signature</h2>
<p>When a wallet or another tool signs the digest, add its signature as a 130-character hex string:</p>
<pre><code>tx.addSignature(hexSignature)</code></pre>
""",
)

PAGES["keys"] = (
    "keys",
    "Keys and signatures",
    "Use",
    "PrivateKey, PublicKey, and Signature create Hive keys and verify signatures.",
    """
<h2>PrivateKey</h2>
<p>A private key is a secp256k1 secret, stored as a WIF string.</p>
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
    <tr><td><code>fromSeed</code></td><td>UTF-8 string, hex string, or bytes</td><td>Key from the SHA-256 of the seed</td></tr>
    <tr><td><code>fromLogin</code></td><td>username, password, role</td><td>Hive login key for that role</td></tr>
    <tr><td><code>randomKey</code></td><td>none</td><td>New random key</td></tr>
    <tr><td><code>createPublic</code></td><td>optional prefix</td><td>PublicKey</td></tr>
    <tr><td><code>sign</code></td><td>32-byte hash</td><td>Signature</td></tr>
    <tr><td><code>toString</code></td><td>none</td><td>WIF string</td></tr>
    <tr><td><code>inspect</code></td><td>none</td><td>Masked WIF, safe to log</td></tr>
    <tr><td><code>getSharedSecret</code></td><td>PublicKey</td><td>64-byte secret, used for memo encryption</td></tr>
  </tbody>
</table>
<p><code>fromLogin</code> roles are <code>owner</code>, <code>active</code> (the default), <code>posting</code>, and <code>memo</code>. The seed is <code>username + role + password</code>, the same as Hive wallets use.</p>
<h2>PublicKey</h2>
<p>A public key string starts with the address prefix, <code>STM</code> by default.</p>
<pre><code>import { PublicKey } from 'hive-tx'

const pub = privateKey.createPublic()
const fromStr = PublicKey.from('STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA')
const ok = pub.verify(messageHash, signature)</code></pre>
<table>
  <thead><tr><th>Method</th><th>Does</th></tr></thead>
  <tbody>
    <tr><td><code>from</code> / <code>fromString</code></td><td>Parses a public key string.</td></tr>
    <tr><td><code>verify</code></td><td>Returns true if the signature (object or hex) matches the 32-byte hash.</td></tr>
    <tr><td><code>toString</code> / <code>toJSON</code></td><td>Returns the key string with its prefix.</td></tr>
  </tbody>
</table>
<h2>Signature</h2>
<p>A compact recoverable signature, written as 130 hex characters.</p>
<pre><code>import { Signature } from 'hive-tx'

const sig = Signature.from(hex)
const recovered = sig.getPublicKey(messageHash)
const hexOut = sig.customToString()</code></pre>
<p><code>getPublicKey</code> takes the 32-byte hash as a <code>Uint8Array</code> or a 64-character hex string.</p>
<p>To check a Hive Keychain <code>requestSignBuffer</code> proof, use <code>utils.verifyMessage</code>; see <a href="utils.html">utilities</a>.</p>
""",
)

PAGES["memo"] = (
    "memo",
    "Memos",
    "Use",
    "Memo.encode encrypts a private message and Memo.decode decrypts it.",
    """
<h2>Rules</h2>
<ul>
  <li>Only text that starts with <code>#</code> is encrypted; other text is returned unchanged.</li>
  <li>Encrypt with the sender's memo private key and the recipient's memo public key.</li>
  <li>Decrypt with either side's memo private key.</li>
</ul>
<h2>Encrypt</h2>
<pre><code>import { Memo, PrivateKey } from 'hive-tx'

const senderMemoKey = PrivateKey.from('5J...sender-memo-key')
const encrypted = Memo.encode(senderMemoKey, 'STM...recipient-memo-public-key', '#Hello')</code></pre>
<p>To encrypt by account name, use <code>encodeForAccount</code>; it looks up the recipient's memo key:</p>
<pre><code>const encrypted = await Memo.encodeForAccount(senderMemoKey, 'bob', '#Hello')</code></pre>
<p>Put the result in a transfer's <code>memo</code> field.</p>
<h2>Decrypt</h2>
<pre><code>const recipientMemoKey = PrivateKey.from('5J...recipient-memo-key')
const text = Memo.decode(recipientMemoKey, encryptedMemo) // starts with '#'</code></pre>
<div class="callout caution">
  <strong>Caution</strong>
  Memos use AES-CBC with a key shared between the two memo keys. The memo key is separate from the posting and active keys; do not use those to encrypt.
</div>
""",
)

PAGES["rpc"] = (
    "rpc",
    "RPC and REST calls",
    "Use",
    "callRPC, callRPCBatch, callWithQuorum, and callREST send requests to Hive nodes, with failover.",
    """
<h2>callRPC</h2>
<p>Sends a JSON-RPC 2.0 request and returns the result. A Hive error throws <code>RPCError</code>.</p>
<pre><code>import { callRPC } from 'hive-tx'

const accounts = await callRPC('condenser_api.get_accounts', [['alice']])
const props = await callRPC('condenser_api.get_dynamic_global_properties')</code></pre>
<table>
  <thead><tr><th>Parameter</th><th>Default</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>method</code></td><td>required</td><td>API method name</td></tr>
    <tr><td><code>params</code></td><td><code>[]</code></td><td>Array or object</td></tr>
    <tr><td><code>timeout</code></td><td><code>config.timeout</code></td><td>Per request, in milliseconds</td></tr>
    <tr><td><code>retry</code></td><td><code>config.retry</code></td><td>How many other nodes to try after a failure</td></tr>
  </tbody>
</table>
<p>When a node times out or fails, the call moves to the next URL in <code>config.nodes</code>. A Hive <code>RPCError</code> is not retried, because every node would give the same answer. Method names are in the <a href="https://developers.hive.io/apidefinitions/">Hive API definitions</a>.</p>
<h2>callRPCBatch</h2>
<p>Calls one method many times in a single JSON-RPC batch request. Pass one params entry per call; results come back in the same order. Failover, <code>timeout</code>, and <code>retry</code> work like <code>callRPC</code>. If any call in the batch fails with a Hive error, it throws <code>RPCError</code>.</p>
<pre><code>import { callRPCBatch } from 'hive-tx'

const blocks = await callRPCBatch('condenser_api.get_block', [[1], [2], [3]])</code></pre>
<p>Keep batches modest, around 20 to 50 calls: nodes time out on very large responses.</p>
<h2>callWithQuorum</h2>
<p>Sends the call to several random nodes and returns only when <code>quorum</code> of them return identical JSON. Use it when a wrong answer from one node would be costly.</p>
<pre><code>import { callWithQuorum } from 'hive-tx'

const accounts = await callWithQuorum('condenser_api.get_accounts', [['alice']], 2)</code></pre>
<p>The default quorum is 2, and it cannot exceed <code>config.nodes.length</code>.</p>
<div class="callout note">
  <strong>Note</strong>
  Quorum compares results; it does not check head-block lag. Nodes a block apart can disagree on fast-changing data.
</div>
<h2>callREST</h2>
<p>Calls a REST API on <code>config.restNodes</code>. Not every public node serves REST.</p>
<pre><code>import { callREST } from 'hive-tx'

const balance = await callREST(
  'balance',
  '/accounts/{account-name}/balances',
  { 'account-name': 'alice' }
)</code></pre>
<p>APIs: <code>balance</code>, <code>hafah</code>, <code>hafbe</code>, <code>hivemind</code>, <code>hivesense</code>, <code>reputation</code>, <code>nft-tracker</code>, <code>hafsql</code>, and <code>status</code>. TypeScript checks the endpoint, its parameters, and the response for each one.</p>
<p>Fields named in the path, like <code>{account-name}</code>, fill the path; the rest become query parameters, and arrays repeat the key.</p>
<table>
  <thead><tr><th>Parameter</th><th>Default</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>api</code></td><td>required</td><td>One of the API names above</td></tr>
    <tr><td><code>endpoint</code></td><td>required</td><td>Endpoint path, with <code>{placeholders}</code></td></tr>
    <tr><td><code>params</code></td><td>none</td><td>Path and query values</td></tr>
    <tr><td><code>timeout</code></td><td><code>config.timeout</code></td><td>Per request, in milliseconds</td></tr>
    <tr><td><code>retry</code></td><td><code>config.retry</code></td><td>How many other nodes to try after a failure</td></tr>
  </tbody>
</table>
<p>Network errors, timeouts, and HTTP 5xx move to the next REST node. HTTP 404 throws at once without failover, because it usually means a wrong endpoint or parameter.</p>
<h2>RPCError</h2>
<p><code>RPCError</code> has <code>message</code>, <code>code</code>, and optional <code>data</code> from the node.</p>
<pre><code>import { callRPC, RPCError } from 'hive-tx'

try {
  await callRPC('condenser_api.get_accounts', [['alice']])
} catch (e) {
  if (e instanceof RPCError) console.log(e.code, e.message, e.data)
  else throw e // every node failed
}</code></pre>
<p>To follow new blocks and operations, see <a href="streams.html">Streams</a>.</p>
""",
)

PAGES["streams"] = (
    "streams",
    "Streams",
    "Use",
    "streamBlocks, streamBlockNumbers, and streamOperations follow the chain's irreversible blocks, in order, with no gaps or duplicates.",
    """
<p>Streams read only irreversible blocks, so you never see a block that later disappears in a fork. Hive blocks become irreversible within seconds, so streams run close to real time.</p>
<p>All three are async generators. They catch up on past blocks in batches of 20, then poll every second. <code>break</code> stops a stream. If every node fails, the stream throws.</p>
<table>
  <thead><tr><th>Option</th><th>Default</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><code>from</code></td><td>last irreversible block</td><td>First block to yield</td></tr>
    <tr><td><code>to</code></td><td>none</td><td>Last block to yield; the stream ends after it</td></tr>
    <tr><td><code>only_virtual</code></td><td><code>false</code></td><td><code>streamOperations</code> only: yield just virtual operations</td></tr>
  </tbody>
</table>
<h2>streamOperations</h2>
<p>Yields every operation in chain order, virtual operations included, like <code>get_ops_in_block</code>. Virtual operations are the ones the chain creates itself, such as rewards, order fills, and interest.</p>
<pre><code>import { streamOperations } from 'hive-tx'

for await (const { block, trx_id, op } of streamOperations()) {
  if (op[0] === 'transfer') console.log(block, trx_id, op[1].from, op[1].amount)
  if (op[0] === 'producer_reward') console.log(block, op[1].producer)
}</code></pre>
<p>Each item has <code>block</code>, <code>trx_id</code>, <code>trx_in_block</code>, <code>op_in_trx</code>, <code>virtual_op</code>, <code>timestamp</code>, and <code>op</code>.</p>
<h2>streamBlocks</h2>
<p>Yields whole blocks with their transactions.</p>
<pre><code>import { streamBlocks } from 'hive-tx'

for await (const block of streamBlocks()) {
  for (const tx of block.transactions) {
    for (const [name, body] of tx.operations) {
      if (name === 'transfer') {
        console.log(block.block_num, tx.transaction_id, body.from, body.to, body.amount)
      }
    }
  }
}</code></pre>
<h2>streamBlockNumbers</h2>
<p>Yields block numbers only, without fetching the blocks. Use it to drive your own fetching.</p>
<pre><code>import { streamBlockNumbers } from 'hive-tx'

for await (const num of streamBlockNumbers()) {
  console.log(num)
}</code></pre>
<h2>Resume after a restart</h2>
<p>Save the number of the last block you fully handled, then restart with <code>from</code> set to the next one:</p>
<pre><code>for await (const block of streamBlocks({ from: savedBlockNum + 1 })) {
  await handle(block)
  savedBlockNum = block.block_num
}</code></pre>
<p>Read a past range by setting both ends: <code>streamBlocks({ from: 1000, to: 1999 })</code>.</p>
""",
)

PAGES["config"] = (
    "config",
    "Configuration",
    "Use",
    "The config object sets the nodes, timeout, retries, chain id, and address prefix.",
    """
<pre><code>import { config } from 'hive-tx'

console.log(config.nodes)  // the default public JSON-RPC nodes

config.nodes = ['https://api.hive.blog', 'https://api.deathwing.me']
config.restNodes = ['https://rpc.mahdiyari.info']
config.timeout = 5_000
config.retry = 3</code></pre>
<table>
  <thead><tr><th>Field</th><th>Type</th><th>Default</th></tr></thead>
  <tbody>
    <tr><td><code>nodes</code></td><td>URL array</td><td>Public JSON-RPC nodes, maintained with each release</td></tr>
    <tr><td><code>restNodes</code></td><td>URL array, no trailing slash</td><td>Public REST nodes, maintained with each release</td></tr>
    <tr><td><code>timeout</code></td><td>milliseconds</td><td><code>10000</code></td></tr>
    <tr><td><code>retry</code></td><td>count</td><td><code>8</code></td></tr>
    <tr><td><code>address_prefix</code></td><td>string</td><td><code>STM</code></td></tr>
    <tr><td><code>chain_id</code></td><td>64 hex characters</td><td>Hive mainnet: <code>beeab0de00…00</code></td></tr>
  </tbody>
</table>
<p>Calls go to the current node and move down the list on failure, wrapping around at the end; they stay on the node that worked. Put your preferred node first. For a testnet, set <code>chain_id</code>, <code>address_prefix</code>, and <code>nodes</code> to the testnet's values; changes apply to the next call and signature.</p>
<div class="callout caution">
  <strong>Caution</strong>
  <code>config</code> is global to the process. Set it once at startup; changing <code>config.nodes</code> while calls are in flight can send them to the wrong node.
</div>
""",
)

PAGES["utils"] = (
    "utils",
    "Utilities",
    "Use",
    "The utils object has stake and mana math, vote values, reputation, app authority, login signatures, social operations, comment options, account keys, profiles, permlinks, name validation, history filters, and witness properties.",
    """
<p>The stake, mana, and vote helpers are async and fetch what they need: the account, global properties, reward fund, and price. That data is cached for 2 seconds and shared between concurrent calls, so several helpers in a row cost one request per kind of data. Results are JavaScript numbers, fine for display and estimates.</p>
<h2>Voting power and mana</h2>
<pre><code>import { utils } from 'hive-tx'

await utils.getVotingMana('alice')      // { current, max, percentage, fullAt }
await utils.getDownvoteMana('alice')
await utils.getRCMana('alice')
await utils.getEffectiveVests('alice')  // own + received - delegated - this week's power down</code></pre>
<p>Instead of a name, you can pass an account object you already have, from <code>condenser_api.get_accounts</code> or <code>database_api.find_accounts</code> (or from <code>rc_api.find_rc_accounts</code> for <code>getRCMana</code>). That skips the request.</p>
<p>Mana is computed for now; pass a time in milliseconds as the last argument to compute it for another moment. Mana refills from 0 to 100% in 5 days, and downvote mana is 25% of voting mana. <code>fullAt</code> is the <code>Date</code> the mana will be full.</p>
<h2>Hive Power</h2>
<pre><code>await utils.vestsToHP('1000.000000 VESTS')  // HIVE
await utils.hpToVests(100)                  // VESTS
utils.parseAsset('1.000 HIVE')              // { amount: 1, symbol: 'HIVE' }</code></pre>
<p><code>parseAsset</code> also reads the <code>{ amount, precision, nai }</code> format of <code>database_api</code>.</p>
<h2>Prices and interest</h2>
<pre><code>await utils.hiveToHbd(10)          // HBD, at the witnesses' median price
await utils.hbdToHive('10.000 HBD')
await utils.getHpApr()             // yearly Hive Power interest, percent
await utils.getHbdApr()            // yearly interest on HBD in savings, percent</code></pre>
<h2>Account value</h2>
<pre><code>await utils.estimateAccountValue('alice')  // HBD</code></pre>
<p>Counts liquid and savings HIVE and HBD, own Hive Power (including what is delegated out), and funds in open market orders, at the median price.</p>
<h2>Vote value</h2>
<pre><code>await utils.getVoteValue('alice')         // HBD, 100% vote
await utils.getVoteValue('alice', 5000)   // 50% vote
await utils.getVoteRShares('alice')       // rshares
await utils.rsharesToHBD(rshares)         // HBD for any rshares</code></pre>
<p>Weight runs from -10000 to 10000. Since HF28, a vote's strength depends only on stake and weight; current mana limits how many votes an account can cast, not how strong each one is. The value includes both author and curation rewards.</p>
<h2>Reputation</h2>
<pre><code>utils.formatReputation('225722985673795')  // 73.18…</code></pre>
<p>Converts raw reputation, as returned by <code>condenser_api.get_account_reputations</code>, to the familiar score. Use <code>Math.floor</code> for the whole number most frontends show.</p>
<h2>createPermlink</h2>
<pre><code>utils.createPermlink('Hello World!')  // 'hello-world-3f9a1c0b7e2d'
utils.createPermlink()                // '3f9a1c0b7e2d', for replies</code></pre>
<p>Makes a valid permlink from a title, with a random suffix so the same title can be used twice.</p>
<h2>Social operations</h2>
<p>These build the <code>custom_json</code> operations that Hivemind reads. Sign them with the posting key.</p>
<pre><code>const tx = new Transaction()
await tx.addOperation(...utils.follow('alice', 'bob'))
// also: unfollow, mute, unmute (follower, following)
//       blacklist, unblacklist: block an account (posts marked "my blacklist")
//       followBlacklist, unfollowBlacklist, followMuted, unfollowMuted: use another account's lists
//       reblog(account, author, permlink)
//       subscribe, unsubscribe(account, 'hive-123456')
//       delegateRC(from, delegatees, maxRc): delegate RC; maxRc 0 removes the delegation</code></pre>
<p><code>unfollow</code> clears a follow or a mute; removing a blacklist entry needs <code>unblacklist</code>.</p>
<h2>App authority</h2>
<p>Lets an app sign for a user, as "Authorize app" flows do. Grant and revoke return an <code>account_update2</code> operation; sign it with the user's active key.</p>
<pre><code>await utils.hasAccountAuthority('alice', 'myapp')  // posting by default; 'active' as third argument

const tx = new Transaction()
await tx.addOperation(...(await utils.grantAccountAuthority('alice', 'myapp')))
// also: revokeAccountAuthority('alice', 'myapp')</code></pre>
<p>An app counts only if its weight reaches the threshold, so it can sign alone. <code>grantAccountAuthority</code> gives it the threshold weight unless you pass one. <code>revokeAccountAuthority</code> throws if the authority could no longer sign afterwards.</p>
<h2>Login signatures</h2>
<p>To prove a user controls an account, have them sign a message with Hive Keychain's <code>requestSignBuffer</code>, Hivesigner, or <code>signMessage</code>, then check it on your server.</p>
<pre><code>await utils.verifyMessage('alice', message, signature)            // posting key
await utils.verifyMessage('alice', message, signature, 'active')  // active key

const signature = utils.signMessage(message, PrivateKey.from('5J...posting-key'))
await utils.getKeyRole('alice', publicKey)  // 'owner' | 'active' | 'posting' | 'memo' | null</code></pre>
<p>Keep the message on your server with a one-time value, and accept each signature once. The key must be able to sign alone for that authority. <code>getKeyRole</code> tells which role a key holds, for logins with a private key or a master password.</p>
<h2>Comment options</h2>
<pre><code>await tx.addOperation('comment', comment)
await tx.addOperation(...utils.commentOptions('alice', comment.permlink, {
  beneficiaries: [{ account: 'myapp', weight: 500 }],  // 5%
  percentHbd: 0                                        // 100% Hive Power
}))</code></pre>
<p>Beneficiaries are sorted for you: at most 8, adding up to 10000 or less. <code>maxAcceptedPayout: '0.000 HBD'</code> declines the payout. Add the options in the same transaction as the comment: beneficiaries cannot be set once it has votes.</p>
<h2>Profiles and accounts</h2>
<pre><code>await utils.getProfile('alice')        // { name, about, profile_image, ... }
await utils.accountExists('newuser')  // true or false</code></pre>
<p><code>getProfile</code> reads <code>posting_json_metadata</code>, then <code>json_metadata</code>. The values are whatever the user wrote, so check their types before you use them.</p>
<h2>getRequiredRole</h2>
<pre><code>utils.getRequiredRole(['vote', vote])          // 'posting'
utils.getRequiredRole(['transfer', transfer])  // 'active'</code></pre>
<p>Returns the key role the chain requires for an operation: <code>'posting'</code>, <code>'active'</code>, or <code>'owner'</code>. It throws for <code>witness_set_properties</code>, which is signed with the witness signing key.</p>
<h2>Account keys</h2>
<pre><code>const password = utils.createPassword()  // 'P5...', show it to the user once
const { privateKeys, owner, active, posting, memo_key } = utils.generateKeys('newuser', password)

await tx.addOperation('create_claimed_account', {
  creator: 'alice',
  new_account_name: 'newuser',
  owner,
  active,
  posting,
  memo_key,
  json_metadata: '',
  extensions: []
})

utils.isValidWif('5J...')         // true or false
utils.isValidPublicKey('STM...')  // checks prefix, checksum, and curve point</code></pre>
<p><code>generateKeys</code> derives keys the way Hive wallets do, so the user can log in with the password. <code>privateKeys</code> holds the owner, active, posting, and memo keys.</p>
<h2>validateUsername</h2>
<p>Returns <code>null</code> for a valid name, or a string that explains what is wrong.</p>
<pre><code>const error = utils.validateUsername('alice')
if (error) console.log(error)</code></pre>
<h2>makeBitMaskFilter</h2>
<p>Builds the operation filter for <code>condenser_api.get_account_history</code>.</p>
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
<p><code>utils.operations</code> maps operation names to their numeric ids, for example <code>vote</code> is 0 and <code>transfer</code> is 2.</p>
<h2>buildWitnessSetProperties</h2>
<p>Builds a <code>witness_set_properties</code> operation, serializing each property to hex as the chain requires.</p>
<pre><code>const operation = utils.buildWitnessSetProperties('mywitness', {
  key: 'STM...current-signing-key',
  account_creation_fee: '3.000 HIVE',
  maximum_block_size: 65536,
  url: 'https://example.com'
})
const tx = new Transaction()
await tx.addOperation(...operation)</code></pre>
<p><code>key</code> is required and must be the witness's current signing public key. Sign with the matching private key.</p>
""",
)

PAGES["environments"] = (
    "environments",
    "Environments",
    "Reference",
    "hive-tx runs in Node.js, browsers, workers, and serverless runtimes.",
    """
<h2>Module formats</h2>
<p>The package is ESM and also ships CommonJS:</p>
<ul>
  <li>ESM: <code>import { PrivateKey } from 'hive-tx'</code></li>
  <li>CommonJS: <code>const { PrivateKey } = require('hive-tx')</code></li>
</ul>
<p>Use 7.2.1 or later with CommonJS: the 7.2.0 CommonJS build is broken.</p>
<h2>Node.js</h2>
<p>Node.js 20 or later. The library uses the built-in <code>fetch</code> and <code>AbortSignal.timeout</code>.</p>
<h2>Browser and CDN</h2>
<p>Load <code>dist/index.mjs</code>. It is a single file with the crypto code inside, so there are no extra chunks to fetch.</p>
<h2>Serverless</h2>
<p>The build has no runtime dependencies, so a Lambda or a Worker loads it without <code>bs58</code> or <code>@noble/*</code> in <code>node_modules</code>.</p>
<p>Invocations that share a process share <code>config</code>; do not change <code>config.nodes</code> per invocation.</p>
<h2>Tests</h2>
<p>Jest 30 loads hive-tx in the Node environment:</p>
<pre><code>const { PrivateKey } = require('hive-tx')

test('derives a posting key', () => {
  const pub = PrivateKey.fromLogin('alice', 'x', 'posting').createPublic().toString()
  expect(pub.startsWith('STM')).toBe(true)
})</code></pre>
<p>ESM Jest works too, with <code>NODE_OPTIONS=--experimental-vm-modules</code> and a <code>.mjs</code> test file.</p>
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
    <tr><td><code>call()</code></td><td><code>callRPC()</code>, which returns the result and throws <code>RPCError</code></td></tr>
    <tr><td><code>broadcast(timeout, retry)</code></td><td><code>broadcast(checkStatus)</code></td></tr>
    <tr><td>Timeouts in seconds</td><td>Timeouts and expiration in milliseconds</td></tr>
    <tr><td><code>new Transaction(tx)</code></td><td><code>new Transaction({ transaction, expiration })</code></td></tr>
    <tr><td><code>Transaction.signedTransaction</code></td><td><code>Transaction.transaction</code></td></tr>
    <tr><td><code>config.node</code> (string)</td><td><code>config.nodes</code> (array)</td></tr>
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
<h2>Call an API</h2>
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
    "Every public export and its signature. The type files in dist have the full types.",
    """
<h2>Exports</h2>
<pre><code>import {
  Transaction,
  PrivateKey,
  PublicKey,
  Signature,
  Memo,
  callRPC,
  callRPCBatch,
  callREST,
  callWithQuorum,
  RPCError,
  streamBlocks,
  streamBlockNumbers,
  streamOperations,
  config,
  utils
} from 'hive-tx'

import type {
  Operation,
  OperationName,
  OperationBody,
  TransactionType,
  BroadcastResult,
  TransactionStatus,
  Block,
  AppliedOperation
} from 'hive-tx'</code></pre>
<h2>Transaction</h2>
<table>
  <thead><tr><th>Member</th><th>Type</th></tr></thead>
  <tbody>
    <tr><td><code>constructor(options?)</code></td><td><code>{ transaction?, expiration? }</code></td></tr>
    <tr><td><code>addOperation(name, body)</code></td><td><code>Promise&lt;void&gt;</code></td></tr>
    <tr><td><code>sign(keys)</code></td><td><code>PrivateKey | PrivateKey[]</code> → <code>TransactionType</code></td></tr>
    <tr><td><code>broadcast(checkStatus?)</code></td><td><code>Promise&lt;BroadcastResult&gt;</code></td></tr>
    <tr><td><code>checkStatus()</code></td><td><code>Promise&lt;TransactionStatus&gt;</code></td></tr>
    <tr><td><code>digest()</code></td><td><code>{ digest: Uint8Array, txId: string }</code></td></tr>
    <tr><td><code>addSignature(hex)</code></td><td>130-character hex → <code>TransactionType</code></td></tr>
    <tr><td><code>transaction</code></td><td><code>TransactionType | undefined</code></td></tr>
    <tr><td><code>expiration</code></td><td>milliseconds, default 60000</td></tr>
  </tbody>
</table>
<pre><code>BroadcastResult = {
  tx_id: string
  status: 'unknown' | 'within_irreversible_block' | 'expired_irreversible' | 'too_old'
}
TransactionStatus = {
  status: 'unknown' | 'within_mempool' | 'within_reversible_block' | 'within_irreversible_block'
    | 'expired_reversible' | 'expired_irreversible' | 'too_old'
}</code></pre>
<h2>PrivateKey</h2>
<table>
  <thead><tr><th>Member</th><th>Type</th></tr></thead>
  <tbody>
    <tr><td><code>PrivateKey.from(value)</code></td><td><code>string | Uint8Array</code> → <code>PrivateKey</code></td></tr>
    <tr><td><code>PrivateKey.fromString(wif)</code></td><td><code>PrivateKey</code></td></tr>
    <tr><td><code>PrivateKey.fromSeed(seed)</code></td><td><code>string | Uint8Array</code> → <code>PrivateKey</code></td></tr>
    <tr><td><code>PrivateKey.fromLogin(username, password, role?)</code></td><td>role: <code>'owner' | 'active' | 'posting' | 'memo'</code>, default <code>'active'</code></td></tr>
    <tr><td><code>PrivateKey.randomKey()</code></td><td><code>PrivateKey</code></td></tr>
    <tr><td><code>sign(hash)</code></td><td><code>Uint8Array</code> → <code>Signature</code></td></tr>
    <tr><td><code>createPublic(prefix?)</code></td><td><code>PublicKey</code></td></tr>
    <tr><td><code>getSharedSecret(publicKey)</code></td><td><code>Uint8Array</code> (64 bytes)</td></tr>
    <tr><td><code>toString()</code> / <code>inspect()</code></td><td>WIF / masked WIF</td></tr>
  </tbody>
</table>
<h2>PublicKey</h2>
<table>
  <thead><tr><th>Member</th><th>Type</th></tr></thead>
  <tbody>
    <tr><td><code>PublicKey.from(value)</code></td><td><code>string | PublicKey</code> → <code>PublicKey</code></td></tr>
    <tr><td><code>PublicKey.fromString(key)</code></td><td><code>PublicKey</code></td></tr>
    <tr><td><code>verify(hash, signature)</code></td><td><code>Uint8Array, Signature | string</code> → <code>boolean</code></td></tr>
    <tr><td><code>toString()</code> / <code>toJSON()</code></td><td>Key string with prefix</td></tr>
  </tbody>
</table>
<h2>Signature</h2>
<table>
  <thead><tr><th>Member</th><th>Type</th></tr></thead>
  <tbody>
    <tr><td><code>Signature.from(hex)</code></td><td><code>Signature</code></td></tr>
    <tr><td><code>getPublicKey(hash)</code></td><td><code>Uint8Array | string</code> → <code>PublicKey</code></td></tr>
    <tr><td><code>customToString()</code></td><td>130-character hex</td></tr>
    <tr><td><code>toBuffer()</code></td><td><code>Uint8Array</code></td></tr>
  </tbody>
</table>
<h2>Memo</h2>
<pre><code>Memo.encode(privateKey, publicKey, memo): string
Memo.decode(privateKey, memo): string
Memo.encodeForAccount(privateKey, account, memo): Promise&lt;string&gt;</code></pre>
<h2>Calls</h2>
<pre><code>callRPC(method, params?, timeout?, retry?): Promise&lt;T&gt;
callRPCBatch(method, paramsList, timeout?, retry?): Promise&lt;T[]&gt;
callWithQuorum(method, params?, quorum?): Promise&lt;T&gt;
callREST(api, endpoint, params?, timeout?, retry?): Promise&lt;typed response&gt;</code></pre>
<p><code>RPCError</code> extends <code>Error</code> with <code>code: number</code> and <code>data?: any</code>.</p>
<h2>Streams</h2>
<pre><code>streamBlocks({ from?, to? }): AsyncGenerator&lt;Block&gt;
streamBlockNumbers({ from?, to? }): AsyncGenerator&lt;number&gt;
streamOperations({ from?, to?, only_virtual? }): AsyncGenerator&lt;AppliedOperation&gt;</code></pre>
<h2>config</h2>
<pre><code>{
  nodes: string[]
  restNodes: string[]
  chain_id: string
  address_prefix: string
  timeout: number  // ms
  retry: number
}</code></pre>
<h2>utils</h2>
<p>Async helpers take an account name or an account object you already fetched.</p>
<pre><code>// Stake and price
parseAsset(asset): { amount: number, symbol: string }
vestsToHP(vests): Promise&lt;number&gt;
hpToVests(hp): Promise&lt;number&gt;
hiveToHbd(hive): Promise&lt;number&gt;
hbdToHive(hbd): Promise&lt;number&gt;
getEffectiveVests(account): Promise&lt;number&gt;

// Mana and votes
getVotingMana(account, now?): Promise&lt;Manabar&gt;
getDownvoteMana(account, now?): Promise&lt;Manabar&gt;
getRCMana(account, now?): Promise&lt;Manabar&gt;
getVoteRShares(account, weight?): Promise&lt;number&gt;
getVoteValue(account, weight?): Promise&lt;number&gt;
rsharesToHBD(rshares): Promise&lt;number&gt;
// Manabar = { current: number, max: number, percentage: number, fullAt: Date }

// Yield, value, reputation
getHpApr(): Promise&lt;number&gt;
getHbdApr(): Promise&lt;number&gt;
estimateAccountValue(account): Promise&lt;number&gt;
formatReputation(raw): number

// Keys
createPassword(): string
generateKeys(username, password): { privateKeys, publicKeys, owner, active, posting, memo_key }
isValidWif(wif): boolean
isValidPublicKey(key): boolean
getKeyRole(account, publicKey): Promise&lt;'owner' | 'active' | 'posting' | 'memo' | null&gt;
signMessage(message, privateKey): string
verifyMessage(account, message, signature, role?): Promise&lt;boolean&gt;

// App authority: role is 'posting' (default) or 'active'
hasAccountAuthority(account, app, role?): Promise&lt;boolean&gt;
grantAccountAuthority(account, app, role?, weight?): Promise&lt;['account_update2', body]&gt;
revokeAccountAuthority(account, app, role?): Promise&lt;['account_update2', body]&gt;

// Social: each returns ['custom_json', body]
follow(follower, following)       unfollow(follower, following)
mute(follower, following)         unmute(follower, following)
blacklist(follower, following)    unblacklist(follower, following)
followBlacklist(follower, following)  unfollowBlacklist(follower, following)
followMuted(follower, following)      unfollowMuted(follower, following)
reblog(account, author, permlink)
subscribe(account, community)     unsubscribe(account, community)
delegateRC(from, delegatees, maxRc)

// Other
createPermlink(title?): string
commentOptions(author, permlink, options?): ['comment_options', body]
validateUsername(name): string | null
accountExists(name): Promise&lt;boolean&gt;
getProfile(account): Promise&lt;Record&lt;string, unknown&gt;&gt;
getRequiredRole(operation): 'posting' | 'active' | 'owner'
operations: Record&lt;string, number&gt;
makeBitMaskFilter(operationIds): filter arguments for get_account_history
buildWitnessSetProperties(owner, props): ['witness_set_properties', body]</code></pre>
<h2>Operation names</h2>
<p><code>addOperation</code> accepts every Hive operation name, and TypeScript checks the body against it. Common ones:</p>
<ul>
  <li><code>vote</code>, <code>comment</code>, <code>delete_comment</code>, <code>comment_options</code></li>
  <li><code>transfer</code>, <code>transfer_to_vesting</code>, <code>withdraw_vesting</code>, <code>recurrent_transfer</code></li>
  <li><code>custom_json</code>, <code>custom</code></li>
  <li><code>delegate_vesting_shares</code>, <code>claim_reward_balance</code></li>
  <li><code>account_update</code>, <code>account_update2</code>, <code>account_create</code>, <code>create_claimed_account</code></li>
  <li><code>account_witness_vote</code>, <code>account_witness_proxy</code>, <code>witness_update</code>, <code>witness_set_properties</code></li>
</ul>
<p>The full list is the <code>Operation</code> type in <code>dist/index.d.mts</code>, or <a href="https://github.com/mahdiyari/hive-tx/blob/master/src/types.ts">src/types.ts</a> on GitHub.</p>
<h2>Support</h2>
<p>Ask in <code>#dev-chat</code> on the <a href="https://myhive.li/discord">Hive Discord server</a>.</p>
""",
)


def main() -> None:
    for _, filename, pid in NAV:
        (ROOT / filename).write_text(page(*PAGES[pid]), encoding="utf-8")
        print("wrote", filename)


if __name__ == "__main__":
    main()
