import { PublicKey } from './PublicKey.js'
import { Asset } from './Asset.js'
import { HexBuffer } from './HexBuffer.js'
import { ByteBuffer } from './ByteBuffer.js'
import { Operation } from '../types.js'

// Operation ID constants for better maintainability
const OPERATION_IDS = {
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
  // pow: 14,
  custom: 15,
  // report_over_production: 16,
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
  // pow2: 30,
  escrow_approve: 31,
  transfer_to_savings: 32,
  transfer_from_savings: 33,
  cancel_transfer_from_savings: 34,
  // custom_binary: 35,
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
  recurrent_transfer: 49
} as const

type OperationId = (typeof OPERATION_IDS)[keyof typeof OPERATION_IDS]

const VoidSerializer = () => {
  throw new Error('Void can not be serialized')
}
const StringSerializer = (buffer: ByteBuffer, data: string) => {
  buffer.writeVString(data)
}

const Int8Serializer = (buffer: ByteBuffer, data: number) => {
  buffer.writeInt8(data)
}

const Int16Serializer = (buffer: ByteBuffer, data: number) => {
  buffer.writeInt16(data)
}

const Int32Serializer = (buffer: ByteBuffer, data: number) => {
  buffer.writeInt32(data)
}

const Int64Serializer = (buffer: ByteBuffer, data: number | bigint) => {
  buffer.writeInt64(data)
}

const UInt8Serializer = (buffer: ByteBuffer, data: number) => {
  buffer.writeUint8(data)
}

const UInt16Serializer = (buffer: ByteBuffer, data: number) => {
  buffer.writeUint16(data)
}

const UInt32Serializer = (buffer: ByteBuffer, data: number) => {
  buffer.writeUint32(data)
}

const UInt64Serializer = (buffer: ByteBuffer, data: number | bigint) => {
  buffer.writeUint64(data)
}

const BooleanSerializer = (buffer: ByteBuffer, data: number | boolean) => {
  buffer.writeByte(data ? 1 : 0)
}

const StaticVariantSerializer = (itemSerializers: any) => {
  // return (buffer: ByteBuffer, data: any[]) => {
  //   let id = data[0]
  //   const item = data[1]
  //   // id was/is supposed to be 0 or integer here but seems to have been changed in e.g. comment_options
  //   // extensions: [
  //   //   [
  //   //     "comment_payout_beneficiaries",
  //   //     {
  //   //       "beneficiaries": [
  //   //         {
  //   //           "account": "vimm",
  //   //           "weight": 1000
  //   //         }
  //   //       ]
  //   //     }
  //   //   ]
  //   // ]
  //   // Keep it here just in case
  //   // https://gitlab.syncad.com/hive/hive/-/issues/722
  //   // "comment_payout_beneficiaries" was 0 and at some point it got changed
  //   // It should still be serialized as a 0 or an integer
  //   // Now the question is, always 0? will need an example transaction to prove otherwise
  //   if (typeof id === 'string') {
  //     if (id === 'update_proposal_end_date') {
  //       id = 1
  //     } else {
  //       id = 0
  //     }
  //   }
  //   buffer.writeVarint32(id)
  //   itemSerializers[id](buffer, item)
  return (buffer: ByteBuffer, data: any) => {
    const [id, item] = data
    buffer.writeVarint32(id)
    itemSerializers[id](buffer, item)
  }
}

/**
 * Serialize asset.
 * @note This looses precision for amounts larger than 2^53-1/10^precision.
 *       Should not be a problem in real-word usage.
 */
const AssetSerializer = (buffer: ByteBuffer, data: string | Asset) => {
  const asset = Asset.from(data)
  const precision = asset.getPrecision()
  buffer.writeInt64(Math.round(asset.amount * Math.pow(10, precision)))
  buffer.writeUint8(precision)
  for (let i = 0; i < 7; i++) {
    buffer.writeUint8(asset.symbol.charCodeAt(i) || 0)
  }
}

const DateSerializer = (buffer: ByteBuffer, data: string) => {
  buffer.writeUint32(Math.floor(new Date(data + 'Z').getTime() / 1000))
}

