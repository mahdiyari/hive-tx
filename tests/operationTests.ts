import { bytesToHex } from '@noble/hashes/utils.js'
import { Transaction, utils } from 'hive-tx'
import { getTransactionHex } from './getTransactionHex.js'
import { Client } from 'pg'

// Test public key
const testKey = 'STM8AGkwKrzgrAHcdGr2yyfyQHyjziJgjw2Yuy3352HBkUjQDRrAG'

// Minimal authority for test operations
const testAuthority = {
  weight_threshold: 1,
  account_auths: [],
  key_auths: [[testKey, 1]]
}

// Sample data for each operation type
const operationSamples: { [key: string]: any } = {
  vote: {
    voter: 'testuser',
    author: 'alice',
    permlink: 'test-post',
    weight: 10000
  },
  comment: {
    parent_author: '',
    parent_permlink: 'test-category',
    author: 'testuser',
    permlink: 'test-post-123',
    title: 'Test Post Title',
    body: 'This is a test post body for signing verification.',
    json_metadata: '{"tags":["test","signing"]}'
  },
  transfer: {
    from: 'testuser',
    to: 'alice',
    amount: '1.000 HIVE',
    memo: 'test memo'
  },
  transfer_to_vesting: {
    from: 'testuser',
    to: 'alice',
    amount: '1.000 HIVE'
  },
  withdraw_vesting: {
    account: 'testuser',
    vesting_shares: '1000.000000 VESTS'
  },
  account_create: {
    fee: '3.000 HIVE',
    creator: 'testuser',
    new_account_name: 'newtestuser',
    owner: testAuthority,
    active: testAuthority,
    posting: testAuthority,
    memo_key: testKey,
    json_metadata: '{"profile":{"name":"Test User"}}'
  },
  account_create_with_delegation: {
    fee: '0.001 HIVE',
    delegation: '1000.000000 VESTS',
    creator: 'testuser',
    new_account_name: 'newtestuser2',
    owner: testAuthority,
    active: testAuthority,
    posting: testAuthority,
    memo_key: testKey,
    json_metadata: '{}',
    extensions: []
  },
  account_update: {
    account: 'testuser',
    owner: testAuthority,
    active: testAuthority,
    posting: testAuthority,
    memo_key: testKey,
    json_metadata: '{"updated": true}'
  },
  account_update2: {
    account: 'testuser',
    owner: testAuthority,
    active: testAuthority,
    posting: testAuthority,
    memo_key: testKey,
    json_metadata: '{"updated2": true}',
    posting_json_metadata: '{"posting": true}',
    extensions: []
  },
  account_witness_vote: {
    account: 'testuser',
    witness: 'alice',
    approve: true
  },
  account_witness_proxy: {
    account: 'testuser',
    proxy: 'alice'
  },
  convert: {
    owner: 'testuser',
    requestid: 123456,
    amount: '1.000 HBD'
  },
  collateralized_convert: {
    owner: 'testuser',
    requestid: 654321,
    amount: '10.000 HIVE'
  },
  custom: {
    required_auths: ['testuser'],
    id: 1000,
    data: '123456'
  },
  custom_json: {
    required_auths: [],
    required_posting_auths: ['testuser'],
    id: 'test_operation',
    json: '{"value": "test"}'
  },
  claim_account: {
    creator: 'testuser',
    fee: '1.000 HIVE',
    extensions: []
  },
  create_claimed_account: {
    creator: 'testuser',
    new_account_name: 'claimedtestuser',
    owner: testAuthority,
    active: testAuthority,
    posting: testAuthority,
    memo_key: testKey,
    json_metadata: '{}',
    extensions: []
  },
  claim_reward_balance: {
    account: 'testuser',
    reward_hive: '0.001 HIVE',
    reward_hbd: '0.001 HBD',
    reward_vests: '0.001000 VESTS'
  },
  delegate_vesting_shares: {
    delegator: 'testuser',
    delegatee: 'alice',
    vesting_shares: '1000.000000 VESTS'
  },
  delete_comment: {
    author: 'testuser',
    permlink: 'test-post-to-delete'
  },
  comment_options: {
    author: 'testuser',
    permlink: 'test-post',
    max_accepted_payout: '1000.000 HBD',
    percent_hbd: 5000,
    allow_votes: true,
    allow_curation_rewards: true,
    extensions: [[0, { beneficiaries: [{ account: 'alice', weight: 500 }] }]]
  },
  set_withdraw_vesting_route: {
    from_account: 'testuser',
    to_account: 'alice',
    percent: 5000,
    auto_vest: false
  },
  witness_update: {
    owner: 'testuser',
    url: 'https://example.com',
    block_signing_key: testKey,
    props: {
      account_creation_fee: '3.000 HIVE',
      maximum_block_size: 65536,
      hbd_interest_rate: 1000
    },
    fee: '0.001 HIVE'
  },
  witness_set_properties: utils.buildWitnessSetProperties('testuser', {
    key: testKey,
    account_creation_fee: '0.000 HIVE',
    account_subsidy_budget: 10000,
    account_subsidy_decay: 330782,
    maximum_block_size: 65536,
    hbd_interest_rate: 0,
    hbd_exchange_rate: { base: '0.250 HBD', quote: '1.000 HIVE' },
    url: 'https://testurl',
    new_signing_key: testKey
  })[1],
  decline_voting_rights: {
    account: 'testuser',
    decline: false
  },
  reset_account: {
    reset_account: 'alice',
    account_to_reset: 'testuser',
    new_owner_authority: testAuthority
  },
  set_reset_account: {
    account: 'testuser',
    current_reset_account: 'alice',
    reset_account: 'bob'
  },
  transfer_to_savings: {
    from: 'testuser',
    to: 'alice',
    amount: '1.000 HIVE',
    memo: 'to savings'
  },
  transfer_from_savings: {
    from: 'testuser',
    request_id: 123,
    to: 'alice',
    amount: '0.500 HIVE',
    memo: 'from savings'
  },
  cancel_transfer_from_savings: {
    from: 'testuser',
    request_id: 123
  },
  limit_order_create: {
    owner: 'testuser',
    orderid: 1,
    amount_to_sell: '10.000 HIVE',
    min_to_receive: '1.000 HBD',
    fill_or_kill: false,
    expiration: new Date(Date.now() + 86400000).toISOString().slice(0, -5)
  },
  limit_order_create2: {
    owner: 'testuser',
    orderid: 2,
    amount_to_sell: '5.000 HBD',
    fill_or_kill: false,
    exchange_rate: {
      base: '1.000 HBD',
      quote: '10.000 HIVE'
    },
    expiration: new Date(Date.now() + 86400000).toISOString().slice(0, -5)
  },
  limit_order_cancel: {
    owner: 'testuser',
    orderid: 1
  },
  feed_publish: {
    publisher: 'testuser',
    exchange_rate: {
      base: '1.000 HBD',
      quote: '10.000 HIVE'
    }
  },
  escrow_transfer: {
    from: 'testuser',
    to: 'alice',
    hbd_amount: '1.000 HBD',
    hive_amount: '10.000 HIVE',
    escrow_id: 1,
    agent: 'bob',
    fee: '0.100 HIVE',
    json_meta: '{}',
    ratification_deadline: new Date(Date.now() + 86400000).toISOString().slice(0, -5),
    escrow_expiration: new Date(Date.now() + 172800000).toISOString().slice(0, -5)
  },
  escrow_dispute: {
    from: 'testuser',
    to: 'alice',
    agent: 'bob',
    who: 'testuser',
    escrow_id: 1
  },
  escrow_release: {
    from: 'testuser',
    to: 'alice',
    agent: 'bob',
    who: 'testuser',
    receiver: 'alice',
    escrow_id: 1,
    hbd_amount: '0.500 HBD',
    hive_amount: '5.000 HIVE'
  },
  escrow_approve: {
    from: 'testuser',
    to: 'alice',
    agent: 'bob',
    who: 'testuser',
    escrow_id: 1,
    approve: true
  },
  recover_account: {
    account_to_recover: 'testuser',
    new_owner_authority: testAuthority,
    recent_owner_authority: testAuthority,
    extensions: []
  },
  request_account_recovery: {
    recovery_account: 'alice',
    account_to_recover: 'testuser',
    new_owner_authority: testAuthority,
    extensions: []
  },
  change_recovery_account: {
    account_to_recover: 'testuser',
    new_recovery_account: 'alice',
    extensions: []
  },
  recurrent_transfer: {
    from: 'testuser',
    to: 'alice',
    amount: '1.000 HIVE',
    memo: 'recurrent transfer',
    recurrence: 24,
    executions: 10,
    extensions: [{ type: 1, value: { pair_id: 1 } }]
  },
  create_proposal: {
    creator: 'testuser',
    receiver: 'alice',
    start_date: new Date(Date.now() + 3600000).toISOString().slice(0, -5),
    end_date: new Date(Date.now() + 604800000).toISOString().slice(0, -5),
    daily_pay: '1.000 HBD',
    subject: 'Test Proposal',
    permlink: 'test-proposal-123',
    extensions: []
  },
  update_proposal: {
    proposal_id: 1,
    creator: 'testuser',
    daily_pay: '2.000 HBD',
    subject: 'Updated Proposal',
    permlink: 'test-proposal-124',
    extensions: []
  },
  update_proposal_votes: {
    voter: 'bob',
    proposal_ids: [1, 2, 3],
    approve: true,
    extensions: []
  },
  remove_proposal: {
    proposal_owner: 'testuser',
    proposal_ids: [1, 2],
    extensions: []
  }
}

