import { secp256k1 } from '@noble/curves/secp256k1.js'
import { config } from '../config.js'
import { Authority } from '../types.js'
import { KeyRole, PrivateKey } from './PrivateKey.js'
import { PublicKey } from './PublicKey.js'

const ROLES: KeyRole[] = ['owner', 'active', 'posting', 'memo']

/** A random master password in the format Hive wallets use ("P5..."); store it safely */
export const createPassword = (): string => 'P' + PrivateKey.randomKey().toString()

/**
 * Derives an account's keys from its master password, the same way Hive wallets do.
 * Returns the private keys to give the user, the public keys, and the `owner`, `active`,
 * `posting`, and `memo_key` fields for `create_claimed_account`, `account_create`, or `account_update`.
 */
export const generateKeys = (username: string, password: string) => {
  const privateKeys = {} as Record<KeyRole, string>
  const publicKeys = {} as Record<KeyRole, string>
  for (const role of ROLES) {
    const key = PrivateKey.fromLogin(username, password, role)
    privateKeys[role] = key.toString()
    publicKeys[role] = key.createPublic().toString()
  }
  const authority = (key: string): Authority => ({
    weight_threshold: 1,
    account_auths: [],
    key_auths: [[key, 1]]
  })
  return {
    privateKeys,
    publicKeys,
    owner: authority(publicKeys.owner),
    active: authority(publicKeys.active),
    posting: authority(publicKeys.posting),
    memo_key: publicKeys.memo
  }
}

/** True if `wif` is a valid private key (checks format and checksum) */
export const isValidWif = (wif: string): boolean => {
  try {
    PrivateKey.fromString(wif)
    return true
  } catch {
    return false
  }
}

/** True if `key` is a valid public key for this chain (checks prefix, checksum, and curve point) */
export const isValidPublicKey = (key: string): boolean => {
  try {
    const publicKey = PublicKey.fromString(key)
    secp256k1.Point.fromBytes(publicKey.key)
    // Re-encoding recomputes the checksum, so a mismatch means a corrupted key
    return key.startsWith(config.address_prefix) && publicKey.toString() === key
  } catch {
    return false
  }
}