const PublicKeySerializer = (buffer: ByteBuffer, data: string | PublicKey) => {
  if (
    data === null ||
    (typeof data === 'string' && data.slice(-39) === '1111111111111111111111111111111114T1Anm')
  ) {
    buffer.append(new Uint8Array(33).fill(0))
  } else {
    buffer.append(PublicKey.from(data).key)
  }
}

const BinarySerializer = (size: null | number = null) => {
  return (buffer: ByteBuffer, data: string | Uint8Array | HexBuffer) => {
    data = HexBuffer.from(data)
    const len = data.buffer.length
    if (size) {
      if (len !== size) {
        throw new Error(`Unable to serialize binary. Expected ${size} bytes, got ${len}`)
      }
    } else {
      buffer.writeVarint32(len)
    }
    buffer.append(data.buffer)
  }
}

const VariableBinarySerializer = BinarySerializer()

const FlatMapSerializer = (keySerializer: any, valueSerializer: any) => {
  return (buffer: ByteBuffer, data: any) => {
    buffer.writeVarint32(data.length)
    for (const [key, value] of data) {
      keySerializer(buffer, key)
      valueSerializer(buffer, value)
    }
  }
}

const ArraySerializer = (itemSerializer: any) => {
  return (buffer: ByteBuffer, data: any[]) => {
    buffer.writeVarint32(data.length)
    for (const item of data) {
      itemSerializer(buffer, item)
    }
  }
}

const ObjectSerializer = (keySerializers: any) => {
  return (buffer: ByteBuffer, data: any) => {
    for (const [key, serializer] of keySerializers) {
      try {
        serializer(buffer, data[key])
      } catch (error: any) {
        error.message = `${key}: ${error.message}`
        throw error
      }
    }
  }
}

const OptionalSerializer = (valueSerializer: any) => {
  return (buffer: ByteBuffer, data: any | undefined) => {
    if (data !== undefined) {
      buffer.writeByte(1)
      valueSerializer(buffer, data)
    } else {
      buffer.writeByte(0)
    }
  }
}

const AuthoritySerializer = ObjectSerializer([
  ['weight_threshold', UInt32Serializer],
  ['account_auths', FlatMapSerializer(StringSerializer, UInt16Serializer)],
  ['key_auths', FlatMapSerializer(PublicKeySerializer, UInt16Serializer)]
])

const BeneficiarySerializer = ObjectSerializer([
  ['account', StringSerializer],
  ['weight', UInt16Serializer]
])

const PriceSerializer = ObjectSerializer([
  ['base', AssetSerializer],
  ['quote', AssetSerializer]
])

// const SignedBlockHeaderSerializer = ObjectSerializer([
//   ['previous', BinarySerializer(20)],
//   ['timestamp', DateSerializer],
//   ['witness', StringSerializer],
//   ['transaction_merkle_root', BinarySerializer(20)],
//   ['extensions', ArraySerializer(VoidSerializer)],
//   ['witness_signature', BinarySerializer(65)]
// ])

const ChainPropertiesSerializer = ObjectSerializer([
  ['account_creation_fee', AssetSerializer],
  ['maximum_block_size', UInt32Serializer],
  ['hbd_interest_rate', UInt16Serializer]
])

const OperationDataSerializer = (operationId: OperationId, definitions: any) => {
  const objectSerializer = ObjectSerializer(definitions)
  return (buffer: ByteBuffer, data: any) => {
    buffer.writeVarint32(operationId)
    objectSerializer(buffer, data)
  }
}

const OperationSerializers: Record<string, ReturnType<typeof OperationDataSerializer>> = {}

OperationSerializers.account_create = OperationDataSerializer(OPERATION_IDS.account_create, [
  ['fee', AssetSerializer],
  ['creator', StringSerializer],
  ['new_account_name', StringSerializer],
  ['owner', AuthoritySerializer],
  ['active', AuthoritySerializer],
  ['posting', AuthoritySerializer],
  ['memo_key', PublicKeySerializer],
  ['json_metadata', StringSerializer]
])

OperationSerializers.account_create_with_delegation = OperationDataSerializer(
  OPERATION_IDS.account_create_with_delegation,
  [
    ['fee', AssetSerializer],
    ['delegation', AssetSerializer],
    ['creator', StringSerializer],
    ['new_account_name', StringSerializer],
    ['owner', AuthoritySerializer],
    ['active', AuthoritySerializer],
    ['posting', AuthoritySerializer],
    ['memo_key', PublicKeySerializer],
    ['json_metadata', StringSerializer],
    ['extensions', ArraySerializer(VoidSerializer)]
  ]
)

