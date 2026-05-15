import { Asset } from './helpers/Asset.js'
import { PublicKey } from './helpers/PublicKey.js'

// Asset types
export type AssetSymbol = 'HIVE' | 'HBD' | 'VESTS' | 'STEEM' | 'SBD' | 'TESTS' | 'TBD'

// Authority types
export interface Authority {
  weight_threshold: number
  account_auths: Array<[string, number]>
  key_auths: Array<[string | PublicKey, number]>
}

export interface Beneficiary {
  account: string
  weight: number
}

// Price type
export interface Price {
  base: Asset | string
  quote: Asset | string
}

// Chain Properties
export interface ChainProperties {
  account_creation_fee: Asset | string
  maximum_block_size: number
  hbd_interest_rate: number
}

// Witness Props
export interface WitnessProps {
  account_creation_fee?: Asset | string
  account_subsidy_budget?: number
  account_subsidy_decay?: number
  key?: string | PublicKey
  maximum_block_size?: number
  new_signing_key?: string | PublicKey | null
  hbd_exchange_rate?: Price
  hbd_interest_rate?: number
  url?: string
}

export interface VoteOperation {
  voter: string
  author: string
  permlink: string
  weight: number
}

export interface CommentOperation {
  parent_author: string
  parent_permlink: string
  author: string
  permlink: string
  title: string
  body: string
  json_metadata: string
}

export interface TransferOperation {
  from: string
  to: string
  amount: Asset | string
  memo: string
}

export interface TransferToVestingOperation {
  from: string
  to: string
  amount: Asset | string
}

export interface WithdrawVestingOperation {
  account: string
  vesting_shares: Asset | string
}

export interface AccountCreateOperation {
  fee: Asset | string
  creator: string
  new_account_name: string
  owner: Authority
  active: Authority
  posting: Authority
  memo_key: string | PublicKey
  json_metadata: string
}

export interface AccountCreateWithDelegationOperation {
  fee: Asset | string
  delegation: Asset | string
  creator: string
  new_account_name: string
  owner: Authority
  active: Authority
  posting: Authority
  memo_key: string | PublicKey
  json_metadata: string
  extensions: []
}

export interface AccountUpdateOperation {
  account: string
  owner?: Authority
  active?: Authority
  posting?: Authority
  memo_key: string | PublicKey
  json_metadata: string
}

export interface AccountUpdate2Operation {
  account: string
  owner?: Authority
  active?: Authority
  posting?: Authority
  memo_key?: string | PublicKey
  json_metadata: string
  posting_json_metadata: string
  extensions: []
}

export interface AccountWitnessVoteOperation {
  account: string
  witness: string
  approve: boolean
}

export interface AccountWitnessProxyOperation {
  account: string
  proxy: string
}

export interface ConvertOperation {
  owner: string
  requestid: number
  amount: Asset | string
}

export interface CollateralizedConvertOperation {
  owner: string
  requestid: number
  amount: Asset | string
}

export interface CustomOperation {
  required_auths: string[]
  id: number
  data: Uint8Array | string
}

export interface CustomJsonOperation {
  required_auths: string[]
  required_posting_auths: string[]
  id: string
  json: string
}

export interface ClaimAccountOperation {
  creator: string
  fee: Asset | string
  extensions: []
}

export interface CreateClaimedAccountOperation {
  creator: string
  new_account_name: string
  owner: Authority
  active: Authority
  posting: Authority
  memo_key: string | PublicKey
  json_metadata: string
  extensions: []
}

export interface ClaimRewardBalanceOperation {
  account: string
  reward_hive: Asset | string
  reward_hbd: Asset | string
  reward_vests: Asset | string
}

export interface DelegateVestingSharesOperation {
  delegator: string
  delegatee: string
  vesting_shares: Asset | string
}

export interface DeleteCommentOperation {
  author: string
  permlink: string
}

export interface CommentOptionsOperation {
  author: string
  permlink: string
  max_accepted_payout: Asset | string
  percent_hbd: number
  allow_votes: boolean
  allow_curation_rewards: boolean
  extensions: Array<Array<Beneficiary>>
}

export interface SetWithdrawVestingRouteOperation {
  from_account: string
  to_account: string
  percent: number
  auto_vest: boolean
}

export interface WitnessUpdateOperation {
  owner: string
  url: string
  block_signing_key: string | PublicKey
  props: ChainProperties
  fee: Asset | string
}

export interface WitnessSetPropertiesOperation {
  owner: string
  props: Array<[string, string]>
  extensions: []
}

