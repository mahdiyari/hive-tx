import bs58 from 'bs58'
import { ByteBuffer } from './ByteBuffer.js'
import { Serializer } from './serializer.js'
import { PrivateKey } from './PrivateKey.js'
import * as Aes from './aes.js'
import { PublicKey } from './PublicKey.js'
import { Deserializer } from './deserializer.js'

export type Memo = {
  /**
   * Encrypts a memo for secure private messaging
   */
  encode(
    privateKey: string | PrivateKey,
    publicKey: string | PublicKey,
    memo: string,
    testNonce?: any
  ): string

  /**
   * Decrypts a memo message
   */
  decode(privateKey: string | PrivateKey, memo: string): string
}

/**
 * Encodes a memo using AES encryption for secure private messaging on Hive.
 * Messages must start with '#' to be encrypted. Plain text messages are returned unchanged.
 *
 * @param privateKey - Sender's private memo key (string WIF format or PrivateKey instance)
 * @param publicKey - Recipient's public memo key (string or PublicKey instance)
 * @param memo - Message to encrypt (must start with '#' for encryption)
 * @param testNonce - Optional nonce for testing (advanced usage)
 * @returns Encrypted memo string prefixed with '#'
 * @throws Error if encryption is not supported in current environment
 */
const encode = (
  privateKey: string | PrivateKey,
  publicKey: string | PublicKey,
  memo: string,
  testNonce?: any
): string => {
  if (!memo.startsWith('#')) {
    return memo
  }
  memo = memo.substring(1)
  checkEncryption()
  privateKey = toPrivateObj(privateKey)
  publicKey = toPublicObj(publicKey)
  const mbuf = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
  mbuf.writeVString(memo)
  const memoBuffer = new Uint8Array(mbuf.copy(0, mbuf.offset).toBuffer())
  const { nonce, message, checksum } = Aes.encrypt(privateKey, publicKey, memoBuffer, testNonce)
  const mbuf2 = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
  Serializer.Memo(mbuf2, {
    check: checksum,
    encrypted: message,
    from: privateKey.createPublic(),
    nonce,
    to: publicKey
  })
  mbuf2.flip()
  const data = new Uint8Array(mbuf2.toBuffer())
  return '#' + bs58.encode(data)
}

/**
 * Decrypts an encrypted memo using AES decryption.
 * Messages must start with '#' to be decrypted. Plain text messages are returned unchanged.
 *
 * @param privateKey - Recipient's private memo key (string WIF format or PrivateKey instance)
 * @param memo - Encrypted memo string (must start with '#' for decryption)
 * @returns Decrypted memo content with '#' prefix
 * @throws Error if decryption fails or encryption not supported in current environment
 */
const decode = (privateKey: string | PrivateKey, memo: string): string => {
  if (!memo.startsWith('#')) {
    return memo
  }
  memo = memo.substring(1)
  checkEncryption()
  privateKey = toPrivateObj(privateKey)
  // memo = bs58.decode(memo)
  let memoBuffer = Deserializer.Memo(bs58.decode(memo))
  const { from, to, nonce, check, encrypted } = memoBuffer
  const pubkey = privateKey.createPublic().toString()
  const otherpub =
    pubkey === new PublicKey(from.key).toString() ? new PublicKey(to.key) : new PublicKey(from.key)
  memoBuffer = Aes.decrypt(privateKey, otherpub, nonce, encrypted, check)
  const mbuf = new ByteBuffer(ByteBuffer.DEFAULT_CAPACITY, ByteBuffer.LITTLE_ENDIAN)
  mbuf.append(memoBuffer)
  mbuf.flip()
  return '#' + mbuf.readVString()
}

let encodeTest: boolean | undefined
const checkEncryption = () => {
  if (encodeTest === undefined) {
    let plaintext
    encodeTest = true // prevent infinate looping
    try {
      const wif = '5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw'
      const pubkey = 'STM8m5UgaFAAYQRuaNejYdS8FVLVp9Ss3K1qAVk5de6F8s3HnVbvA'
      const cyphertext = encode(wif, pubkey, '#memo爱')
      plaintext = decode(wif, cyphertext)
    } finally {
      encodeTest = plaintext === '#memo爱'
    }
  }
  if (encodeTest === false) {
    throw new Error('This environment does not support encryption.')
  }
}

const toPrivateObj = (o: string | PrivateKey): PrivateKey => {
  if (typeof o === 'string') {
    return PrivateKey.fromString(o)
  } else {
    return o
  }
}
const toPublicObj = (o: string | PublicKey): PublicKey => {
  if (typeof o === 'string') {
    return PublicKey.fromString(o)
  } else {
    return o
  }
}

/**
 * Memo utilities for encrypting and decrypting private messages between Hive users.
 * Uses AES encryption with ECDH key exchange for secure communication.
 *
 * Messages must start with '#' to be encrypted/decrypted.
 * Plain text messages (without '#') are returned unchanged.
 *
 * @example
 * ```typescript
 * import { Memo, PrivateKey, PublicKey } from 'hive-tx'
 *
 * // Encrypt a message
 * const encrypted = Memo.encode(senderPrivateKey, recipientPublicKey, '#Hello World')
 *
 * // Decrypt a message
 * const decrypted = Memo.decode(recipientPrivateKey, encrypted)
 * console.log(decrypted) // '#Hello World'
 * ```
 */
export const Memo = {
  decode,
  encode
}