OperationSerializers.account_update = OperationDataSerializer(OPERATION_IDS.account_update, [
  ['account', StringSerializer],
  ['owner', OptionalSerializer(AuthoritySerializer)],
  ['active', OptionalSerializer(AuthoritySerializer)],
  ['posting', OptionalSerializer(AuthoritySerializer)],
  ['memo_key', PublicKeySerializer],
  ['json_metadata', StringSerializer]
])

OperationSerializers.account_witness_proxy = OperationDataSerializer(
  OPERATION_IDS.account_witness_proxy,
  [
    ['account', StringSerializer],
    ['proxy', StringSerializer]
  ]
)

OperationSerializers.account_witness_vote = OperationDataSerializer(
  OPERATION_IDS.account_witness_vote,
  [
    ['account', StringSerializer],
    ['witness', StringSerializer],
    ['approve', BooleanSerializer]
  ]
)

OperationSerializers.cancel_transfer_from_savings = OperationDataSerializer(
  OPERATION_IDS.cancel_transfer_from_savings,
  [
    ['from', StringSerializer],
    ['request_id', UInt32Serializer]
  ]
)

OperationSerializers.change_recovery_account = OperationDataSerializer(
  OPERATION_IDS.change_recovery_account,
  [
    ['account_to_recover', StringSerializer],
    ['new_recovery_account', StringSerializer],
    ['extensions', ArraySerializer(VoidSerializer)]
  ]
)

OperationSerializers.claim_account = OperationDataSerializer(OPERATION_IDS.claim_account, [
  ['creator', StringSerializer],
  ['fee', AssetSerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.claim_reward_balance = OperationDataSerializer(
  OPERATION_IDS.claim_reward_balance,
  [
    ['account', StringSerializer],
    ['reward_hive', AssetSerializer],
    ['reward_hbd', AssetSerializer],
    ['reward_vests', AssetSerializer]
  ]
)

OperationSerializers.comment = OperationDataSerializer(OPERATION_IDS.comment, [
  ['parent_author', StringSerializer],
  ['parent_permlink', StringSerializer],
  ['author', StringSerializer],
  ['permlink', StringSerializer],
  ['title', StringSerializer],
  ['body', StringSerializer],
  ['json_metadata', StringSerializer]
])

OperationSerializers.comment_options = OperationDataSerializer(OPERATION_IDS.comment_options, [
  ['author', StringSerializer],
  ['permlink', StringSerializer],
  ['max_accepted_payout', AssetSerializer],
  ['percent_hbd', UInt16Serializer],
  ['allow_votes', BooleanSerializer],
  ['allow_curation_rewards', BooleanSerializer],
  [
    'extensions',
    ArraySerializer(
      StaticVariantSerializer([
        ObjectSerializer([['beneficiaries', ArraySerializer(BeneficiarySerializer)]])
      ])
    )
  ]
])

OperationSerializers.convert = OperationDataSerializer(OPERATION_IDS.convert, [
  ['owner', StringSerializer],
  ['requestid', UInt32Serializer],
  ['amount', AssetSerializer]
])

OperationSerializers.create_claimed_account = OperationDataSerializer(
  OPERATION_IDS.create_claimed_account,
  [
    ['creator', StringSerializer],
    ['new_account_name', StringSerializer],
    ['owner', AuthoritySerializer],
    ['active', AuthoritySerializer],
    ['posting', AuthoritySerializer],
    ['memo_key', PublicKeySerializer],
    ['json_metadata', StringSerializer],
    ['extensions', ArraySerializer(VoidSerializer)]
  ]
)

OperationSerializers.custom = OperationDataSerializer(OPERATION_IDS.custom, [
  ['required_auths', ArraySerializer(StringSerializer)],
  ['id', UInt16Serializer],
  ['data', VariableBinarySerializer]
])

// Not used on chain
// OperationSerializers.custom_binary = OperationDataSerializer(OPERATION_IDS.custom_binary, [
//   ['required_owner_auths', ArraySerializer(StringSerializer)],
//   ['required_active_auths', ArraySerializer(StringSerializer)],
//   ['required_posting_auths', ArraySerializer(StringSerializer)],
//   ['required_auths', ArraySerializer(AuthoritySerializer)],
//   ['id', StringSerializer],
//   ['data', VariableBinarySerializer]
// ])

OperationSerializers.custom_json = OperationDataSerializer(OPERATION_IDS.custom_json, [
  ['required_auths', ArraySerializer(StringSerializer)],
  ['required_posting_auths', ArraySerializer(StringSerializer)],
  ['id', StringSerializer],
  ['json', StringSerializer]
])

OperationSerializers.decline_voting_rights = OperationDataSerializer(
  OPERATION_IDS.decline_voting_rights,
  [
    ['account', StringSerializer],
    ['decline', BooleanSerializer]
  ]
)

OperationSerializers.delegate_vesting_shares = OperationDataSerializer(
  OPERATION_IDS.delegate_vesting_shares,
  [
    ['delegator', StringSerializer],
    ['delegatee', StringSerializer],
    ['vesting_shares', AssetSerializer]
  ]
)

OperationSerializers.delete_comment = OperationDataSerializer(OPERATION_IDS.delete_comment, [
  ['author', StringSerializer],
  ['permlink', StringSerializer]
])

OperationSerializers.escrow_approve = OperationDataSerializer(OPERATION_IDS.escrow_approve, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['agent', StringSerializer],
  ['who', StringSerializer],
  ['escrow_id', UInt32Serializer],
  ['approve', BooleanSerializer]
])

OperationSerializers.escrow_dispute = OperationDataSerializer(OPERATION_IDS.escrow_dispute, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['agent', StringSerializer],
  ['who', StringSerializer],
  ['escrow_id', UInt32Serializer]
])

OperationSerializers.escrow_release = OperationDataSerializer(OPERATION_IDS.escrow_release, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['agent', StringSerializer],
  ['who', StringSerializer],
  ['receiver', StringSerializer],
  ['escrow_id', UInt32Serializer],
  ['hbd_amount', AssetSerializer],
  ['hive_amount', AssetSerializer]
])

