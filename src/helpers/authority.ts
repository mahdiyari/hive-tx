import { AccountUpdate2Operation, Authority } from '../types.js'
import { fetchAccount } from './cachedRPC.js'

/** Account fields used for authorities, from `get_accounts` or `find_accounts` */
export interface AuthorityAccount {
  name: string
  owner: Authority
  active: Authority
  posting: Authority
  memo_key: string
}

/** Authorities an app can be given; owner is left out on purpose */
export type AppRole = 'posting' | 'active'

/** True if `app` can sign for `account` with `role` on its own: its weight meets the threshold */
export const hasAccountAuthority = async (
  account: string | AuthorityAccount,
  app: string,
  role: AppRole = 'posting'
): Promise<boolean> => {
  const authority = (await fetchAccount(account))[role]
  return authority.account_auths.some(
    ([name, weight]) => name === app && weight >= authority.weight_threshold
  )
}

/**
 * Builds the `account_update2` that lets `app` sign for `account` with `role`.
 * `weight` defaults to the threshold, so the app can sign alone. Sign it with the active key.
 */
export const grantAccountAuthority = async (
  account: string | AuthorityAccount,
  app: string,
  role: AppRole = 'posting',
  weight?: number
) => {
  const acc = await fetchAccount(account)
  const authority = acc[role]
  const others = authority.account_auths.filter(([name]) => name !== app)
  return updateAuthority(acc.name, role, {
    ...authority,
    account_auths: [...others, [app, weight ?? authority.weight_threshold]]
  })
}

/**
 * Builds the `account_update2` that removes `app` from the `role` authority of `account`.
 * Throws if the remaining weights could no longer reach the threshold. Sign it with the active key.
 */
export const revokeAccountAuthority = async (
  account: string | AuthorityAccount,
  app: string,
  role: AppRole = 'posting'
) => {
  const acc = await fetchAccount(account)
  const authority = acc[role]
  const account_auths = authority.account_auths.filter(([name]) => name !== app)
  const total = [...account_auths, ...authority.key_auths].reduce((sum, [, w]) => sum + w, 0)
  if (total < authority.weight_threshold) {
    throw new Error(
      `Removing ${app} would leave the ${role} authority of ${acc.name} unable to sign`
    )
  }
  return updateAuthority(acc.name, role, { ...authority, account_auths })
}

const updateAuthority = (
  account: string,
  role: AppRole,
  authority: Authority
): ['account_update2', AccountUpdate2Operation] => {
  // Sorted as the chain stores it, so signers that keep the given order sign the same bytes
  authority.account_auths.sort(([a], [b]) => (a < b ? -1 : 1))
  // Empty metadata strings leave the account's metadata unchanged
  return [
    'account_update2',
    { account, [role]: authority, json_metadata: '', posting_json_metadata: '', extensions: [] }
  ]
}
