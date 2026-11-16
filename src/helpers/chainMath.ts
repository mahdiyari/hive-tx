/**
 * Stake, mana, vote, and reputation math. Inputs accept both API formats:
 * condenser_api (`"1.000 HIVE"`) and database_api/HAF (`{ amount, precision, nai }`).
 * Results are JavaScript numbers: exact enough for display and estimates, not for consensus.
 */

/** Asset as returned by condenser_api (`"1.000 HIVE"`) or by database_api (NAI object) */
export type AssetInput = string | { amount: string; precision: number; nai: string }

/** Manabar fields as returned by the API */
export interface ManabarInput {
  current_mana: number | string
  last_update_time: number
}

/** Account fields used for stake and mana, from `get_accounts` or `find_accounts` */
export interface StakeAccount {
  vesting_shares: AssetInput
  delegated_vesting_shares: AssetInput
  received_vesting_shares: AssetInput
  vesting_withdraw_rate: AssetInput
  to_withdraw: number | string
  withdrawn: number | string
  voting_manabar: ManabarInput
  downvote_manabar: ManabarInput
}

/** Account fields from `rc_api.find_rc_accounts` */
export interface RCAccount {
  max_rc: number | string
  rc_manabar: ManabarInput
}

/** Fields from `get_dynamic_global_properties` */
export interface VestingProps {
  total_vesting_fund_hive: AssetInput
  total_vesting_shares: AssetInput
}

/** Fields from `get_reward_fund('post')` */
export interface RewardFund {
  reward_balance: AssetInput
  recent_claims: number | string
}

/** HBD per HIVE, e.g. from `get_current_median_history_price` */
export interface Price {
  base: AssetInput
  quote: AssetInput
}

export interface Manabar {
  /** Current mana, regenerated to now */
  current: number
  max: number
  /** 0 to 100 */
  percentage: number
}

/** Mana regenerates from 0 to full in 5 days */
const MANA_REGEN_SECONDS = 432_000
/** dgp.downvote_pool_percent: downvote mana is 25% of voting mana since HF21 */
const DOWNVOTE_POOL = 0.25
/** dgp.vote_power_reserve_rate: a 100% vote uses 2% of max mana */
const VOTE_POWER_RESERVE_RATE = 10
/** Votes below this many rshares count as 0 */
const VOTE_DUST_THRESHOLD = 50_000_000

const NAI_SYMBOLS: Record<string, string> = {
  '@@000000021': 'HIVE',
  '@@000000013': 'HBD',
  '@@000000037': 'VESTS'
}

/** Parses `"1.000 HIVE"` or `{ amount: "1000", precision: 3, nai: "@@000000021" }` */
export const parseAsset = (asset: AssetInput): { amount: number; symbol: string } => {
  const parsed =
    typeof asset === 'string'
      ? { amount: Number(asset.split(' ')[0]), symbol: asset.split(' ')[1] }
      : { amount: Number(asset.amount) / 10 ** asset.precision, symbol: NAI_SYMBOLS[asset.nai] }
  if (!Number.isFinite(parsed.amount) || !parsed.symbol) {
    throw new Error(`Invalid asset: ${JSON.stringify(asset)}`)
  }
  return parsed
}

const amountOf = (value: number | AssetInput) =>
  typeof value === 'number' ? value : parseAsset(value).amount

/** Converts VESTS to HIVE Power */
export const vestsToHP = (vests: number | AssetInput, props: VestingProps): number =>
  (amountOf(vests) * amountOf(props.total_vesting_fund_hive)) / amountOf(props.total_vesting_shares)

/** Converts HIVE Power to VESTS */
export const hpToVests = (hp: number | AssetInput, props: VestingProps): number =>
  (amountOf(hp) * amountOf(props.total_vesting_shares)) / amountOf(props.total_vesting_fund_hive)

/**
 * VESTS that give voting power: own + received - delegated - this week's power down.
 * This is also the maximum voting mana, in VESTS.
 */
export const getEffectiveVests = (account: StakeAccount): number => {
  // to_withdraw and withdrawn are in micro-VESTS
  const remainingPowerDown = (Number(account.to_withdraw) - Number(account.withdrawn)) / 1e6
  return (
    amountOf(account.vesting_shares) -
    amountOf(account.delegated_vesting_shares) +
    amountOf(account.received_vesting_shares) -
    Math.min(amountOf(account.vesting_withdraw_rate), remainingPowerDown)
  )
}

const regenerate = (bar: ManabarInput, max: number, now: number): Manabar => {
  const elapsed = Math.max(0, now / 1000 - bar.last_update_time)
  const current = Math.min(
    max,
    Number(bar.current_mana) + Math.floor((max * elapsed) / MANA_REGEN_SECONDS)
  )
  return { current, max, percentage: max > 0 ? (current / max) * 100 : 0 }
}

/** Mana is counted in micro-VESTS */
const maxVotingMana = (account: StakeAccount) => Math.round(getEffectiveVests(account) * 1e6)

/** Upvote mana ("voting power") of an account at `now` (ms) */
export const getVotingMana = (account: StakeAccount, now = Date.now()): Manabar =>
  regenerate(account.voting_manabar, maxVotingMana(account), now)

/** Downvote mana of an account at `now` (ms) */
export const getDownvoteMana = (account: StakeAccount, now = Date.now()): Manabar =>
  regenerate(account.downvote_manabar, Math.floor(maxVotingMana(account) * DOWNVOTE_POOL), now)

/** Resource credits of an account from `rc_api.find_rc_accounts`, at `now` (ms) */
export const getRCMana = (rcAccount: RCAccount, now = Date.now()): Manabar =>
  regenerate(rcAccount.rc_manabar, Number(rcAccount.max_rc), now)

/**
 * rshares a vote adds to a post. `weight` is -10000 to 10000 (-100% to 100%).
 * Since HF28 vote strength depends only on stake and weight, not on current mana;
 * mana only limits how many votes an account can cast.
 */
export const getVoteRShares = (account: StakeAccount, weight = 10000): number => {
  const usedMana = Math.ceil(
    (maxVotingMana(account) * Math.abs(weight) * 86400) /
      10000 /
      (VOTE_POWER_RESERVE_RATE * MANA_REGEN_SECONDS)
  )
  return Math.sign(weight) * Math.max(0, usedMana - VOTE_DUST_THRESHOLD)
}

/** HBD value of rshares at the current reward pool and price (linear reward curve) */
export const rsharesToHBD = (rshares: number, fund: RewardFund, price: Price): number =>
  ((rshares * amountOf(fund.reward_balance)) / Number(fund.recent_claims)) *
  (amountOf(price.base) / amountOf(price.quote))

/** Estimated HBD value of a vote, author and curation rewards combined */
export const getVoteValue = (
  account: StakeAccount,
  fund: RewardFund,
  price: Price,
  weight = 10000
): number => rsharesToHBD(getVoteRShares(account, weight), fund, price)

/** Converts raw reputation (e.g. `"79470587263453"`) to the familiar score (e.g. `66.2`) */
export const formatReputation = (raw: number | string): number => {
  const rep = Number(raw)
  // log10(0) is -Infinity, so 0 maps to 25 without a special case
  return Math.max(Math.log10(Math.abs(rep)) - 9, 0) * Math.sign(rep) * 9 + 25
}