OperationSerializers.escrow_transfer = OperationDataSerializer(OPERATION_IDS.escrow_transfer, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['hbd_amount', AssetSerializer],
  ['hive_amount', AssetSerializer],
  ['escrow_id', UInt32Serializer],
  ['agent', StringSerializer],
  ['fee', AssetSerializer],
  ['json_meta', StringSerializer],
  ['ratification_deadline', DateSerializer],
  ['escrow_expiration', DateSerializer]
])

OperationSerializers.feed_publish = OperationDataSerializer(OPERATION_IDS.feed_publish, [
  ['publisher', StringSerializer],
  ['exchange_rate', PriceSerializer]
])

OperationSerializers.limit_order_cancel = OperationDataSerializer(
  OPERATION_IDS.limit_order_cancel,
  [
    ['owner', StringSerializer],
    ['orderid', UInt32Serializer]
  ]
)

OperationSerializers.limit_order_create = OperationDataSerializer(
  OPERATION_IDS.limit_order_create,
  [
    ['owner', StringSerializer],
    ['orderid', UInt32Serializer],
    ['amount_to_sell', AssetSerializer],
    ['min_to_receive', AssetSerializer],
    ['fill_or_kill', BooleanSerializer],
    ['expiration', DateSerializer]
  ]
)

OperationSerializers.limit_order_create2 = OperationDataSerializer(
  OPERATION_IDS.limit_order_create2,
  [
    ['owner', StringSerializer],
    ['orderid', UInt32Serializer],
    ['amount_to_sell', AssetSerializer],
    ['exchange_rate', PriceSerializer],
    ['fill_or_kill', BooleanSerializer],
    ['expiration', DateSerializer]
  ]
)

