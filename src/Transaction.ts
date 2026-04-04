import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js'
import { PrivateKey } from './helpers/PrivateKey'
import {
  OperationName,
  OperationBody,
  TransactionType,
  TransactionStatus,
  BroadcastResult
} from './types'
import { ByteBuffer } from './helpers/ByteBuffer'
import { Serializer } from './helpers/serializer'
import { sha256 } from '@noble/hashes/sha2.js'
import { config } from './config'
import { callRPC, callRPCBroadcast, RPCError } from './helpers/call'
import { DigestData } from './types'
import { sleep } from './helpers/sleep'

const chainId = hexToBytes(config.chain_id)

interface TransactionOptions {
  transaction?: TransactionType | Transaction
  /**
   * Transaction expiration in milliseconds (ms) - max 86400000 (24 hours)
   * @default 60_000
   */
  expiration?: number
}

export class Transaction {
  transaction?: TransactionType

  expiration: number = 60_000

  private txId?: string

  constructor(options?: TransactionOptions) {
    if (options?.transaction) {
      if (options.transaction instanceof Transaction) {
        this.transaction = options.transaction.transaction
        this.expiration = options.transaction.expiration
      } else {
        this.transaction = options.transaction
      }
      this.txId = this.digest().txId
    }
    if (options?.expiration) {
      this.expiration = options.expiration
    }
  }

  /**
   * Adds an operation to the transaction. If no transaction exists, creates one first.
   * @template O Operation name type for type safety
   * @param operationName The name/type of the operation to add (e.g., 'transfer', 'vote', 'comment')
   * @param operationBody The operation data/body for the specified operation type
   * @returns Promise that resolves when the operation is added
   * @throws Error if transaction creation fails or global properties cannot be retrieved
   */
  async addOperation<O extends OperationName>(
    operationName: O,
    operationBody: OperationBody<O>
  ): Promise<void> {
    if (!this.transaction) {
      await this.createTransaction(this.expiration)
    }
    this.transaction!.operations.push([operationName, operationBody])
  }

  /**
   * Signs the transaction with the provided key(s), supporting both single and multi-signature transactions.
   * For multi-signature, you can sign with all keys at once or sign individually by calling this method multiple times.
   * @param keys Single PrivateKey or array of PrivateKeys to sign the transaction with
   * @returns The signed transaction
   * @throws Error if no transaction exists to sign
   */
  sign(keys: PrivateKey | PrivateKey[]): TransactionType {
    if (!this.transaction) {
      throw new Error('First create a transaction by .addOperation()')
    }
    if (this.transaction) {
      const { digest, txId } = this.digest()
      if (!Array.isArray(keys)) {
        keys = [keys]
      }
      for (const key of keys) {
        const signature = key.sign(digest)
        this.transaction.signatures.push(signature.customToString())
      }
      this.txId = txId
      return this.transaction
    } else {
      throw new Error('No transaction to sign')
    }
  }

  /**
   * Broadcasts the signed transaction to the Hive network.
   * Automatically handles retries and duplicate transaction detection.
   * @param checkStatus By default (false) the transaction is not guaranteed to be included in a block.
   * For example the transaction can expire while waiting in mempool.
   * If you pass true here, the function will wait for the transaction to be either included or dropped
   * before returning a result.
   * @returns Promise resolving to broadcast result
   * @throws Error if no transaction exists or transaction is not signed or transaction got rejected
   */
  async broadcast(checkStatus = false): Promise<BroadcastResult> {
    if (!this.transaction) {
      throw new Error(
        'Attempted to broadcast an empty transaction. Add operations by .addOperation()'
      )
    }
    if (this.transaction.signatures.length === 0) {
      throw new Error(
        'Attempted to broadcast a transaction with no signatures. Sign using .sign(keys)'
      )
    }
    try {
      await callRPCBroadcast('condenser_api.broadcast_transaction', [this.transaction])
    } catch (e) {
      if (e instanceof RPCError && e.message.includes('Duplicate transaction check failed')) {
        // ignore duplicate transaction error as this can happen when we retry the broadcast
      } else {
        throw e
      }
    }
    if (!this.txId) {
      this.txId = this.digest().txId
    }
    if (!checkStatus) {
      return { tx_id: this.txId, status: 'unknown' }
    }
    // Poll until the transaction reaches a final state or max attempts exceeded.
    // With 60 attempts: delays grow from 1.3s to 19s, total wait ~10 minutes.
    const maxPollAttempts = 60
    await sleep(1000)
    let status = await this.checkStatus()
    let i = 1
    while (
      status?.status !== 'within_irreversible_block' &&
      status?.status !== 'expired_irreversible' &&
      status?.status !== 'too_old' &&
      i < maxPollAttempts
    ) {
      await sleep(1000 + i * 300)
      status = await this.checkStatus()
      i++
    }
    return {
      tx_id: this.txId,
      status: (status?.status ?? 'unknown') as BroadcastResult['status']
    }
  }

  /**
   * Returns the transaction digest containing the transaction ID and hash.
   * The digest can be used to verify signatures and for transaction identification.
   * @returns DigestData containing transaction ID and hash
   * @throws Error if no transaction exists
   */
  digest(): DigestData {
    if (!this.transaction) {
      throw new Error('First create a transaction by .addOperation()')
    }
    const buffer = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
    const temp = { ...this.transaction }
    try {
      Serializer.Transaction(buffer, temp)
    } catch (cause) {
      throw new Error('Unable to serialize transaction: ' + cause)
    }
    buffer.flip()
    const transactionData = new Uint8Array(buffer.toBuffer())
    const txId = bytesToHex(sha256(transactionData)).slice(0, 40)
    const digest = sha256(new Uint8Array([...chainId, ...transactionData]))
    return { digest, txId }
  }

  /**
   * Adds a signature to an already created transaction. Useful when signing with external tools.
   * Multiple signatures can be added one at a time for multi-signature transactions.
   * @param signature The signature string in hex format (must be exactly 130 characters)
   * @returns The transaction with the added signature
   * @throws Error if no transaction exists or signature format is invalid
   */
  addSignature(signature: string): TransactionType {
    if (!this.transaction) {
      throw new Error('First create a transaction by .create(operations)')
    }
    if (typeof signature !== 'string') {
      throw new Error('Signature must be string')
    }
    if (signature.length !== 130) {
      throw new Error('Signature must be 130 characters long')
    }
    this.transaction.signatures.push(signature)
    return this.transaction
  }

  /** Get status of this transaction. Usually called internally after broadcasting. */
  async checkStatus(): Promise<TransactionStatus> {
    if (!this.txId) {
      this.txId = this.digest().txId
    }
    return callRPC('transaction_status_api.find_transaction', {
      transaction_id: this.txId,
      expiration: this.transaction?.expiration
    })
  }

  /**
   * Creates the transaction structure and initializes it with blockchain data.
   * Retrieves current head block information and sets up reference block data.
   * @private
   * @param expiration Transaction expiration in milliseconds
   */
  private createTransaction = async (expiration: number) => {
    const props = await callRPC('condenser_api.get_dynamic_global_properties', [])
    const bytes = hexToBytes(props.head_block_id)
    const refBlockPrefix = Number(new Uint32Array(bytes.buffer, bytes.byteOffset + 4, 1)[0])
    const expirationIso = new Date(Date.now() + expiration).toISOString().slice(0, -5)
    this.transaction = {
      expiration: expirationIso,
      extensions: [],
      operations: [],
      ref_block_num: props.head_block_number & 0xffff,
      ref_block_prefix: refBlockPrefix,
      signatures: []
    }
  }
}
