import bs58 from 'bs58'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { sha256, sha512 } from '@noble/hashes/sha2.js'
import { PublicKey } from './PublicKey.js'
import { Signature } from './Signature.js'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js'

export type KeyRole = 'owner' | 'active' | 'posting' | 'memo'

const NETWORK_ID = new Uint8Array([0x80])

/**
 * ECDSA (secp256k1) private key for signing and encryption operations.
 * Handles key generation, derivation from seeds/passwords, and cryptographic operations.
 *
 * All private keys are stored internally as Uint8Array and can be converted to/from
 * Wallet Import Format (WIF) strings for storage and transmission.
 *
 * @example
 * ```typescript
 * // From WIF string
 * const key = PrivateKey.from('5JdeC9P7Pbd1uGdFVEsJ41EkEnADbbHGq6p1BwFxm6txNBsQnsw')
 *
 * // Generate random key
 * const randomKey = PrivateKey.randomKey()
 *
 * // From username and password
 * const loginKey = PrivateKey.fromLogin('username', 'password')
 *
 * // Sign a message
 * const signature = key.sign(someHash)
 *
 * // Get public key
 * const pubKey = key.createPublic()
 * ```
 */
export class PrivateKey {
  key: Uint8Array

  constructor(key: Uint8Array) {
    this.key = key
    try {
      secp256k1.getPublicKey(key)
    } catch (e) {
      throw new Error('invalid private key')
    }
  }

  /**
   * Creates a PrivateKey instance from a WIF string or raw Uint8Array.
   * Automatically detects the input type and uses the appropriate method.
   *
   * @param value - WIF formatted string or raw 32-byte key as Uint8Array
   * @returns New PrivateKey instance
   * @throws Error if the key format is invalid
   */
  static from(value: string | Uint8Array): PrivateKey {
    if (typeof value === 'string') {
      return PrivateKey.fromString(value)
    } else {
      return new PrivateKey(value)
    }
  }

  /**
   * Creates a PrivateKey from a Wallet Import Format (WIF) encoded string.
   *
   * @param wif - WIF encoded private key string
   * @returns New PrivateKey instance
   * @throws Error if WIF format is invalid or checksum fails
   */
  static fromString(wif: string): PrivateKey {
    return new PrivateKey(decodePrivate(wif).subarray(1))
  }

  /**
   * Creates a PrivateKey from a seed string or Uint8Array.
   * The seed is hashed with SHA256 to produce the private key.
   *
   * @param seed - Seed string (converted to bytes) or raw byte array
   * @returns New PrivateKey instance derived from seed
   */
  static fromSeed(seed: string | Uint8Array): PrivateKey {
    if (typeof seed === 'string') {
      const isHex = /^[0-9a-fA-F]+$/.test(seed)
      if (isHex) {
        seed = hexToBytes(seed)
      } else {
        // Convert non-hex string to Uint8Array using UTF-8 encoding
        seed = new TextEncoder().encode(seed)
      }
    }
    return new PrivateKey(sha256(seed))
  }

  /**
   * Derives a PrivateKey from username, password, and role using Hive's key derivation scheme.
   * This generates the same keys that the Hive wallet uses for login-based keys.
   *
   * @param username - Hive username
   * @param password - Master password (or seed phrase)
   * @param role - Key role ('owner', 'active', 'posting', 'memo')
   * @returns New PrivateKey instance for the specified role
   */
  static fromLogin(username: string, password: string, role: KeyRole = 'active'): PrivateKey {
    const seed = username + role + password
    return PrivateKey.fromSeed(seed)
  }

  /**
   * Signs a 32-byte message hash using ECDSA and returns a recoverable signature.
   * The signature includes recovery information to allow public key recovery.
   *
   * @param message - 32-byte message hash to sign (Uint8Array)
   * @returns Signature object containing the signature data
   */
  sign(message: Uint8Array): Signature {
    const rv = secp256k1.sign(message, this.key, {
      extraEntropy: true,
      format: 'recovered',
      prehash: false // prehash does sha256 on the message
    })
    const recovery = parseInt(bytesToHex(rv.subarray(0, 1)), 16)
    return Signature.from((recovery + 31).toString(16) + bytesToHex(rv.subarray(1)))
  }

  /**
   * Derives the corresponding public key for this private key.
   *
   * @param prefix - Optional address prefix (defaults to config.address_prefix)
   * @returns PublicKey instance derived from this private key
   */
  createPublic(prefix?: string): PublicKey {
    return new PublicKey(secp256k1.getPublicKey(this.key), prefix)
  }

  /**
   * Returns the private key as a Wallet Import Format (WIF) encoded string.
   * This includes network ID and checksum for safe storage/transmission.
   *
   * @returns WIF encoded private key string
   */
  toString(): string {
    return encodePrivate(new Uint8Array([...NETWORK_ID, ...this.key]))
  }

  /**
   * Returns a masked representation of the private key for debugging/logging.
   * Shows only the first and last 6 characters to avoid accidental exposure.
   * Use toString() to get the full key for export/serialization.
   *
   * @returns Masked key representation for safe logging
   */
  inspect(): string {
    const key = this.toString()
    return `PrivateKey: ${key.slice(0, 6)}...${key.slice(-6)}`
  }

  /**
   * Computes a shared secret using ECDH key exchange for memo encryption.
   * The shared secret is used as a key for AES encryption/decryption.
   *
   * @param publicKey - Other party's public key
   * @returns 64-byte shared secret as Uint8Array
   */
  getSharedSecret(publicKey: PublicKey): Uint8Array {
    const s = secp256k1.getSharedSecret(this.key, publicKey.key)
    // strip the parity byte
    return sha512(s.subarray(1))
  }

  /**
   * Generates a new cryptographically secure random private key.
   * Uses the secp256k1 key generation algorithm for security.
   * This method may take up to 250ms due to entropy collection.
   *
   * @returns New randomly generated PrivateKey instance
   */
  static randomKey(): PrivateKey {
    return new PrivateKey(secp256k1.keygen().secretKey)
  }
}

const doubleSha256 = (input: Uint8Array) => {
  const dbl = sha256(sha256(input))
  return dbl
}

/** Encode bs58+doubleSha256-checksum private key. */
const encodePrivate = (key: Uint8Array) => {
  // assert.equal(key.readUInt8(0), 0x80, 'private key network id mismatch')
  const checksum = doubleSha256(key)
  return bs58.encode(new Uint8Array([...key, ...checksum.slice(0, 4)]))
}

/** Decode bs58+doubleSha256-checksum encoded private key. */
const decodePrivate = (encodedKey: string) => {
  const buffer = bs58.decode(encodedKey)
  if (!isUint8ArrayEqual(buffer.slice(0, 1), NETWORK_ID)) {
    throw new Error('Private key network id mismatch')
  }
  const checksum = buffer.slice(-4)
  const key = buffer.slice(0, -4)
  const checksumVerify = doubleSha256(key).slice(0, 4)
  if (!isUint8ArrayEqual(checksum, checksumVerify)) {
    throw new Error('Private key checksum mismatch')
  }
  return key
}

const isUint8ArrayEqual = (a: Uint8Array, b: Uint8Array) => {
  if (a === b) return true
  if (a.byteLength !== b.byteLength) return false
  const len = a.byteLength
  let i = 0
  while (i < len && a[i] === b[i]) i++
  return i === len
}