OperationSerializers.recover_account = OperationDataSerializer(OPERATION_IDS.recover_account, [
  ['account_to_recover', StringSerializer],
  ['new_owner_authority', AuthoritySerializer],
  ['recent_owner_authority', AuthoritySerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

// Not used on chain
// OperationSerializers.report_over_production = OperationDataSerializer(
//   OPERATION_IDS.report_over_production,
//   [
//     ['reporter', StringSerializer],
//     ['first_block', SignedBlockHeaderSerializer],
//     ['second_block', SignedBlockHeaderSerializer]
//   ]
// )

OperationSerializers.request_account_recovery = OperationDataSerializer(
  OPERATION_IDS.request_account_recovery,
  [
    ['recovery_account', StringSerializer],
    ['account_to_recover', StringSerializer],
    ['new_owner_authority', AuthoritySerializer],
    ['extensions', ArraySerializer(VoidSerializer)]
  ]
)

OperationSerializers.reset_account = OperationDataSerializer(OPERATION_IDS.reset_account, [
  ['reset_account', StringSerializer],
  ['account_to_reset', StringSerializer],
  ['new_owner_authority', AuthoritySerializer]
])

OperationSerializers.set_reset_account = OperationDataSerializer(OPERATION_IDS.set_reset_account, [
  ['account', StringSerializer],
  ['current_reset_account', StringSerializer],
  ['reset_account', StringSerializer]
])

OperationSerializers.set_withdraw_vesting_route = OperationDataSerializer(
  OPERATION_IDS.set_withdraw_vesting_route,
  [
    ['from_account', StringSerializer],
    ['to_account', StringSerializer],
    ['percent', UInt16Serializer],
    ['auto_vest', BooleanSerializer]
  ]
)

OperationSerializers.transfer = OperationDataSerializer(OPERATION_IDS.transfer, [
  ['from', StringSerializer],
  ['to', StringSerializer],
  ['amount', AssetSerializer],
  ['memo', StringSerializer]
])

OperationSerializers.transfer_from_savings = OperationDataSerializer(
  OPERATION_IDS.transfer_from_savings,
  [
    ['from', StringSerializer],
    ['request_id', UInt32Serializer],
    ['to', StringSerializer],
    ['amount', AssetSerializer],
    ['memo', StringSerializer]
  ]
)

OperationSerializers.transfer_to_savings = OperationDataSerializer(
  OPERATION_IDS.transfer_to_savings,
  [
    ['from', StringSerializer],
    ['to', StringSerializer],
    ['amount', AssetSerializer],
    ['memo', StringSerializer]
  ]
)

OperationSerializers.transfer_to_vesting = OperationDataSerializer(
  OPERATION_IDS.transfer_to_vesting,
  [
    ['from', StringSerializer],
    ['to', StringSerializer],
    ['amount', AssetSerializer]
  ]
)

OperationSerializers.vote = OperationDataSerializer(OPERATION_IDS.vote, [
  ['voter', StringSerializer],
  ['author', StringSerializer],
  ['permlink', StringSerializer],
  ['weight', Int16Serializer]
])

OperationSerializers.withdraw_vesting = OperationDataSerializer(OPERATION_IDS.withdraw_vesting, [
  ['account', StringSerializer],
  ['vesting_shares', AssetSerializer]
])

OperationSerializers.witness_update = OperationDataSerializer(OPERATION_IDS.witness_update, [
  ['owner', StringSerializer],
  ['url', StringSerializer],
  ['block_signing_key', PublicKeySerializer],
  ['props', ChainPropertiesSerializer],
  ['fee', AssetSerializer]
])

OperationSerializers.witness_set_properties = OperationDataSerializer(
  OPERATION_IDS.witness_set_properties,
  [
    ['owner', StringSerializer],
    ['props', FlatMapSerializer(StringSerializer, VariableBinarySerializer)],
    ['extensions', ArraySerializer(VoidSerializer)]
  ]
)

OperationSerializers.account_update2 = OperationDataSerializer(OPERATION_IDS.account_update2, [
  ['account', StringSerializer],
  ['owner', OptionalSerializer(AuthoritySerializer)],
  ['active', OptionalSerializer(AuthoritySerializer)],
  ['posting', OptionalSerializer(AuthoritySerializer)],
  ['memo_key', OptionalSerializer(PublicKeySerializer)],
  ['json_metadata', StringSerializer],
  ['posting_json_metadata', StringSerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.create_proposal = OperationDataSerializer(OPERATION_IDS.create_proposal, [
  ['creator', StringSerializer],
  ['receiver', StringSerializer],
  ['start_date', DateSerializer],
  ['end_date', DateSerializer],
  ['daily_pay', AssetSerializer],
  ['subject', StringSerializer],
  ['permlink', StringSerializer],
  ['extensions', ArraySerializer(VoidSerializer)]
])

OperationSerializers.update_proposal_votes = OperationDataSerializer(
  OPERATION_IDS.update_proposal_votes,
  [
    ['voter', StringSerializer],
    ['proposal_ids', ArraySerializer(Int64Serializer)],
    ['approve', BooleanSerializer],
    ['extensions', ArraySerializer(VoidSerializer)]
  ]
)

OperationSerializers.remove_proposal = OperationDataSerializer(OPERATION_IDS.remove_proposal, [
  ['proposal_owner', StringSerializer],
  ['proposal_ids', ArraySerializer(Int64Serializer)],
  ['extensions', ArraySerializer(VoidSerializer)]
])

const ProposalUpdateSerializer = ObjectSerializer([['end_date', DateSerializer]])

OperationSerializers.update_proposal = OperationDataSerializer(OPERATION_IDS.update_proposal, [
  ['proposal_id', UInt64Serializer],
  ['creator', StringSerializer],
  ['daily_pay', AssetSerializer],
  ['subject', StringSerializer],
  ['permlink', StringSerializer],
  [
    'extensions',
    ArraySerializer(StaticVariantSerializer([VoidSerializer, ProposalUpdateSerializer]))
  ]
])

OperationSerializers.collateralized_convert = OperationDataSerializer(
  OPERATION_IDS.collateralized_convert,
  [
    ['owner', StringSerializer],
    ['requestid', UInt32Serializer],
    ['amount', AssetSerializer]
  ]
)

OperationSerializers.recurrent_transfer = OperationDataSerializer(
  OPERATION_IDS.recurrent_transfer,
  [
    ['from', StringSerializer],
    ['to', StringSerializer],
    ['amount', AssetSerializer],
    ['memo', StringSerializer],
    ['recurrence', UInt16Serializer],
    ['executions', UInt16Serializer],
    [
      'extensions',
      ArraySerializer(
        ObjectSerializer([
          ['type', UInt8Serializer],
          ['value', ObjectSerializer([['pair_id', UInt8Serializer]])]
        ])
      )
    ]
  ]
)

const OperationSerializer = (buffer: ByteBuffer, operation: Operation) => {
  const serializer = OperationSerializers[operation[0]]
  if (!serializer) {
    throw new Error(`No serializer for operation: ${operation[0]}`)
  }
  try {
    serializer(buffer, operation[1])
  } catch (error: any) {
    error.message = `${operation[0]}: ${error.message}`
    throw error
  }
}

const TransactionSerializer = ObjectSerializer([
  ['ref_block_num', UInt16Serializer],
  ['ref_block_prefix', UInt32Serializer],
  ['expiration', DateSerializer],
  ['operations', ArraySerializer(OperationSerializer)],
  ['extensions', ArraySerializer(StringSerializer)]
])

const EncryptedMemoSerializer = ObjectSerializer([
  ['from', PublicKeySerializer],
  ['to', PublicKeySerializer],
  ['nonce', UInt64Serializer],
  ['check', UInt32Serializer],
  ['encrypted', BinarySerializer()]
])

export const Serializer = {
  // Array: ArraySerializer,
  Asset: AssetSerializer,
  // Authority: AuthoritySerializer,
  // Binary: BinarySerializer,
  // Boolean: BooleanSerializer,
  // Date: DateSerializer,
  // FlatMap: FlatMapSerializer,
  // Int16: Int16Serializer,
  // Int32: Int32Serializer,
  // Int64: Int64Serializer,
  // Int8: Int8Serializer,
  Memo: EncryptedMemoSerializer,
  // Object: ObjectSerializer,
  // Operation: OperationSerializer,
  // Optional: OptionalSerializer,
  Price: PriceSerializer,
  PublicKey: PublicKeySerializer,
  // StaticVariant: StaticVariantSerializer,
  String: StringSerializer,
  Transaction: TransactionSerializer,
  UInt16: UInt16Serializer,
  UInt32: UInt32Serializer
  // UInt64: UInt64Serializer,
  // UInt8: UInt8Serializer,
  // Void: VoidSerializer
}
