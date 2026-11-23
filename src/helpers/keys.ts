import { secp256k1 } from '@noble/curves/secp256k1.js'
import { sha256 } from '@noble/hashes/sha2.js'
import { utf8ToBytes } from '@noble/hashes/utils.js'
import { config } from '../config.js'
import { Authority } from '../types.js'
import type { AppRole, AuthorityAccount } from './authority.js'
import { fetchAccount } from './cachedRPC.js'
import { KeyRole, PrivateKey } from './PrivateKey.js'
import { PublicKey } from './PublicKey.js'
import { Signature } from './Signature.js'

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

/** True if `key` alone meets the authority's threshold */
const signsAlone = (authority: Authority, key: string) =>
  authority.key_auths.some(
    ([k, weight]) => String(k) === key && weight >= authority.weight_threshold
  )

/**
 * The strongest role `publicKey` can sign alone for `account` (owner, active, posting), else
 * `'memo'` if it is the memo key, else null. Use it to log in with a key or a master password.
 */
export const getKeyRole = async (
  account: string | AuthorityAccount,
  publicKey: string | PublicKey
): Promise<KeyRole | null> => {
  const acc = await fetchAccount(account)
  const key = String(publicKey)
  for (const role of ['owner', 'active', 'posting'] as const) {
    if (signsAlone(acc[role], key)) return role
  }
  return acc.memo_key === key ? 'memo' : null
}

/**
 * Signs the SHA-256 of a UTF-8 message, as Hive Keychain's `requestSignBuffer` does.
 * Returns the signature as 130 hex characters.
 */
export const signMessage = (message: string, privateKey: PrivateKey): string =>
  privateKey.sign(sha256(utf8ToBytes(message))).customToString()

const IMAGE_CHALLENGE = utf8ToBytes('ImageSigningChallenge')

/**
 * Signs an image for upload to an imagehoster such as images.hive.blog: the SHA-256 of
 * `ImageSigningChallenge` followed by the file bytes. Upload the file as the `file` form field
 * to `POST https://images.hive.blog/<username>/<signature>`. Use the account's posting key.
 */
export const signImage = (image: Uint8Array, privateKey: PrivateKey): string =>
  privateKey.sign(sha256.create().update(IMAGE_CHALLENGE).update(image).digest()).customToString()

/**
 * True if `signature` signs `message` with a key that can sign alone for the `role` authority
 * of `account`. Checks signatures from `signMessage`, Hive Keychain `requestSignBuffer`, and
 * Hivesigner. Keep the message on your server; do not trust a copy sent back by the client.
 */
export const verifyMessage = async (
  account: string | AuthorityAccount,
  message: string,
  signature: string,
  role: AppRole = 'posting'
): Promise<boolean> => {
  let key: string
  try {
    const hash = sha256(utf8ToBytes(message))
    key = Signature.from(signature.replace(/^0x/, '')).getPublicKey(hash).toString()
  } catch {
    return false // not a valid signature
  }
  return signsAlone((await fetchAccount(account))[role], key)
}