export interface AccountWitnessVoteOperation {
  account: string
  witness: string
  approve: boolean
}

export interface DeclineVotingRightsOperation {
  account: string
  decline: boolean
}

export interface ResetAccountOperation {
  reset_account: string
  account_to_reset: string
  new_owner_authority: Authority
}

export interface SetResetAccountOperation {
  account: string
  current_reset_account: string
  reset_account: string
}

export interface TransferToSavingsOperation {
  from: string
  to: string
  amount: Asset | string
  memo: string
}

export interface TransferFromSavingsOperation {
  from: string
  request_id: number
  to: string
  amount: Asset | string
  memo: string
}

export interface CancelTransferFromSavingsOperation {
  from: string
  request_id: number
}

export interface LimitOrderCreateOperation {
  owner: string
  orderid: number
  amount_to_sell: Asset | string
  min_to_receive: Asset | string
  fill_or_kill: boolean
  expiration: string | Date
}

export interface LimitOrderCreate2Operation {
  owner: string
  orderid: number
  amount_to_sell: Asset | string
  fill_or_kill: boolean
  exchange_rate: Price
  expiration: string | Date
}

export interface LimitOrderCancelOperation {
  owner: string
  orderid: number
}

export interface FeedPublishOperation {
  publisher: string
  exchange_rate: Price
}

export interface EscrowTransferOperation {
  from: string
  to: string
  hbd_amount: Asset | string
  hive_amount: Asset | string
  escrow_id: number
  agent: string
  fee: Asset | string
  json_meta: string
  ratification_deadline: string | Date
  escrow_expiration: string | Date
}

export interface EscrowDisputeOperation {
  from: string
  to: string
  agent: string
  who: string
  escrow_id: number
}

export interface EscrowReleaseOperation {
  from: string
  to: string
  agent: string
  who: string
  receiver: string
  escrow_id: number
  hbd_amount: Asset | string
  hive_amount: Asset | string
}

export interface EscrowApproveOperation {
  from: string
  to: string
  agent: string
  who: string
  escrow_id: number
  approve: boolean
}

export interface RecoverAccountOperation {
  account_to_recover: string
  new_owner_authority: Authority
  recent_owner_authority: Authority
  extensions: []
}

export interface RequestAccountRecoveryOperation {
  recovery_account: string
  account_to_recover: string
  new_owner_authority: Authority
  extensions: []
}

export interface ChangeRecoveryAccountOperation {
  account_to_recover: string
  new_recovery_account: string
  extensions: []
}

export interface TransferOperation {
  from: string
  to: string
  amount: Asset | string
  memo: string
}

export interface RecurrentTransferOperation {
  from: string
  to: string
  amount: Asset | string
  memo: string
  recurrence: number
  executions: number
  extensions: Array<{ type: number; value: { pair_id: number } }>
}

export interface CreateProposalOperation {
  creator: string
  receiver: string
  start_date: string | Date
  end_date: string | Date
  daily_pay: Asset | string
  subject: string
  permlink: string
  extensions: []
}

export interface UpdateProposalOperation {
  proposal_id: number
  creator: string
  daily_pay: Asset | string
  subject: string
  permlink: string
  extensions: Array<Array<{ end_date: string | Date }>>
}

export interface UpdateProposalVotesOperation {
  voter: string
  proposal_ids: number[]
  approve: boolean
  extensions: []
}

export interface RemoveProposalOperation {
  proposal_owner: string
  proposal_ids: number[]
  extensions: []
}

