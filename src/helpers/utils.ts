import { Serializer } from './serializer.js'
import { ByteBuffer } from './ByteBuffer.js'
import { PublicKey } from './PublicKey.js'
import { bytesToHex, randomBytes } from '@noble/hashes/utils.js'
import { cachedRPC, fetchAccount } from './cachedRPC.js'
import type {
  Beneficiary,
  CommentOptionsOperation,
  Operation,
  WitnessSetPropertiesOperation
} from '../types.js'

export * from './authority.js'
export * from './chainMath.js'
export * from './keys.js'
export * from './social.js'

export interface WitnessProps {
  account_creation_fee?: string
  account_subsidy_budget?: number
  account_subsidy_decay?: number
  key: PublicKey | string
  maximum_block_size?: number
  new_signing_key?: PublicKey | string | null
  hbd_exchange_rate?: { base: string; quote: string }
  hbd_interest_rate?: number
  url?: string
}

/** Return null for a valid username */
export const validateUsername = (username: string): null | string => {
  let suffix = 'Account name should '
  if (!username) {
    return suffix + 'not be empty.'
  }
  const length = username.length
  if (length < 3) {
    return suffix + 'be longer.'
  }
  if (length > 16) {
    return suffix + 'be shorter.'
  }
  if (/\./.test(username)) {
    suffix = 'Each account segment should '
  }
  const ref = username.split('.')
  const len = ref.length
  for (let i = 0; i < len; i++) {
    const label = ref[i]
    if (!/^[a-z]/.test(label)) {
      return suffix + 'start with a lowercase letter.'
    }
    if (!/^[a-z0-9-]*$/.test(label)) {
      return suffix + 'have only lowercase letters, digits, or dashes.'
    }
    if (!/[a-z0-9]$/.test(label)) {
      return suffix + 'end with a lowercase letter or digit.'
    }
    if (!(label.length >= 3)) {
      return suffix + 'be longer'
    }
  }
  return null
}

/** True if the account exists. Pair it with `validateUsername` on signup. */
export const accountExists = async (name: string): Promise<boolean> =>
  (await cachedRPC<unknown[]>('condenser_api.get_accounts', [[name]])).length > 0

/** Account fields used for its profile, from `get_accounts` or `find_accounts` */
export interface ProfileAccount {
  json_metadata: string
  posting_json_metadata: string
}

/**
 * The profile an account set (name, about, profile_image, cover_image, location, website...),
 * from posting_json_metadata, else json_metadata, else `{}`. Values are user-written and unchecked.
 */
export const getProfile = async (
  account: string | ProfileAccount
): Promise<Record<string, unknown>> => {
  const acc = await fetchAccount(account)
  return readProfile(acc.posting_json_metadata) ?? readProfile(acc.json_metadata) ?? {}
}

const readProfile = (json: string): Record<string, unknown> | undefined => {
  try {
    const profile = JSON.parse(json)?.profile
    return profile && typeof profile === 'object' && !Array.isArray(profile) ? profile : undefined
  } catch {
    return undefined
  }
}

/**
 * The key role the chain requires to sign `operation`.
 * `witness_set_properties` throws: it is signed with the witness signing key, not an account key.
 */
export const getRequiredRole = ([name, body]: Operation): 'posting' | 'active' | 'owner' => {
  switch (name) {
    case 'vote':
    case 'comment':
    case 'comment_options':
    case 'delete_comment':
    case 'claim_reward_balance':
      return 'posting'
    case 'custom_json':
      return body.required_auths.length ? 'active' : 'posting'
    case 'account_update':
      return body.owner ? 'owner' : 'active'
    case 'account_update2':
      if (body.owner) return 'owner'
      // Only posting_json_metadata changes need just the posting key
      return body.active || body.posting || body.memo_key || body.json_metadata
        ? 'active'
        : 'posting'
    case 'change_recovery_account':
    case 'decline_voting_rights':
    case 'recover_account':
      return 'owner'
    case 'witness_set_properties':
      throw new Error('witness_set_properties is signed with the witness signing key')
    default:
      return 'active'
  }
}

export const operations = {
  vote: 0,
  comment: 1,
  transfer: 2,
  transfer_to_vesting: 3,
  withdraw_vesting: 4,
  limit_order_create: 5,
  limit_order_cancel: 6,
  feed_publish: 7,
  convert: 8,
  account_create: 9,
  account_update: 10,
  witness_update: 11,
  account_witness_vote: 12,
  account_witness_proxy: 13,
  pow: 14,
  custom: 15,
  report_over_production: 16,
  delete_comment: 17,
  custom_json: 18,
  comment_options: 19,
  set_withdraw_vesting_route: 20,
  limit_order_create2: 21,
  claim_account: 22,
  create_claimed_account: 23,
  request_account_recovery: 24,
  recover_account: 25,
  change_recovery_account: 26,
  escrow_transfer: 27,
  escrow_dispute: 28,
  escrow_release: 29,
  pow2: 30,
  escrow_approve: 31,
  transfer_to_savings: 32,
  transfer_from_savings: 33,
  cancel_transfer_from_savings: 34,
  custom_binary: 35,
  decline_voting_rights: 36,
  reset_account: 37,
  set_reset_account: 38,
  claim_reward_balance: 39,
  delegate_vesting_shares: 40,
  account_create_with_delegation: 41,
  witness_set_properties: 42,
  account_update2: 43,
  create_proposal: 44,
  update_proposal_votes: 45,
  remove_proposal: 46,
  update_proposal: 47,
  collateralized_convert: 48,
  recurrent_transfer: 49,
  // virtual ops
  fill_convert_request: 50,
  author_reward: 51,
  curation_reward: 52,
  comment_reward: 53,
  liquidity_reward: 54,
  interest: 55,
  fill_vesting_withdraw: 56,
  fill_order: 57,
  shutdown_witness: 58,
  fill_transfer_from_savings: 59,
  hardfork: 60,
  comment_payout_update: 61,
  return_vesting_delegation: 62,
  comment_benefactor_reward: 63,
  producer_reward: 64,
  clear_null_account_balance: 65,
  proposal_pay: 66,
  sps_fund: 67,
  hardfork_hive: 68,
  hardfork_hive_restore: 69,
  delayed_voting: 70,
  consolidate_treasury_balance: 71,
  effective_comment_vote: 72,
  ineffective_delete_comment: 73,
  sps_convert: 74,
  expired_account_notification: 75,
  changed_recovery_account: 76,
  transfer_to_vesting_completed: 77,
  pow_reward: 78,
  vesting_shares_split: 79,
  account_created: 80,
  fill_collateralized_convert_request: 81,
  system_warning: 82,
  fill_recurrent_transfer: 83,
  failed_recurrent_transfer: 84,
  limit_order_cancelled: 85,
  producer_missed: 86,
  proposal_fee: 87,
  collateralized_convert_immediate_conversion: 88,
  escrow_approved: 89,
  escrow_rejected: 90,
  proxy_cleared: 91,
  declined_voting_rights: 92
}

