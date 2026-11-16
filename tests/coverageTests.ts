import { isDeepStrictEqual } from 'node:util'
import {
  Transaction,
  PrivateKey,
  PublicKey,
  Signature,
  Memo,
  utils,
  callREST,
  config,
  callRPC,
  callRPCBatch,
  callWithQuorum,
  streamBlocks,
  streamBlockNumbers,
  streamOperations,
  type AppliedOperation,
  type Block,
  type Operation
} from 'hive-tx'

// Test data
const testPrivateKey = '5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw'
const testPublicKey = 'STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA'
const testUsername = 'testuser'

export const coverageTests = async () => {
  console.log('Running coverage tests...\n')

  let totalTests = 0
  let passedTests = 0

  // Helper function to run tests
  const runTest = async (name: string, testFn: () => boolean | Promise<boolean>) => {
    totalTests++
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

  // PrivateKey tests
  console.log('Testing PrivateKey...')

  await runTest('PrivateKey.fromString', () => {
    const key = PrivateKey.fromString(testPrivateKey)
    return key.toString() === testPrivateKey
  })

  await runTest('PrivateKey.from (string)', () => {
    const key = PrivateKey.from(testPrivateKey)
    return key.toString() === testPrivateKey
  })

  await runTest('PrivateKey.from (Uint8Array)', () => {
    const bytes = new Uint8Array([0x1, 0x2, 0x3])
    // Since it validates secp256k1, this should throw, but let's catch
    // Actually, the constructor checks, so invalid key throws
    try {
      new PrivateKey(bytes)
      return false // Should not reach here
    } catch {
      return true // Correctly throws
    }
  })

  await runTest('PrivateKey.fromSeed', () => {
    const seed = 'test seed phrase'
    const key = PrivateKey.fromSeed(seed)
    // Just check it creates without error
    return key instanceof PrivateKey
  })

  await runTest('PrivateKey.fromLogin', () => {
    const key = PrivateKey.fromLogin(testUsername, 'password123')
    return key instanceof PrivateKey
  })

  await runTest('PrivateKey.randomKey', () => {
    const key = PrivateKey.randomKey()
    return key instanceof PrivateKey
  })

  await runTest('PrivateKey.createPublic', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const pubKey = privKey.createPublic()
    return pubKey.toString() === testPublicKey
  })

  await runTest('PrivateKey.toString', () => {
    const key = PrivateKey.fromString(testPrivateKey)
    return key.toString() === testPrivateKey
  })

  await runTest('PrivateKey.inspect', () => {
    const key = PrivateKey.fromString(testPrivateKey)
    const inspectStr = key.inspect()
    return inspectStr.startsWith('PrivateKey: 5JdeC9...BsQnsw')
  })

  await runTest('PrivateKey.getSharedSecret', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const pubKey = PublicKey.fromString(testPublicKey)
    const secret = privKey.getSharedSecret(pubKey)
    return secret.length === 64
  })

  await runTest('PrivateKey.sign', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    return sig instanceof Signature
  })

  // PublicKey tests
  console.log('Testing PublicKey...')

  await runTest('PublicKey.fromString', () => {
    const key = PublicKey.fromString(testPublicKey)
    return key.toString() === testPublicKey
  })

  await runTest('PublicKey.from (string)', () => {
    const key = PublicKey.from(testPublicKey)
    return key.toString() === testPublicKey
  })

  await runTest('PublicKey.from (PublicKey instance)', () => {
    const key1 = PublicKey.fromString(testPublicKey)
    const key2 = PublicKey.from(key1)
    return key1 === key2
  })

  await runTest('PublicKey.verify', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const pubKey = privKey.createPublic()
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    return pubKey.verify(message, sig)
  })

  await runTest('PublicKey.toString', () => {
    const key = PublicKey.fromString(testPublicKey)
    return key.toString() === testPublicKey
  })

  await runTest('PublicKey.toJSON', () => {
    const key = PublicKey.fromString(testPublicKey)
    return key.toJSON() === testPublicKey
  })

  await runTest('PublicKey.inspect', () => {
    const key = PublicKey.fromString(testPublicKey)
    const inspectStr = key.inspect()
    return inspectStr === `PublicKey: ${testPublicKey}`
  })

  // Signature tests
  console.log('Testing Signature...')

  await runTest('Signature.from', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    const sigStr = sig.customToString()
    const reconstructed = Signature.from(sigStr)
    return reconstructed.customToString() === sigStr
  })

  await runTest('Signature.toBuffer', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    const buf = sig.toBuffer()
    return buf.length === 65
  })

  await runTest('Signature.customToString', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    const str = sig.customToString()
    return str.length === 130 && /^[0-9a-fA-F]+$/.test(str)
  })

  await runTest('Signature.getPublicKey', () => {
    const privKey = PrivateKey.fromString(testPrivateKey)
    const message = new Uint8Array(32).fill(0)
    const sig = privKey.sign(message)
    const recoveredPub = sig.getPublicKey(message)
    const expectedPub = privKey.createPublic()
    return recoveredPub.toString() === expectedPub.toString()
  })

  // Memo tests
  console.log('Testing Memo...')

  await runTest('Memo.encode (plaintext)', () => {
    const memo = 'This is a plain text memo'
    const encoded = Memo.encode(testPrivateKey, testPublicKey, memo)
    return encoded === memo
  })

  await runTest('Memo.encode (encrypted)', () => {
    const memo = '#This is an encrypted memo'
    const encoded = Memo.encode(testPrivateKey, testPublicKey, memo)
    return encoded.startsWith('#') && encoded !== memo
  })

  await runTest('Memo.decode (plaintext)', () => {
    const memo = 'Plain text memo'
    const decoded = Memo.decode(testPrivateKey, memo)
    return decoded === memo
  })

  // For encrypted, we need to encode first then decode
  await runTest('Memo.decode (encrypted)', () => {
    try {
      const original = '#Test encrypted message'
      const encoded = Memo.encode(testPrivateKey, testPublicKey, original)
      const decoded = Memo.decode(testPrivateKey, encoded)
      return decoded === original
    } catch (e) {
      console.error('Memo test error:', e)
      return false
    }
  })

  // Utils tests
  console.log('Testing utils...')

  await runTest('utils.validateUsername (valid)', () => {
    const error = utils.validateUsername('alice')
    return error === null
  })

  await runTest('utils.validateUsername (invalid: empty)', () => {
    const error = utils.validateUsername('')
    return error !== null
  })

  await runTest('utils.validateUsername (invalid: too short)', () => {
    const error = utils.validateUsername('ab')
    return error !== null
  })

  await runTest('utils.validateUsername (invalid: too long)', () => {
    const error = utils.validateUsername('a'.repeat(17))
    return error !== null
  })

  await runTest('utils.validateUsername (invalid: starts with digit)', () => {
    const error = utils.validateUsername('1alice')
    return error !== null
  })

  await runTest('utils.validateUsername (invalid: uppercase)', () => {
    const error = utils.validateUsername('Alice')
    return error !== null
  })

  await runTest('utils.makeBitMaskFilter', () => {
    const filter = utils.makeBitMaskFilter([0, 1, 64])
    return Array.isArray(filter) && filter.length === 2
  })

  await runTest('utils.buildWitnessSetProperties', () => {
    const props = {
      key: testPublicKey,
      account_creation_fee: '3.000 HIVE',
      maximum_block_size: 65536
    }
    const result = utils.buildWitnessSetProperties('testuser', props)
    return (
      Array.isArray(result) &&
      result[0] === 'witness_set_properties' &&
      JSON.stringify(result[1]) ===
        '{"extensions":[],"owner":"testuser","props":[["account_creation_fee","b80b00000000000003535445454d0000"],["key","03fdf4907810a9f5d9462a1ae09feee5ab205d32798b0ffcc379442021f84c5bbf"],["maximum_block_size","00000100"]]}'
    )
  })

  console.log('Testing utils chain math...')

  // Snapshot of a powering-down account from condenser_api.get_accounts
  const stakeAccount = {
    vesting_shares: '177805832.499280 VESTS',
    delegated_vesting_shares: '619129.407589 VESTS',
    received_vesting_shares: '0.000000 VESTS',
    vesting_withdraw_rate: '12398735.810485 VESTS',
    to_withdraw: 161183565536299,
    withdrawn: 123987358104850,
    voting_manabar: { current_mana: 153710560566990, last_update_time: 1794864276 },
    downvote_manabar: { current_mana: 41196991820301, last_update_time: 1794864276 }
  }
  // The chain's max_rc for the same account is effective vests - delegated RC + creation adjustment
  const chainMaxMana = 152525900134202 + 12264087895977 - 2020748973

  await runTest('utils.parseAsset (string and NAI)', () => {
    const str = utils.parseAsset('1.500 HIVE')
    const nai = utils.parseAsset({ amount: '1500', precision: 3, nai: '@@000000013' })
    try {
      utils.parseAsset('abc')
      return false
    } catch {
      return str.amount === 1.5 && str.symbol === 'HIVE' && nai.amount === 1.5 && nai.symbol === 'HBD'
    }
  })

  await runTest('utils.vestsToHP and utils.hpToVests', async () => {
    const props = await callRPC('condenser_api.get_dynamic_global_properties')
    const hp = await utils.vestsToHP(props.total_vesting_shares)
    const fund = utils.parseAsset(props.total_vesting_fund_hive).amount
    // the cached props may be a block apart from ours
    return (
      Math.abs(hp / fund - 1) < 1e-4 &&
      Math.abs((await utils.hpToVests(await utils.vestsToHP(1000))) - 1000) < 1e-9
    )
  })

  await runTest('utils mana matches chain values', async () => {
    const at = (seconds: number) => (1794864276 + seconds) * 1000
    const up = await utils.getVotingMana(stakeAccount, at(0))
    const down = await utils.getDownvoteMana(stakeAccount, at(0))
    const rc = await utils.getRCMana(
      { max_rc: 100, rc_manabar: { current_mana: 50, last_update_time: 1794864276 } },
      at(43200)
    )
    return (
      up.max === chainMaxMana &&
      up.current === 153710560566990 &&
      // one hour regenerates max / 120
      (await utils.getVotingMana(stakeAccount, at(3600))).current === 155083793627666 &&
      (await utils.getVotingMana(stakeAccount, at(432000))).percentage === 100 &&
      down.max === 41196991820301 &&
      down.percentage === 100 &&
      rc.current === 60 &&
      rc.percentage === 60
    )
  })

  await runTest('utils helpers fetch by name with one cached request', async () => {
    const realFetch = globalThis.fetch
    let requests = 0
    globalThis.fetch = (...args) => {
      requests++
      return realFetch(...args)
    }
    try {
      const [up, down] = await Promise.all([
        utils.getVotingMana('hiveio'),
        utils.getDownvoteMana('hiveio')
      ])
      const rc = await utils.getRCMana('hiveio')
      // valid but unregistered name; names over 16 characters are rejected by the node instead
      const missing = await utils.getVotingMana('no-such-acct-x1').catch((e) => e.message)
      return (
        requests === 3 &&
        up.max > 0 &&
        down.max === Math.floor(up.max * 0.25) &&
        rc.max > 0 &&
        missing === 'Account not found: no-such-acct-x1'
      )
    } finally {
      globalThis.fetch = realFetch
    }
  })

  await runTest('utils.getVoteRShares matches an on-chain vote', async () => {
    // A 5.34% vote by a powering-down account; the chain gave it 636980901 rshares
    const voter = {
      vesting_shares: '692587.108537 VESTS',
      delegated_vesting_shares: '0.000000 VESTS',
      received_vesting_shares: '0.000000 VESTS',
      vesting_withdraw_rate: '49346.564795 VESTS',
      to_withdraw: 641505342326,
      withdrawn: 246732823975,
      voting_manabar: { current_mana: 642553562841, last_update_time: 1794864393 },
      downvote_manabar: { current_mana: 160810135935, last_update_time: 1794864393 }
    }
    return (
      (await utils.getVoteRShares(voter, 534)) === 636980901 &&
      (await utils.getVoteRShares(voter, -534)) === -636980901 &&
      // below the dust threshold a vote adds nothing
      (await utils.getVoteRShares(voter, 1)) === 0
    )
  })

  await runTest('utils.getVoteValue', async () => {
    const fund = await callRPC('condenser_api.get_reward_fund', ['post'])
    const price = await callRPC('condenser_api.get_current_median_history_price')
    // a full vote: 2% of max mana minus dust, as a share of the pool, in HBD
    const rshares = Math.ceil(chainMaxMana * 0.02) - 50_000_000
    const expected =
      ((rshares * utils.parseAsset(fund.reward_balance).amount) / Number(fund.recent_claims)) *
      (utils.parseAsset(price.base).amount / utils.parseAsset(price.quote).amount)
    // the cached fund may be a block apart from ours
    return Math.abs((await utils.getVoteValue(stakeAccount)) / expected - 1) < 1e-3
  })

  await runTest('utils.formatReputation', () => {
    return (
      Math.floor(utils.formatReputation('225722985673795')) === 73 &&
      utils.formatReputation(0) === 25 &&
      utils.formatReputation(-1234567890123) < 0
    )
  })

  await runTest('utils.createPermlink', () => {
    const permlink = utils.createPermlink('Héllo, Wörld — Café!')
    const reply = utils.createPermlink()
    return (
      /^hello-world-cafe-[0-9a-f]{12}$/.test(permlink) &&
      /^[0-9a-f]{12}$/.test(reply) &&
      reply !== utils.createPermlink()
    )
  })

  // Transaction additional tests
  console.log('Testing Transaction extras...')

  await runTest('Transaction.sign & verify', async () => {
    const trx = new Transaction()
    await trx.addOperation('transfer', {
      from: 'testuser',
      to: 'alice',
      amount: '1.000 HIVE',
      memo: 'test'
    })
    const privKey = PrivateKey.fromString(testPrivateKey)
    trx.sign(privKey)
    return privKey
      .createPublic()
      .verify(trx.digest().digest, Signature.from(trx.transaction!.signatures[0]))
  })

  await runTest('Transaction.digest', async () => {
    const trx = new Transaction()
    await trx.addOperation('transfer', {
      from: 'testuser',
      to: 'alice',
      amount: '1.000 HIVE',
      memo: 'test'
    })
    const digest = trx.digest()
    return digest.digest.length === 32 && typeof digest.txId === 'string'
  })

  await runTest('Transaction.addSignature', async () => {
    const trx = new Transaction()
    await trx.addOperation('transfer', {
      from: 'testuser',
      to: 'alice',
      amount: '1.000 HIVE',
      memo: 'test'
    })
    const signature = '1f6a9a9c4e6a8b7...2d00' // 130 char hex
    const paddedSig = signature.padEnd(130, '0')
    const signed = trx.addSignature(paddedSig)
    return signed.signatures.includes(paddedSig)
  })

  console.log('Testing API calls...')

  await runTest('callRPC(condenser_api.get_accounts)', async () => {
    try {
      const res = await callRPC('condenser_api.get_accounts', [['mahdiyari']])
      return res[0].name === 'mahdiyari'
    } catch {
      return false
    }
  })

  await runTest('callRPC() failover', async () => {
    const temp = config.nodes
    try {
      config.nodes = ['https://bad-url-very-very-bad-url', 'https://another-bad-url', ...temp]
      const res = await callRPC('condenser_api.get_accounts', [['mahdiyari']])
      return res[0].name === 'mahdiyari'
    } catch {
      return false
    } finally {
      config.nodes = temp
    }
  })

  await runTest('callRPCBatch() returns results in params order', async () => {
    const blocks = await callRPCBatch('condenser_api.get_block', [[3], [1], [2]])
    return blocks.map((b) => parseInt(b.block_id.slice(0, 8), 16)).join() === '3,1,2'
  })

  await runTest('callWithQuorum(condenser_api.get_accounts)', async () => {
    try {
      const res = await callWithQuorum('condenser_api.get_accounts', [['mahdiyari']])
      return res[0].name === 'mahdiyari'
    } catch {
      return false
    }
  })

  await runTest('callWithQuorum() failover', async () => {
    const temp = config.nodes
    try {
      config.nodes = [
        'https://bad-url-very-very-bad-url',
        'https://another-bad-urla',
        'https://another-bad-urlb',
        'https://another-bad-urlc',
        ...temp
      ]
      const res = await callWithQuorum('condenser_api.get_accounts', [['mahdiyari']])
      return res[0].name === 'mahdiyari'
    } catch {
      return false
    } finally {
      config.nodes = temp
    }
  })

  await runTest('callREST(hafbe, /accounts/{account-name})', async () => {
    try {
      const res = await callREST('hafbe', '/accounts/{account-name}', {
        'account-name': 'mahdiyari'
      })
      return res.name === 'mahdiyari'
    } catch {
      return false
    }
  })

  await runTest('callREST() failover', async () => {
    const temp = config.restNodes
    try {
      config.restNodes = ['https://bad-url-very-very-bad-url', 'https://another-bad-url', ...temp]
      const res = await callREST('hafbe', '/accounts/{account-name}', {
        'account-name': 'mahdiyari'
      })
      return res.name === 'mahdiyari'
    } catch {
      return false
    } finally {
      config.restNodes = temp
    }
  })

  console.log('Testing streamBlocks...')

  await runTest('streamBlockNumbers() yields a past range in order and stops', async () => {
    const nums: number[] = []
    for await (const num of streamBlockNumbers({ from: 90000000, to: 90000044 })) {
      nums.push(num)
    }
    return nums.length === 45 && nums.every((num, i) => num === 90000000 + i)
  })

  await runTest('streamBlockNumbers() follows new blocks', async () => {
    const nums: number[] = []
    for await (const num of streamBlockNumbers()) {
      nums.push(num)
      if (nums.length === 2) break
    }
    return nums[1] === nums[0] + 1
  })

  await runTest('streamBlocks() yields a past range in order and stops', async () => {
    const blocks: Block[] = []
    for await (const block of streamBlocks({ from: 90000000, to: 90000049 })) {
      blocks.push(block)
    }
    return (
      blocks.length === 50 &&
      blocks.every(
        (b, i) =>
          b.block_num === 90000000 + i &&
          parseInt(b.block_id.slice(0, 8), 16) === b.block_num &&
          (i === 0 || b.previous === blocks[i - 1].block_id)
      )
    )
  })

  await runTest('streamBlocks() follows new blocks', async () => {
    const nums = []
    for await (const block of streamBlocks()) {
      nums.push(block.block_num)
      if (nums.length === 2) break
    }
    return nums[1] === nums[0] + 1
  })

  await runTest('streamOperations() matches block operations plus virtual ones', async () => {
    const range = { from: 90000000, to: 90000004 }
    const blockOps: Operation[] = []
    for await (const block of streamBlocks(range)) {
      for (const tx of block.transactions) blockOps.push(...tx.operations)
    }
    const ops: AppliedOperation[] = []
    for await (const op of streamOperations(range)) ops.push(op)
    const virtualOps: AppliedOperation[] = []
    for await (const op of streamOperations({ ...range, only_virtual: true })) virtualOps.push(op)
    const real = ops.filter((o) => !o.virtual_op)
    return (
      // The two APIs order object keys differently
      isDeepStrictEqual(
        real.map((o) => o.op),
        blockOps
      ) &&
      virtualOps.length === ops.length - real.length &&
      virtualOps.every((o) => o.virtual_op) &&
      new Set(ops.map((o) => o.block)).size === 5
    )
  })

  console.log(`\nCoverage tests completed: ${passedTests}/${totalTests} passed`)
  if (passedTests !== totalTests) {
    throw new Error(`${totalTests - passedTests} coverage test(s) failed`)
  }
}