// Operation Union Type
export type Operation =
  | ['vote', VoteOperation]
  | ['comment', CommentOperation]
  | ['transfer', TransferOperation]
  | ['transfer_to_vesting', TransferToVestingOperation]
  | ['withdraw_vesting', WithdrawVestingOperation]
  | ['account_create', AccountCreateOperation]
  | ['account_create_with_delegation', AccountCreateWithDelegationOperation]
  | ['account_update', AccountUpdateOperation]
  | ['account_update2', AccountUpdate2Operation]
  | ['account_witness_vote', AccountWitnessVoteOperation]
  | ['account_witness_proxy', AccountWitnessProxyOperation]
  | ['convert', ConvertOperation]
  | ['collateralized_convert', CollateralizedConvertOperation]
  | ['custom', CustomOperation]
  | ['custom_json', CustomJsonOperation]
  | ['claim_account', ClaimAccountOperation]
  | ['create_claimed_account', CreateClaimedAccountOperation]
  | ['claim_reward_balance', ClaimRewardBalanceOperation]
  | ['delegate_vesting_shares', DelegateVestingSharesOperation]
  | ['delete_comment', DeleteCommentOperation]
  | ['comment_options', CommentOptionsOperation]
  | ['set_withdraw_vesting_route', SetWithdrawVestingRouteOperation]
  | ['witness_update', WitnessUpdateOperation]
  | ['witness_set_properties', WitnessSetPropertiesOperation]
  | ['decline_voting_rights', DeclineVotingRightsOperation]
  | ['reset_account', ResetAccountOperation]
  | ['set_reset_account', SetResetAccountOperation]
  | ['transfer_to_savings', TransferToSavingsOperation]
  | ['transfer_from_savings', TransferFromSavingsOperation]
  | ['cancel_transfer_from_savings', CancelTransferFromSavingsOperation]
  | ['limit_order_create', LimitOrderCreateOperation]
  | ['limit_order_create2', LimitOrderCreate2Operation]
  | ['limit_order_cancel', LimitOrderCancelOperation]
  | ['feed_publish', FeedPublishOperation]
  | ['escrow_transfer', EscrowTransferOperation]
  | ['escrow_dispute', EscrowDisputeOperation]
  | ['escrow_release', EscrowReleaseOperation]
  | ['escrow_approve', EscrowApproveOperation]
  | ['recover_account', RecoverAccountOperation]
  | ['request_account_recovery', RequestAccountRecoveryOperation]
  | ['change_recovery_account', ChangeRecoveryAccountOperation]
  | ['recurrent_transfer', RecurrentTransferOperation]
  | ['create_proposal', CreateProposalOperation]
  | ['update_proposal', UpdateProposalOperation]
  | ['update_proposal_votes', UpdateProposalVotesOperation]
  | ['remove_proposal', RemoveProposalOperation]

// Extract operation names and body types for conditional typing
export type OperationName = Operation[0]
export type OperationBody<O extends OperationName> = Extract<Operation, [O, any]>[1]

// Utility Types
export interface WitnessSetPropertiesParams extends WitnessProps {}

export type Extension = [] | [string, any] | any[]

// Transaction Types
export interface TransactionType {
  expiration: string
  extensions: Extension[]
  operations: [OperationName, OperationBody<OperationName>][]
  ref_block_num: number
  ref_block_prefix: number
  signatures: string[]
}

// API Response Types
// export interface BroadcastResponse {
//   id: number
//   jsonrpc: string
//   result: BroadcastResult
// }

export interface BroadcastError {
  id: number
  jsonrpc: string
  error: {
    code: number
    message: string
    data?: any
  }
}

export type CallResponse<T = any> =
  | {
      id: number
      jsonrpc: string
      result: T
    }
  | BroadcastError

export interface BroadcastResult {
  tx_id: string
  status: 'unknown' | 'within_irreversible_block' | 'expired_irreversible' | 'too_old'
}

export interface DigestData {
  digest: Uint8Array
  txId: string
}

import type { paths as balancePaths } from './type_generators/types/balance.js'
import type { paths as hafahPaths } from './type_generators/types/hafah.js'
import type { paths as hafbePaths } from './type_generators/types/hafbe.js'
import type { paths as hivemindPaths } from './type_generators/types/hivemind.js'
import type { paths as hivesensePaths } from './type_generators/types/hivesense.js'
import type { paths as reputationPaths } from './type_generators/types/reputation.js'
import type { paths as nfttrackerPaths } from './type_generators/types/nft-tracker.js'
import type { paths as hafsqlPaths } from './type_generators/types/hafsql.js'
import type { paths as statusPaths } from './type_generators/types/status.js'

export type APIMethods =
  | 'balance'
  | 'hafah'
  | 'hafbe'
  | 'hivemind'
  | 'hivesense'
  | 'reputation'
  | 'nft-tracker'
  | 'hafsql'
  | 'status'

export interface APIPaths {
  balance: balancePaths
  hafah: hafahPaths
  hafbe: hafbePaths
  hivemind: hivemindPaths
  hivesense: hivesensePaths
  reputation: reputationPaths
  'nft-tracker': nfttrackerPaths
  hafsql: hafsqlPaths
  status: statusPaths
}

export interface TransactionStatus {
  status:
    | 'unknown'
    | 'within_mempool'
    | 'within_reversible_block'
    | 'within_irreversible_block'
    | 'expired_reversible'
    | 'expired_irreversible'
    | 'too_old'
}