/**
 * Make bitmask filter to be used with get_account_history call
 */
export const makeBitMaskFilter = (allowedOperations: number[]): any[] => {
  return allowedOperations
    .reduce(reduceFunction, [BigInt(0), BigInt(0)])
    .map((value: bigint) => (value !== BigInt(0) ? value.toString() : null))
}
const reduceFunction = (
  [low, high]: [bigint, bigint],
  allowedOperation: number
): [bigint, bigint] => {
  if (allowedOperation < 64) {
    return [low | (BigInt(1) << BigInt(allowedOperation)), high]
  } else {
    return [low, high | (BigInt(1) << BigInt(allowedOperation - 64))]
  }
}

export const buildWitnessSetProperties = (
  owner: string,
  props: WitnessProps
): ['witness_set_properties', WitnessSetPropertiesOperation] => {
  const data: WitnessSetPropertiesOperation = {
    extensions: [],
    owner,
    props: []
  }
  for (const key of Object.keys(props)) {
    let type
    switch (key) {
      case 'key':
      case 'new_signing_key':
        type = Serializer.PublicKey
        break
      case 'account_subsidy_budget':
      case 'account_subsidy_decay':
      case 'maximum_block_size':
        type = Serializer.UInt32
        break
      case 'hbd_interest_rate':
        type = Serializer.UInt16
        break
      case 'url':
        type = Serializer.String
        break
      case 'hbd_exchange_rate':
        type = Serializer.Price
        break
      case 'account_creation_fee':
        type = Serializer.Asset
        break
      default:
        throw new Error(`Unknown witness prop: ${key}`)
    }
    data.props.push([key, serialize(type, props[key])])
  }
  data.props.sort((a, b) => a[0].localeCompare(b[0]))
  return ['witness_set_properties', data]
}

const serialize = (serializer: any, data: any) => {
  const buffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
  serializer(buffer, data)
  buffer.flip()
  // `props` values must be hex
  return bytesToHex(new Uint8Array(buffer.toBuffer()))
}

/**
 * Makes a permlink from a title with a random suffix, e.g. `"hello-world-3f9a1c0b7e2d"`.
 * Without a title (e.g. for replies), returns only the random part.
 */
export const createPermlink = (title = ''): string => {
  const slug = title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents: "café" -> "cafe"
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 200)
    .replace(/^-+|-+$/g, '')
  const suffix = bytesToHex(randomBytes(6))
  return slug ? `${slug}-${suffix}` : suffix
}

export interface CommentOptions {
  beneficiaries?: Beneficiary[]
  /** Default `'1000000.000 HBD'`; `'0.000 HBD'` declines the payout */
  maxAcceptedPayout?: string
  /** HBD share of the liquid payout: 10000 (default) is 50% HBD, 0 is 100% Hive Power */
  percentHbd?: number
  allowVotes?: boolean
  allowCurationRewards?: boolean
}

// shortcut: limit hardcoded as of HF28; update it if a hardfork changes HIVE_MAX_COMMENT_BENEFICIARIES
const MAX_BENEFICIARIES = 8

/**
 * Builds `comment_options` for a post or comment, sorting beneficiaries as the chain requires.
 * Add it in the same transaction as the `comment`: beneficiaries cannot be set once it has votes.
 */
export const commentOptions = (
  author: string,
  permlink: string,
  {
    beneficiaries = [],
    maxAcceptedPayout = '1000000.000 HBD',
    percentHbd = 10000,
    allowVotes = true,
    allowCurationRewards = true
  }: CommentOptions = {}
): ['comment_options', CommentOptionsOperation] => {
  if (beneficiaries.length > MAX_BENEFICIARIES) {
    throw new Error(`At most ${MAX_BENEFICIARIES} beneficiaries`)
  }
  if (beneficiaries.reduce((sum, b) => sum + b.weight, 0) > 10000) {
    throw new Error('Beneficiary weights add up to more than 10000 (100%)')
  }
  const sorted = [...beneficiaries].sort((a, b) => (a.account < b.account ? -1 : 1))
  return [
    'comment_options',
    {
      author,
      permlink,
      max_accepted_payout: maxAcceptedPayout,
      percent_hbd: percentHbd,
      allow_votes: allowVotes,
      allow_curation_rewards: allowCurationRewards,
      extensions: sorted.length ? [[0, { beneficiaries: sorted }]] : []
    }
  ]
}