// Operations to skip
const skipOperations = [
  'pow',
  'pow2',
  'report_over_production',
  'custom_binary',
  'witness_block_approve'
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const testOperation = async (opType: any, opData: any, index: number) => {
  console.log(`Testing operation ${index + 1}: ${opType}`)
  let passed = true
  try {
    const trx = new Transaction()
    await trx.addOperation(opType, opData)

    // Get transaction hex from API node
    const { digest: apiDigest, txId: apiTxId } = await getTransactionHex(trx.transaction!)

    // Compare results
    const localDigest = trx.digest()

    if (bytesToHex(localDigest.digest) === bytesToHex(apiDigest)) {
      console.log(`  ✅ Digest match for ${opType}`)
    } else {
      passed = false
      console.log(`  ❌ Digest mismatch for ${opType}`)
      console.log(`    Local:  ${bytesToHex(localDigest.digest)}`)
      console.log(`    API:    ${bytesToHex(apiDigest)}`)
    }

    if (localDigest.txId === apiTxId) {
      console.log(`  ✅ TxId match for ${opType}`)
    } else {
      passed = false
      console.log(`  ❌ TxId mismatch for ${opType}`)
      console.log(`    Local:  ${localDigest.txId}`)
      console.log(`    API:    ${apiTxId}`)
    }
  } catch (error) {
    passed = false
    console.log(`  ❌ Error testing ${opType}:`, error)
  } finally {
    return passed
  }
}

export const operationTests = async () => {
  const opTypes = Object.keys(operationSamples)

  console.log(`Testing ${opTypes.length} operations...\n`)

  const allOperationTypes = await getAllOperationsFromHafsql()
  const testedOps: Record<string, boolean> = {}
  allOperationTypes.forEach((value) => {
    testedOps[value.name] = false
  })

  let passedCount = 0

  for (let i = 0; i < opTypes.length; i++) {
    const opType = opTypes[i]
    const opData = operationSamples[opType]
    const passed = await testOperation(opType, opData, i)
    if (passed) {
      passedCount++
    }
    // Rate limiting sleep
    await sleep(100)
    // Mark tested
    const opName = `hive::protocol::${opType}_operation`
    testedOps[opName] = true
  }
  console.log('\nAll operation tests completed!')
  console.log(`✅ Passed tests:${passedCount}`)
  console.log(`❌ Failed tests:${opTypes.length - passedCount}`)

  for (const key in testedOps) {
    if (!testedOps[key]) {
      const opType = key.replace(/^.*::(.*)_operation$/, '$1')
      if (!skipOperations.includes(opType)) {
        console.log(`  ❌ Not implemented: ${opType}`)
      }
    }
  }
}

const getAllOperationsFromHafsql = async () => {
  const client = new Client({
    host: 'hafsql-sql.mahdiyari.info',
    port: 5432,
    database: 'haf_block_log',
    user: 'hafsql_public',
    password: 'hafsql_public'
  })
  await client.connect()
  const result = await client.query<{ id: number; name: string }>(
    'SELECT id, name FROM hafd.operation_types WHERE is_virtual=false'
  )
  await client.end()
  return result.rows
}
