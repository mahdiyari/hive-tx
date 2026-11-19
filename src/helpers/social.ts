import { CustomJsonOperation } from '../types.js'

/**
 * Builders for the social and RC `custom_json` operations.
 * Each returns an operation to pass to `addOperation`:
 * `await tx.addOperation(...utils.follow('alice', 'bob'))`
 */

type CustomJson = ['custom_json', CustomJsonOperation]

const customJson = (id: string, account: string, json: unknown): CustomJson => [
  'custom_json',
  { required_auths: [], required_posting_auths: [account], id, json: JSON.stringify(json) }
]

const followState = (follower: string, following: string, what: string[]) =>
  customJson('follow', follower, ['follow', { follower, following, what }])

/** `follower` follows `following` */
export const follow = (follower: string, following: string) =>
  followState(follower, following, ['blog'])

/** `follower` stops following `following` */
export const unfollow = (follower: string, following: string) =>
  followState(follower, following, [])

/** `follower` mutes `following` */
export const mute = (follower: string, following: string) =>
  followState(follower, following, ['ignore'])

/** `follower` unmutes `following` (same operation as unfollow: both clear the state) */
export const unmute = (follower: string, following: string) => followState(follower, following, [])

/** `follower` blacklists (blocks) `following`: their posts are marked "my blacklist" */
export const blacklist = (follower: string, following: string) =>
  followState(follower, following, ['blacklist'])

/** `follower` removes `following` from their blacklist (unfollow does not clear a blacklist) */
export const unblacklist = (follower: string, following: string) =>
  followState(follower, following, ['unblacklist'])

/** `follower` adopts the blacklist of `following` */
export const followBlacklist = (follower: string, following: string) =>
  followState(follower, following, ['follow_blacklist'])

/** `follower` stops using the blacklist of `following` */
export const unfollowBlacklist = (follower: string, following: string) =>
  followState(follower, following, ['unfollow_blacklist'])

/** `follower` adopts the mute list of `following` */
export const followMuted = (follower: string, following: string) =>
  followState(follower, following, ['follow_muted'])

/** `follower` stops using the mute list of `following` */
export const unfollowMuted = (follower: string, following: string) =>
  followState(follower, following, ['unfollow_muted'])

/** `account` reblogs the post `author/permlink` */
export const reblog = (account: string, author: string, permlink: string) =>
  customJson('follow', account, ['reblog', { account, author, permlink }])

/** `account` subscribes to a community, e.g. `"hive-123456"` */
export const subscribe = (account: string, community: string) =>
  customJson('community', account, ['subscribe', { community }])

/** `account` unsubscribes from a community */
export const unsubscribe = (account: string, community: string) =>
  customJson('community', account, ['unsubscribe', { community }])

/** `from` delegates `maxRc` resource credits to each delegatee; 0 removes the delegation */
export const delegateRC = (from: string, delegatees: string[], maxRc: number) =>
  customJson('rc', from, ['delegate_rc', { from, delegatees, max_rc: maxRc, extensions: [] }])
